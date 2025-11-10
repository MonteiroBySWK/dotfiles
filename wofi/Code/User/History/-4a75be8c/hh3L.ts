"use client"

import { useState, useCallback } from "react"

export interface ModalState {
  isOpen: boolean
  data?: unknown
  type?: string
}

export const useModal = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    data: null,
    type: ""
  })

  const openModal = useCallback((type: string, data?: unknown) => {
    setModalState({
      isOpen: true,
      type,
      data
    })
  }, [])

  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      data: null,
      type: ""
    })
  }, [])

  const updateModalData = useCallback((data: unknown) => {
    setModalState(prev => ({
      ...prev,
      data
    }))
  }, [])

  return {
    modalState,
    openModal,
    closeModal,
    updateModalData,
    isOpen: modalState.isOpen,
    data: modalState.data,
    type: modalState.type
  }
}

export type UseModalReturn = ReturnType<typeof useModal>
