"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { toast } from "sonner"
import { EventSourcePolyfill } from "event-source-polyfill"

const SSE_URL = process.env.NEXT_PUBLIC_SSE_URL || "http://localhost:8081"
const SSE_RETRY_INTERVAL = 5000 // 5 seconds
const SSE_MAX_RETRIES = 5

export interface HealthDataUpdate {
  type: "connected" | "health-update" | "error"
  employeeId?: string
  bpm?: number
  spo2?: number
  stressLevel?: number
  skinTemp?: number
  timestamp?: string
  message?: string
}

export interface SSEConnectionState {
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  lastUpdate: string | null
}

export function useSSEHealthData() {
  const [healthData, setHealthData] = useState<Map<string, HealthDataUpdate>>(new Map())
  const [connectionState, setConnectionState] = useState<SSEConnectionState>({
    isConnected: false,
    isConnecting: true,
    error: null,
    lastUpdate: null,
  })
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  const [retryCount, setRetryCount] = useState(0)
  
  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    if (retryCount >= SSE_MAX_RETRIES) {
      setConnectionState((prev) => ({
        ...prev,
        isConnecting: false,
        error: "Maximum retry attempts reached. Please refresh the page.",
      }))
      toast.error("Connection failed after multiple attempts")
      return
    }

    setConnectionState((prev) => ({
      ...prev,
      isConnecting: true,
      error: null,
    }))

    const token = localStorage.getItem("token")
    if (!token) {
      setConnectionState((prev) => ({
        ...prev,
        isConnecting: false,
        error: "No authentication token found",
      }))
      return
    }

    try {
      const url = new URL(`${SSE_URL}/healthdata/sse`)
      url.searchParams.append("employeeId", "all")

      const eventSource = new EventSourcePolyfill(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
        heartbeatTimeout: 30000,
      })

      eventSource.onopen = () => {
        setConnectionState((prev) => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          error: null,
        }))
        toast.success("Connected to health data stream")
      }

      eventSource.onmessage = (event) => {
        try {
          const data: HealthDataUpdate = JSON.parse(event.data)
          if (data.type === "health-update" && data.employeeId) {
            setHealthData((prev) => new Map(prev.set(data.employeeId!, data)))
            setConnectionState((prev) => ({
              ...prev,
              lastUpdate: new Date().toISOString(),
            }))
          }
        } catch (error) {
          console.error("Error parsing SSE message:", error)
        }
      }

      eventSource.onerror = (error) => {
        console.error("SSE connection error: ", error)
        setConnectionState((prev) => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
          error: "Connection error",
        }))
        eventSource.close()

        // Limpar o timeout anterior se houver
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
        }

        // Tentar reconectar após 5 segundos
        reconnectTimeoutRef.current = setTimeout(() => {
          toast.info("Attempting to reconnect...")
          connect()
        }, 5000)
      }

      eventSourceRef.current = eventSource
    } catch (error) {
      console.error("Error creating SSE connection:", error)
      setConnectionState((prev) => ({
        ...prev,
        isConnecting: false,
        error: "Failed to create connection",
      }))
    }
  }, [])

  useEffect(() => {
    connect()
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [connect])

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    setConnectionState((prev) => ({
      ...prev,
      isConnected: false,
      isConnecting: false,
    }))
  }, [])

  const reconnect = useCallback(() => {
    disconnect()
    connect()
  }, [connect, disconnect])

  return {
    healthData,
    connectionState,
    reconnect,
    disconnect,
  }
}
