import { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { Board, Snippet } from '../types'
import { getIcon } from '../utils/icon-registry'

interface SnippetDialogProps {
  mode: 'add' | 'edit'
  board: Board
  snippet?: Snippet
  onSave: (title: string, content: string) => void
  onDelete?: () => void
  onClose: () => void
}

export default function SnippetDialog({
  mode,
  board,
  snippet,
  onSave,
  onDelete,
  onClose,
}: SnippetDialogProps) {
  const [title, setTitle] = useState(snippet?.title || '')
  const [content, setContent] = useState(snippet?.content || '')
  const [error, setError] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const Icon = getIcon(board.icon)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const handleSave = () => {
    if (!content.trim()) {
      setError('请输入内容')
      return
    }
    onSave(title.trim(), content.trim())
  }

  const handleDelete = () => {
    if (showConfirm) {
      onDelete?.()
      return
    }
    setShowConfirm(true)
  }

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative flex max-h-[520px] w-[320px] flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10">
                {mode === 'add' ? (
                  <Plus size={12} className="text-primary" />
                ) : (
                  <span className="text-[10px] font-bold text-primary">E</span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-gray-800">
                {mode === 'add' ? '新增内容' : '编辑内容'}
              </h3>
            </div>
            <div className="ml-7 mt-0.5 flex items-center gap-1 text-[11px] text-gray-400">
              <span>当前板块</span>
              <Icon size={12} style={{ color: board.color }} />
              <span>{board.name}</span>
            </div>
          </div>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100">
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-3 px-4 pb-4">
          <div>
            <label className="mb-1 block text-[11px] text-gray-500">
              标题 <span className="text-gray-400">（可选）</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`例如：${board.name}`}
              maxLength={50}
              className="h-8 w-full rounded-lg border border-gray-200 px-2.5 text-xs
                         placeholder:text-gray-300 focus:border-primary focus:outline-none
                         focus:ring-1 focus:ring-primary/20 transition-colors"
            />
          </div>

          <div className="flex flex-1 flex-col">
            <label className="mb-1 block text-[11px] text-gray-500">
              内容 <span className="text-red-400">（必填）</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                if (error) setError('')
              }}
              placeholder="请输入要保存的文本内容..."
              className="min-h-[100px] flex-1 w-full resize-none rounded-lg border border-gray-200 px-2.5 py-2 text-xs
                         placeholder:text-gray-300 focus:border-primary focus:outline-none
                         focus:ring-1 focus:ring-primary/20 transition-colors"
            />
            <div className="mt-0.5 text-right text-[10px] text-gray-300">{content.length} 字</div>
          </div>

          {error && <div className="-mt-2 text-[11px] text-red-500">{error}</div>}

          <div className="flex items-center justify-between pt-0.5">
            {mode === 'edit' && onDelete ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDelete}
                  className={`flex items-center gap-1 text-[11px] transition-colors ${
                    showConfirm ? 'font-medium text-red-600' : 'text-red-400 hover:text-red-500'
                  }`}
                >
                  <Trash2 size={12} />
                  删除
                </button>
                {showConfirm && (
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="text-[11px] text-gray-400 hover:text-gray-500"
                  >
                    取消
                  </button>
                )}
              </div>
            ) : (
              <div />
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="rounded-lg border border-gray-200 px-3.5 py-1 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="rounded-lg bg-primary px-4 py-1 text-xs text-white hover:bg-primary-hover transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
