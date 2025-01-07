import { create } from 'zustand'

export type ModalType = 'create' | 'edit' | 'delete'
export type EntityType = 'attribute' | 'attributeType' | 'deliveryMethod' | 'productStatus' | 'socialNetwork'

interface ModalData {
  id?: number
  [key: string]: any
}

interface ModalStore {
  type: ModalType | null
  entityType: EntityType | null
  data: ModalData | null
  isOpen: boolean
  onOpen: (type: ModalType, entityType: EntityType, data?: ModalData) => void
  onClose: () => void
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  entityType: null,
  data: null,
  isOpen: false,
  onOpen: (type, entityType, data = undefined) => set({ isOpen: true, type, entityType, data }),
  onClose: () => set({ type: null, isOpen: false, data: null, entityType: null })
}))

