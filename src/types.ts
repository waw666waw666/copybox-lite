export interface Board {
  id: string
  name: string
  icon: string
  color: string
  order: number
  createdAt: number
  updatedAt: number
}

export interface Snippet {
  id: string
  boardId: string
  title: string
  content: string
  note: string
  icon?: string
  color?: string
  order?: number
  createdAt: number
  updatedAt: number
}

export interface Settings {
  defaultBoardId: string
  compactMode: boolean
  clickRowToCopy: boolean
  showCopyToast: boolean
  showSnippetIcons: boolean
}
