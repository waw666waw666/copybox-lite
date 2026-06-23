import { Board, Snippet, Settings } from '../types'

const STORAGE_KEYS = {
  BOARDS: 'copybox_boards',
  SNIPPETS: 'copybox_snippets',
  SETTINGS: 'copybox_settings',
} as const

const now = Date.now()

const DEFAULT_BOARDS: Board[] = [
  { id: 'b1', name: '邮件', icon: 'mail', color: '#2563EB', order: 0, createdAt: now, updatedAt: now },
  { id: 'b2', name: '提示词', icon: 'file-text', color: '#8B5CF6', order: 1, createdAt: now, updatedAt: now },
  { id: 'b3', name: '链接', icon: 'link', color: '#10B981', order: 2, createdAt: now, updatedAt: now },
  { id: 'b4', name: '回复', icon: 'message-square', color: '#F59E0B', order: 3, createdAt: now, updatedAt: now },
  { id: 'b5', name: '账号', icon: 'user', color: '#EC4899', order: 4, createdAt: now, updatedAt: now },
  { id: 'b6', name: '代码', icon: 'code', color: '#6366F1', order: 5, createdAt: now, updatedAt: now },
]

const DEFAULT_SETTINGS: Settings = {
  defaultBoardId: 'b1',
  compactMode: false,
  clickRowToCopy: true,
  showCopyToast: true,
  showSnippetIcons: true,
}

function isChromeStorageAvailable(): boolean {
  return typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local !== undefined
}

function normalizeSnippets(snippets: Snippet[]): Snippet[] {
  const boardOrderMap = new Map<string, number>()
  return [...snippets]
    .sort((a, b) => {
      if (a.boardId !== b.boardId) return a.boardId.localeCompare(b.boardId)
      const aOrder = a.order ?? a.createdAt
      const bOrder = b.order ?? b.createdAt
      return aOrder - bOrder
    })
    .map((snippet) => {
      const nextOrder = boardOrderMap.get(snippet.boardId) ?? 0
      boardOrderMap.set(snippet.boardId, nextOrder + 1)
      return snippet.order === nextOrder ? snippet : { ...snippet, order: nextOrder }
    })
}

export async function getBoards(): Promise<Board[]> {
  if (isChromeStorageAvailable()) {
    return new Promise((resolve) => {
      chrome.storage.local.get(STORAGE_KEYS.BOARDS, (result) => {
        const boards = result[STORAGE_KEYS.BOARDS] as Board[] | undefined
        if (boards && boards.length > 0) {
          resolve(boards)
        } else {
          chrome.storage.local.set({ [STORAGE_KEYS.BOARDS]: DEFAULT_BOARDS })
          resolve(DEFAULT_BOARDS)
        }
      })
    })
  }

  const stored = localStorage.getItem(STORAGE_KEYS.BOARDS)
  if (stored) {
    const boards = JSON.parse(stored) as Board[]
    if (boards.length > 0) return boards
  }

  localStorage.setItem(STORAGE_KEYS.BOARDS, JSON.stringify(DEFAULT_BOARDS))
  return DEFAULT_BOARDS
}

export async function saveBoards(boards: Board[]): Promise<void> {
  if (isChromeStorageAvailable()) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEYS.BOARDS]: boards }, resolve)
    })
  }

  localStorage.setItem(STORAGE_KEYS.BOARDS, JSON.stringify(boards))
}

export async function getSnippets(): Promise<Snippet[]> {
  if (isChromeStorageAvailable()) {
    return new Promise((resolve) => {
      chrome.storage.local.get(STORAGE_KEYS.SNIPPETS, (result) => {
        resolve(normalizeSnippets(result[STORAGE_KEYS.SNIPPETS] || []))
      })
    })
  }

  const stored = localStorage.getItem(STORAGE_KEYS.SNIPPETS)
  return stored ? normalizeSnippets(JSON.parse(stored)) : []
}

export async function saveSnippets(snippets: Snippet[]): Promise<void> {
  const normalized = normalizeSnippets(snippets)
  if (isChromeStorageAvailable()) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEYS.SNIPPETS]: normalized }, resolve)
    })
  }

  localStorage.setItem(STORAGE_KEYS.SNIPPETS, JSON.stringify(normalized))
}

export async function getSettings(): Promise<Settings> {
  if (isChromeStorageAvailable()) {
    return new Promise((resolve) => {
      chrome.storage.local.get(STORAGE_KEYS.SETTINGS, (result) => {
        resolve({ ...DEFAULT_SETTINGS, ...(result[STORAGE_KEYS.SETTINGS] || {}) })
      })
    })
  }

  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS)
  return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS
}

export async function saveSettings(settings: Settings): Promise<void> {
  if (isChromeStorageAvailable()) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: settings }, resolve)
    })
  }

  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
}

export async function exportAll(): Promise<string> {
  const boards = await getBoards()
  const snippets = await getSnippets()
  const settings = await getSettings()
  return JSON.stringify({ boards, snippets, settings }, null, 2)
}

export async function importAll(json: string): Promise<void> {
  const data = JSON.parse(json)
  if (!data.boards || !data.snippets || !data.settings) {
    throw new Error('格式无效')
  }

  const normalizedSnippets = normalizeSnippets(data.snippets)

  if (isChromeStorageAvailable()) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set(
        {
          [STORAGE_KEYS.BOARDS]: data.boards,
          [STORAGE_KEYS.SNIPPETS]: normalizedSnippets,
          [STORAGE_KEYS.SETTINGS]: data.settings,
        },
        () => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message))
          } else {
            resolve()
          }
        }
      )
    })
  }

  localStorage.setItem(STORAGE_KEYS.BOARDS, JSON.stringify(data.boards))
  localStorage.setItem(STORAGE_KEYS.SNIPPETS, JSON.stringify(normalizedSnippets))
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings))
}

export async function clearAll(): Promise<void> {
  if (isChromeStorageAvailable()) {
    return new Promise((resolve) => {
      chrome.storage.local.remove(
        [STORAGE_KEYS.BOARDS, STORAGE_KEYS.SNIPPETS, STORAGE_KEYS.SETTINGS],
        resolve
      )
    })
  }

  localStorage.removeItem(STORAGE_KEYS.BOARDS)
  localStorage.removeItem(STORAGE_KEYS.SNIPPETS)
  localStorage.removeItem(STORAGE_KEYS.SETTINGS)
}
