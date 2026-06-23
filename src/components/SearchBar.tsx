import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (v: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="px-3 py-1.5">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="搜索当前板块内容"
          className="h-8 w-full rounded-2xl border border-slate-200/90 bg-white/92 pl-8 pr-3 text-xs
                     shadow-[inset_0_1px_0_rgba(255,255,255,0.84),0_4px_12px_rgba(15,23,42,0.04)]
                     placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20
                     transition-colors"
        />
      </div>
    </div>
  )
}
