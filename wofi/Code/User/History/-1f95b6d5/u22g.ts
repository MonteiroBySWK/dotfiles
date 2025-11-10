export interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url: string
}

export interface FileUpload {
  id: string
  name: string
  originalName: string
  size: number
  type: string
  url: string
  thumbnailUrl?: string
  uploadedBy: string
  entityType?: string
  entityId?: string
  tags: string[]
  createdAt: Date
}
