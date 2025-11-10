"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { EventSourcePolyfill } from "event-source-polyfill";

export interface HealthDataUpdate {
  type: "connected" | "health-update" | "error";
  employeeId?: string;
  bpm?: number;
  spo2?: number;
  stressLevel?: number;
  skinTemp?: number;
  timestamp?: string;
  message?: string;
}

export interface SSEConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  lastUpdate: string | null;
}

export function useSSEHealthData() {
  const [healthData, setHealthData] = useState<Map<string, HealthDataUpdate>>(new Map());
  const [connectionState, setConnectionState] = useState<SSEConnectionState>({
    isConnected: false,
    isConnecting: true,
    error: null,
    lastUpdate: null,
  });
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setConnectionState((prev) => ({
      ...prev,
      isConnecting: true,
      error: null,
    }));

    const token = localStorage.getItem("token");
    if (!token) {
      setConnectionState((prev) => ({
        ...prev,
        isConnecting: false,
        error: "No authentication token found",
      }));
      return;
    }

    try {
      const url = new URL("http://localhost:8081/healthdata/sse");
      url.searchParams.append("employeeId", "all");

      eventSourceRef.current = new EventSourcePolyfill(url.toString(), {
        withCredentials: true,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "text/event-stream",
        },
      });

      eventSourceRef.current.onopen = () => {
        setConnectionState((prev) => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          error: null,
        }));
        toast.success("Connected to health data stream");
      };

      eventSourceRef.current.onmessage = (event) => {
        try {
          const data: HealthDataUpdate = JSON.parse(event.data);
          if (data.type === "health-update" && data.employeeId) {
            setHealthData((prev) => new Map(prev.set(data.employeeId!, data)));
            setConnectionState((prev) => ({
              ...prev,
              lastUpdate: new Date().toISOString(),
            }));
          }
        } catch (error) {
          console.error("Error parsing SSE message:", error);
        }
      };

      eventSourceRef.current.onerror = (error) => {
        console.error("SSE connection error: ", error);
        setConnectionState((prev) => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
          error: "Connection error",
        }));
        toast.error("Lost connection to health data stream. Reconnecting...");
        
        // Tentar reconectar após 5 segundos
        setTimeout(connect, 5000);
      };
    } catch (error) {
      console.error("Error creating SSE connection:", error);
      setConnectionState((prev) => ({
        ...prev,
        isConnecting: false,
        error: "Failed to create connection",
      }));
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [connect]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setConnectionState((prev) => ({
      ...prev,
      isConnected: false,
      isConnecting: false,
    }));
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    connect();
  }, [connect, disconnect]);

  return {
    healthData,
    connectionState,
    reconnect,
    disconnect,
  };
}
