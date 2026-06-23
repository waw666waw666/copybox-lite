import { useMemo, useRef, useState } from 'react'
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
import { Copy, Pencil, Trash2, Inbox, Check, GripVertical } from 'lucide-react'
import { Snippet, Board, Settings } from '../types'
import { getIcon } from '../utils/icon-registry'
import { autoDetectIcon } from '../utils/auto-detect'
import IconPickerPopover from './IconPickerPopover'

interface SnippetListProps {
  snippets: Snippet[]
  activeBoard: Board | undefined
  settings: Settings
  batchMode?: boolean
  selectedIds?: Set<string>
  onCopy: (content: string) => void
  onEdit: (snippet: Snippet) => void
  onDelete: (id: string) => void
  onAdd: () => void
  onIconChange: (snippetId: string, icon: string) => void
  onColorChange: (snippetId: string, color: string) => void
  onToggleSelect?: (id: string) => void
  onReorder: (snippets: Snippet[]) => void
  reorderEnabled?: boolean
}

interface SortableSnippetItemProps {
  snippet: Snippet
  activeBoard: Board
  settings: Settings
  batchMode: boolean
  isSelected: boolean
  onCopy: (content: string) => void
  onEdit: (snippet: Snippet) => void
  onDelete: (id: string) => void
  onIconChange: (snippetId: string, icon: string) => void
  onColorChange: (snippetId: string, color: string) => void
  onToggleSelect?: (id: string) => void
  reorderEnabled: boolean
  compact: boolean
}

function SortableSnippetItem({
  snippet,
  activeBoard,
  settings,
  batchMode,
  isSelected,
  onCopy,
  onEdit,
  onDelete,
  onIconChange,
  onColorChange,
  onToggleSelect,
  reorderEnabled,
  compact,
}: SortableSnippetItemProps) {
  const [pickerSnippetId, setPickerSnippetId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const resolvedIcon = snippet.icon || autoDetectIcon(snippet.title, snippet.content) || activeBoard.icon
  const resolvedColor = snippet.color || activeBoard.color
  const DisplayIcon = getIcon(resolvedIcon)
  const isPickerOpen = pickerSnippetId === snippet.id
  const iconButtonRef = useRef<HTMLButtonElement | null>(null)
  const showSnippetIcons = settings.showSnippetIcons !== false

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: snippet.id,
    disabled: batchMode || !reorderEnabled,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
    opacity: isDragging ? 0.96 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={
        batchMode
          ? () => onToggleSelect?.(snippet.id)
          : settings.clickRowToCopy
            ? () => onCopy(snippet.content)
            : undefined
      }
      className={`group relative flex items-center gap-1.5 rounded-lg border border-transparent bg-white/82
        ${compact ? 'px-1.5 py-1' : 'px-1.5 py-1.5'}
        ${batchMode ? 'cursor-pointer' : settings.clickRowToCopy ? 'cursor-pointer' : ''}
        ${isSelected ? 'border-primary/15 bg-primary/[0.04]' : ''}
        ${
          isDragging
            ? 'bg-white shadow-[0_12px_24px_rgba(15,23,42,0.12)] ring-1 ring-primary/15'
            : 'shadow-[0_2px_8px_rgba(15,23,42,0.028)]'
        }
        hover:border-slate-100 hover:bg-white hover:shadow-[0_6px_14px_rgba(15,23,42,0.04)] transition-[background-color,border-color,box-shadow,opacity] duration-200 ease-out`}
    >
      {batchMode ? (
        <div
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors
            ${isSelected ? 'border-primary bg-primary' : 'border-gray-300'}`}
        >
          {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
        </div>
      ) : (
        <>
          <button
            ref={setActivatorNodeRef}
            type="button"
            onClick={(e) => e.stopPropagation()}
            className={`${compact ? 'h-4 w-4' : 'h-5 w-4'} flex shrink-0 items-center justify-center rounded-md transition-colors ${
              reorderEnabled
                ? 'cursor-grab touch-none text-gray-300 hover:bg-gray-50 hover:text-gray-500 active:cursor-grabbing'
                : 'cursor-default text-gray-200'
            }`}
            title={reorderEnabled ? '拖动排序' : '搜索时暂不支持排序'}
            {...attributes}
            {...listeners}
          >
            <GripVertical size={compact ? 10 : 12} />
          </button>

          {showSnippetIcons && (
            <button
              ref={iconButtonRef}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setPickerSnippetId(isPickerOpen ? null : snippet.id)
              }}
              className={`${compact ? 'h-5 w-5' : 'h-7 w-7'} flex shrink-0 items-center justify-center rounded-lg transition-all duration-200 hover:opacity-90`}
              style={{ backgroundColor: `${resolvedColor}0d` }}
              title="图标和颜色"
            >
              <DisplayIcon size={compact ? 10 : 13} style={{ color: resolvedColor }} />
            </button>
          )}
        </>
      )}

      {showSnippetIcons && isPickerOpen && (
        <IconPickerPopover
          anchorRef={iconButtonRef}
          currentIcon={resolvedIcon}
          currentColor={resolvedColor}
          onSelect={(icon) => onIconChange(snippet.id, icon)}
          onColorChange={(color) => onColorChange(snippet.id, color)}
          onClose={() => setPickerSnippetId(null)}
        />
      )}

      <div className="min-w-0 flex-1">
        {snippet.title && (
          <div className="truncate text-[11px] font-medium leading-tight text-gray-800">
            {snippet.title}
          </div>
        )}
        <div
          className={`truncate text-gray-500 ${compact ? 'text-[10px] leading-tight' : 'text-[11px] leading-[1.25]'}`}
        >
          {snippet.content}
        </div>
      </div>

      {!batchMode && (
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(snippet)
            }}
            className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} flex items-center justify-center rounded-md transition-colors hover:bg-gray-100`}
            title="编辑"
          >
            <Pencil size={compact ? 10 : 11} className="text-gray-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (confirmDeleteId === snippet.id) {
                onDelete(snippet.id)
                setConfirmDeleteId(null)
              } else {
                setConfirmDeleteId(snippet.id)
                setTimeout(() => setConfirmDeleteId(null), 2000)
              }
            }}
            className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} flex items-center justify-center rounded-md transition-colors ${
              confirmDeleteId === snippet.id ? 'bg-red-50 text-red-500' : 'text-gray-400 hover:bg-gray-100'
            }`}
            title={confirmDeleteId === snippet.id ? '再次点击确认删除' : '删除'}
          >
            <Trash2 size={compact ? 10 : 11} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onCopy(snippet.content)
            }}
            className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} flex items-center justify-center rounded-md bg-primary transition-colors hover:bg-primary-hover`}
            title="复制"
          >
            <Copy size={compact ? 10 : 11} className="text-white" />
          </button>
        </div>
      )}
    </div>
  )
}

