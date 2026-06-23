import { useState, useEffect } from 'react'
import { X, Plus } from 'lucide-react'
import { Board } from '../types'
import { ICON_REGISTRY, COLOR_OPTIONS, getIcon } from '../utils/icon-registry'

interface CategoryDialogProps {
  editBoard: Board | null
  onSave: (name: string, icon: string, color: string) => void
  onClose: () => void
}

const BOARD_COLOR_OPTIONS = [
  ...COLOR_OPTIONS,
  { name: '青蓝', value: '#3B82F6' },
  { name: '薄荷', value: '#22C55E' },
  { name: '玫红', value: '#F43F5E' },
  { name: '珊瑚', value: '#FB7185' },
]

export default function CategoryDialog({ editBoard, onSave, onClose }: CategoryDialogProps) {
  const [name, setName] = useState(editBoard?.name || '')
  const [icon, setIcon] = useState(editBoard?.icon || 'mail')
  const [color, setColor] = useState(editBoard?.color || '#2563EB')
  const [nameError, setNameError] = useState('')

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const handleSave = () => {
    if (!name.trim()) {
      setNameError('请输入板块名称')
      return
    }

    onSave(name.trim(), icon, color)
  }

  const iconNames = Object.keys(ICON_REGISTRY)

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative flex w-[312px] max-w-[calc(100%-20px)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-4 pb-1 pt-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
              {editBoard ? (
                <span className="text-[10px] font-bold text-primary">E</span>
              ) : (
                <Plus size={13} className="text-primary" />
              )}
            </div>
            <h3 className="text-sm font-semibold text-gray-800">
              {editBoard ? '编辑板块' : '创建新板块'}
            </h3>
          </div>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100">
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        <div className="px-4 pb-3 pt-2">
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (nameError) setNameError('')
            }}
            maxLength={20}
            className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm
                       focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
          />
          <div className="mt-1 flex justify-between">
            {nameError && <span className="text-[10px] text-red-500">{nameError}</span>}
            <span className="ml-auto text-[10px] text-gray-300">{name.length}/20</span>
          </div>
        </div>

        <div className="px-4 pb-3">
          <label className="mb-1.5 block text-[11px] font-medium text-gray-500">选择图标</label>
          <div className="grid grid-cols-8 gap-1">
            {iconNames.map((iconName) => {
              const Icon = getIcon(iconName)
              const isSelected = icon === iconName
              return (
                <button
                  key={iconName}
                  onClick={() => setIcon(iconName)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all
                    ${
                      isSelected
                        ? 'border-[1.5px] border-primary bg-primary/10 shadow-sm'
                        : 'border border-gray-100 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                >
                  <Icon size={14} className={isSelected ? 'text-primary' : 'text-gray-500'} />
                </button>
              )
            })}
          </div>
        </div>

        <div className="px-4 pb-4">
          <label className="mb-1.5 block text-[11px] font-medium text-gray-500">选择颜色</label>
          <div className="grid grid-cols-8 gap-1.5">
            {BOARD_COLOR_OPTIONS.map((option) => {
              const isSelected = color === option.value
              return (
                <button
                  key={option.value}
                  onClick={() => setColor(option.value)}
                  className={`relative flex h-7 w-7 items-center justify-center rounded-full transition-all
                    ${isSelected ? 'ring-2 ring-gray-300 ring-offset-1' : 'hover:scale-110'}`}
                  style={{ backgroundColor: option.value }}
                  title={option.name}
                >
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M3 7L6 10L11 4"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50/70 px-4 py-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-1.5 text-xs text-gray-600 transition-colors hover:bg-white"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-primary px-4 py-1.5 text-xs text-white transition-colors hover:bg-primary-hover"
          >
            {editBoard ? '保存' : '创建'}
          </button>
        </div>
      </div>
    </div>
  )
}
