import { useEffect, useMemo, useState } from 'react'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { X, Plus, Pencil, Trash2, GripVertical } from 'lucide-react'
import { Board, Snippet } from '../types'
import { getIcon } from '../utils/icon-registry'

interface BoardManagerDialogProps {
  boards: Board[]
  snippets: Snippet[]
  onClose: () => void
  onEditBoard: (board: Board) => void
  onDeleteBoard: (id: string) => void
  onReorder: (boards: Board[]) => void
  onNewBoard: () => void
}

interface SortableBoardRowProps {
  board: Board
  snippetCount: number
  confirmDelete: string | null
  onEditBoard: (board: Board) => void
  onDeleteBoard: (id: string) => void
  setConfirmDelete: (id: string | null) => void
}

function SortableBoardRow({
  board,
  snippetCount,
  confirmDelete,
  onEditBoard,
  onDeleteBoard,
  setConfirmDelete,
}: SortableBoardRowProps) {
  const Icon = getIcon(board.icon)
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: board.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    opacity: isDragging ? 0.96 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 py-2 border-b border-gray-50 last:border-0 ${
        isDragging ? 'rounded-xl bg-white shadow-lg ring-1 ring-primary/15' : ''
      }`}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        className="flex h-7 w-5 shrink-0 items-center justify-center cursor-grab touch-none text-gray-300 hover:text-gray-500 active:cursor-grabbing"
        title="拖动排序"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={13} />
      </button>

      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
        style={{ backgroundColor: board.color + '12' }}
      >
        <Icon size={14} style={{ color: board.color }} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-medium text-gray-800">{board.name}</div>
        <div className="text-[10px] text-gray-400">{snippetCount} 条内容</div>
      </div>

      <button
        onClick={() => onEditBoard(board)}
        className="flex h-6 w-6 items-center justify-center rounded hover:bg-gray-100 transition-colors"
        title="编辑板块"
      >
        <Pencil size={11} className="text-gray-400" />
      </button>

      <button
        onClick={() => {
          if (confirmDelete === board.id) {
            onDeleteBoard(board.id)
            setConfirmDelete(null)
          } else {
            setConfirmDelete(board.id)
          }
        }}
        title={confirmDelete === board.id ? '再次点击确认删除' : '删除板块'}
        className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
          confirmDelete === board.id ? 'bg-red-50 text-red-500' : 'hover:bg-gray-100 text-gray-400'
        }`}
      >
        <Trash2 size={11} />
      </button>
    </div>
  )
}

export default function BoardManagerDialog({
  boards,
  snippets,
  onClose,
  onEditBoard,
  onDeleteBoard,
  onReorder,
  onNewBoard,
}: BoardManagerDialogProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const sortedBoards = useMemo(() => [...boards].sort((a, b) => a.order - b.order), [boards])
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  )

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const snippetCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const snippet of snippets) {
      counts.set(snippet.boardId, (counts.get(snippet.boardId) ?? 0) + 1)
    }
    return counts
  }, [snippets])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = sortedBoards.findIndex((board) => board.id === active.id)
    const newIndex = sortedBoards.findIndex((board) => board.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(sortedBoards, oldIndex, newIndex).map((board, index) => ({
      ...board,
      order: index,
    }))
    onReorder(reordered)
  }

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative flex max-h-[480px] w-[320px] flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h3 className="text-sm font-semibold text-gray-800">管理板块</h3>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100">
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sortedBoards.map((board) => board.id)} strategy={verticalListSortingStrategy}>
              {sortedBoards.map((board) => (
                <SortableBoardRow
                  key={board.id}
                  board={board}
                  snippetCount={snippetCounts.get(board.id) ?? 0}
                  confirmDelete={confirmDelete}
                  onEditBoard={onEditBoard}
                  onDeleteBoard={onDeleteBoard}
                  setConfirmDelete={setConfirmDelete}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-4 py-2.5">
          <button
            onClick={onNewBoard}
            className="flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary hover:bg-primary/15 transition-colors"
          >
            <Plus size={12} />
            新建板块
          </button>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-3.5 py-1 text-xs text-gray-600 hover:bg-white transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}
