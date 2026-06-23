import { useState, useEffect, useCallback } from 'react'
import { Board, Snippet, Settings } from './types'
import { getBoards, saveBoards, getSnippets, saveSnippets, getSettings, saveSettings } from './utils/storage'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import BoardTabs from './components/BoardTabs'
import SnippetList from './components/SnippetList'
import Footer from './components/Footer'
import SnippetDialog from './components/SnippetDialog'
import BoardManagerDialog from './components/BoardManagerDialog'
import CategoryDialog from './components/CategoryDialog'
import SettingsDialog from './components/SettingsDialog'
import Toast from './components/Toast'

function getSnippetOrder(snippet: Snippet): number {
  return snippet.order ?? snippet.createdAt
}

export default function App() {
  const [boards, setBoards] = useState<Board[]>([])
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [activeBoardId, setActiveBoardId] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const [showAddSnippet, setShowAddSnippet] = useState(false)
  const [editSnippet, setEditSnippet] = useState<Snippet | null>(null)
  const [showBoardManager, setShowBoardManager] = useState(false)
  const [editBoard, setEditBoard] = useState<Board | null>(null)
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [batchMode, setBatchMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState('')

  useEffect(() => {
    ;(async () => {
      const [loadedBoards, loadedSnippets, loadedSettings] = await Promise.all([
        getBoards(),
        getSnippets(),
        getSettings(),
      ])

      setBoards(loadedBoards)
      setSnippets(loadedSnippets)
      setSettings(loadedSettings)

      const sortedBoards = [...loadedBoards].sort((a, b) => a.order - b.order)
      const defaultId =
        loadedSettings.defaultBoardId && loadedBoards.some((board) => board.id === loadedSettings.defaultBoardId)
          ? loadedSettings.defaultBoardId
          : sortedBoards[0]?.id || ''

      setActiveBoardId(defaultId)
    })()
  }, [])

  const activeBoard = boards.find((board) => board.id === activeBoardId)
  const boardSnippets = [...snippets]
    .filter((snippet) => snippet.boardId === activeBoardId)
    .sort((a, b) => getSnippetOrder(a) - getSnippetOrder(b))
    .filter((snippet) => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        snippet.title.toLowerCase().includes(query) ||
        snippet.content.toLowerCase().includes(query) ||
        snippet.note.toLowerCase().includes(query)
      )
    })

  const showToast = useCallback((message: string) => {
    setToast(message)
    setTimeout(() => setToast(''), 1500)
  }, [])

  const handleCopy = useCallback(
    async (content: string) => {
      await navigator.clipboard.writeText(content)
      if (settings?.showCopyToast !== false) showToast('已复制')
    },
    [settings, showToast]
  )

  const handleAddSnippet = useCallback(
    async (title: string, content: string) => {
      const nextOrder =
        snippets
          .filter((snippet) => snippet.boardId === activeBoardId)
          .reduce((max, snippet) => Math.max(max, snippet.order ?? -1), -1) + 1

      const newSnippet: Snippet = {
        id: 's' + Date.now(),
        boardId: activeBoardId,
        title,
        content,
        note: '',
        order: nextOrder,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      const updated = [...snippets, newSnippet]
      setSnippets(updated)
      await saveSnippets(updated)
      setShowAddSnippet(false)
    },
    [activeBoardId, snippets]
  )

  const handleUpdateSnippet = useCallback(
    async (id: string, title: string, content: string) => {
      const updated = snippets.map((snippet) =>
        snippet.id === id ? { ...snippet, title, content, updatedAt: Date.now() } : snippet
      )
      setSnippets(updated)
      await saveSnippets(updated)
      setEditSnippet(null)
    },
    [snippets]
  )

  const handleDeleteSnippet = useCallback(
    async (id: string) => {
      const updated = snippets.filter((snippet) => snippet.id !== id)
      setSnippets(updated)
      await saveSnippets(updated)
      setEditSnippet(null)
    },
    [snippets]
  )

  const handleIconChange = useCallback(
    async (snippetId: string, icon: string) => {
      const updated = snippets.map((snippet) =>
        snippet.id === snippetId ? { ...snippet, icon, updatedAt: Date.now() } : snippet
      )
      setSnippets(updated)
      await saveSnippets(updated)
    },
    [snippets]
  )

  const handleColorChange = useCallback(
    async (snippetId: string, color: string) => {
      const updated = snippets.map((snippet) =>
        snippet.id === snippetId ? { ...snippet, color, updatedAt: Date.now() } : snippet
      )
      setSnippets(updated)
      await saveSnippets(updated)
    },
    [snippets]
  )

  const handleAddBoard = useCallback(
    async (name: string, icon: string, color: string) => {
      const newBoard: Board = {
        id: 'b' + Date.now(),
        name,
        icon,
        color,
        order: boards.length,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      const updated = [...boards, newBoard]
      setBoards(updated)
      await saveBoards(updated)
      setActiveBoardId(newBoard.id)
      setShowCategoryDialog(false)
    },
    [boards]
  )

  const handleUpdateBoard = useCallback(
    async (id: string, name: string, icon: string, color: string) => {
      const updated = boards.map((board) =>
        board.id === id ? { ...board, name, icon, color, updatedAt: Date.now() } : board
      )
      setBoards(updated)
      await saveBoards(updated)
      setEditBoard(null)
      setShowCategoryDialog(false)
    },
    [boards]
  )

  const handleDeleteBoard = useCallback(
    async (id: string) => {
      const updatedBoards = boards.filter((board) => board.id !== id)
      setBoards(updatedBoards)
      await saveBoards(updatedBoards)

      const updatedSnippets = snippets.filter((snippet) => snippet.boardId !== id)
      setSnippets(updatedSnippets)
      await saveSnippets(updatedSnippets)

      if (activeBoardId === id && updatedBoards.length > 0) {
        setActiveBoardId(updatedBoards.sort((a, b) => a.order - b.order)[0].id)
      }
    },
    [boards, snippets, activeBoardId]
  )

  const handleReorderBoards = useCallback(async (reordered: Board[]) => {
    setBoards(reordered)
    await saveBoards(reordered)
  }, [])

  const handleUpdateSettings = useCallback(async (newSettings: Settings) => {
    setSettings(newSettings)
    await saveSettings(newSettings)
  }, [])

  const handleReorderSnippets = useCallback(
    async (reorderedBoardSnippets: Snippet[]) => {
      const reorderedMap = new Map(
        reorderedBoardSnippets.map((snippet, index) => [
          snippet.id,
          { ...snippet, order: index, updatedAt: Date.now() },
        ])
      )

      const updated = snippets.map((snippet) => reorderedMap.get(snippet.id) ?? snippet)
      setSnippets(updated)
      await saveSnippets(updated)
    },
    [snippets]
  )

  const handleBatchDelete = useCallback(async () => {
    if (selectedIds.size === 0) return

    const updated = snippets.filter((snippet) => !selectedIds.has(snippet.id))
    setSnippets(updated)
    await saveSnippets(updated)
    setSelectedIds(new Set())
    setBatchMode(false)
    showToast(`已删除 ${selectedIds.size} 条内容`)
  }, [snippets, selectedIds, showToast])

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  if (!settings) return null

  return (
    <div className="popup-root">
      <header className="popup-header">
        <Header onAdd={() => setShowAddSnippet(true)} onSettings={() => setShowSettings(true)} />
      </header>

      <div className="popup-search">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <nav className="popup-tabs">
        <BoardTabs
          boards={boards}
          activeBoardId={activeBoardId}
          onSelect={setActiveBoardId}
          onAddBoard={() => {
            setEditBoard(null)
            setShowCategoryDialog(true)
          }}
        />
      </nav>

      <main className="popup-content">
        <SnippetList
          snippets={boardSnippets}
          activeBoard={activeBoard}
          settings={settings}
          batchMode={batchMode}
          selectedIds={selectedIds}
          onCopy={handleCopy}
          onEdit={setEditSnippet}
          onDelete={handleDeleteSnippet}
          onAdd={() => setShowAddSnippet(true)}
          onIconChange={handleIconChange}
          onColorChange={handleColorChange}
          onToggleSelect={toggleSelect}
          onReorder={handleReorderSnippets}
          reorderEnabled={!searchQuery}
        />
      </main>

      <footer className="popup-footer">
        <Footer
          onManageBoards={() => setShowBoardManager(true)}
          onBatchManage={() => {
            if (batchMode) {
              setBatchMode(false)
              setSelectedIds(new Set())
            } else {
              setBatchMode(true)
            }
          }}
          batchMode={batchMode}
          selectedCount={selectedIds.size}
          onBatchDelete={handleBatchDelete}
        />
      </footer>

      {showAddSnippet && activeBoard && (
        <SnippetDialog
          mode="add"
          board={activeBoard}
          onSave={handleAddSnippet}
          onClose={() => setShowAddSnippet(false)}
        />
      )}

      {editSnippet && activeBoard && (
        <SnippetDialog
          mode="edit"
          board={activeBoard}
          snippet={editSnippet}
          onSave={(title, content) => handleUpdateSnippet(editSnippet.id, title, content)}
          onDelete={() => handleDeleteSnippet(editSnippet.id)}
          onClose={() => setEditSnippet(null)}
        />
      )}

      {showBoardManager && (
        <BoardManagerDialog
          boards={boards}
          snippets={snippets}
          onClose={() => {
            setShowBoardManager(false)
            setEditBoard(null)
          }}
          onEditBoard={(board) => {
            setEditBoard(board)
            setShowBoardManager(false)
            setShowCategoryDialog(true)
          }}
          onDeleteBoard={handleDeleteBoard}
          onReorder={handleReorderBoards}
          onNewBoard={() => {
            setEditBoard(null)
            setShowBoardManager(false)
            setShowCategoryDialog(true)
          }}
        />
      )}

      {showCategoryDialog && (
        <CategoryDialog
          editBoard={editBoard}
          onSave={
            editBoard
              ? (name, icon, color) => handleUpdateBoard(editBoard.id, name, icon, color)
              : handleAddBoard
          }
          onClose={() => {
            setShowCategoryDialog(false)
            setEditBoard(null)
          }}
        />
      )}

      {showSettings && (
        <SettingsDialog
          settings={settings}
          boards={boards}
          onUpdate={handleUpdateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {toast && <Toast message={toast} />}
    </div>
  )
}
