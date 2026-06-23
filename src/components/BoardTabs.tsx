import { useRef, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Board } from '../types'
import { getIcon } from '../utils/icon-registry'

interface BoardTabsProps {
  boards: Board[]
  activeBoardId: string
  onSelect: (id: string) => void
  onAddBoard: () => void
}

export default function BoardTabs({ boards, activeBoardId, onSelect, onAddBoard }: BoardTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const sorted = [...boards].sort((a, b) => a.order - b.order)

  useEffect(() => {
    if (scrollRef.current) {
      const active = scrollRef.current.querySelector('[data-active="true"]')
      if (active) {
        active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [activeBoardId])

  return (
    <div
      ref={scrollRef}
      className="flex items-center gap-1 overflow-x-auto border-b border-slate-100/90 px-2.5 no-scrollbar"
      style={{ scrollbarWidth: 'none' }}
    >
      <button
        onClick={onAddBoard}
        className="flex h-7 w-7 shrink-0 items-center justify-center self-center rounded-xl text-primary transition-colors hover:bg-white/90 hover:text-primary-hover"
        title="新建板块"
      >
        <Plus size={13} />
      </button>
      {sorted.map((board) => {
        const Icon = getIcon(board.icon)
        const isActive = board.id === activeBoardId
        return (
          <button
            key={board.id}
            data-active={isActive}
            onClick={() => onSelect(board.id)}
            className={`flex shrink-0 items-center gap-1 whitespace-nowrap rounded-xl px-2 py-1 text-[10px] font-medium
              border border-transparent transition-colors
              ${
                isActive
                  ? 'border-primary/10 bg-white text-primary shadow-[0_3px_8px_rgba(37,99,235,0.08)]'
                  : 'text-gray-500 hover:bg-white/80 hover:text-gray-700'
              }`}
          >
            <Icon size={11} style={isActive ? { color: board.color } : undefined} />
            <span>{board.name}</span>
          </button>
        )
      })}
    </div>
  )
}