export default function SnippetList({
  snippets,
  activeBoard,
  settings,
  batchMode = false,
  selectedIds = new Set(),
  onCopy,
  onEdit,
  onDelete,
  onAdd,
  onIconChange,
  onColorChange,
  onToggleSelect,
  onReorder,
  reorderEnabled = true,
}: SnippetListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  )

  const itemIds = useMemo(() => snippets.map((snippet) => snippet.id), [snippets])

  if (!activeBoard) return null

  if (snippets.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
        <Inbox size={32} strokeWidth={1.2} />
        <div className="text-xs">还没有内容</div>
        <button onClick={onAdd} className="text-[11px] text-primary transition-colors hover:text-primary-hover">
          点击右上角 + 添加第一条内容
        </button>
      </div>
    )
  }

  const compact = settings.compactMode

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = snippets.findIndex((snippet) => snippet.id === active.id)
    const newIndex = snippets.findIndex((snippet) => snippet.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    onReorder(arrayMove(snippets, oldIndex, newIndex))
  }

  const list = (
    <div className="space-y-1 px-1.5 py-1.5">
      {snippets.map((snippet) => (
        <SortableSnippetItem
          key={snippet.id}
          snippet={snippet}
          activeBoard={activeBoard}
          settings={settings}
          batchMode={batchMode}
          isSelected={selectedIds.has(snippet.id)}
          onCopy={onCopy}
          onEdit={onEdit}
          onDelete={onDelete}
          onIconChange={onIconChange}
          onColorChange={onColorChange}
          onToggleSelect={onToggleSelect}
          reorderEnabled={reorderEnabled && !batchMode}
          compact={compact}
        />
      ))}
    </div>
  )

  if (!reorderEnabled || batchMode) {
    return list
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        {list}
      </SortableContext>
    </DndContext>
  )
}
