import { Copy, Plus, Settings } from 'lucide-react'

interface HeaderProps {
  onAdd: () => void
  onSettings: () => void
}

export default function Header({ onAdd, onSettings }: HeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100/90 px-3 py-1.5">
      <div className="flex items-center gap-1.5">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary shadow-[0_4px_10px_rgba(37,99,235,0.16)]">
          <Copy size={12} className="text-white" strokeWidth={2.2} />
        </div>
        <span className="text-[12px] font-semibold tracking-tight text-gray-800">CopyBox Lite</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onAdd}
          className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary shadow-[0_6px_14px_rgba(37,99,235,0.18)] transition-colors hover:bg-primary-hover"
        >
          <Plus size={14} className="text-white" />
        </button>
        <button
          onClick={onSettings}
          className="flex h-7 w-7 items-center justify-center rounded-xl transition-colors hover:bg-white/80"
        >
          <Settings size={15} className="text-gray-500" />
        </button>
      </div>
    </div>
  )
}
