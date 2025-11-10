"use client"

import { useState, useCallback } from "react"

export interface ModalState {
  isOpen: boolean
  data?: any
  type?: string
}

export const useModal = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    data: null,
    type: ""
  })

  const openModal = useCallback((type: string, data?: any) => {
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

  const updateModalData = useCallback((data: any) => {
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
