import { useLayoutEffect, useState, type RefObject } from 'react'
import { Check } from 'lucide-react'
import { ICON_REGISTRY, COLOR_OPTIONS, getIcon } from '../utils/icon-registry'

interface IconPickerPopoverProps {
  anchorRef: RefObject<HTMLElement>
  currentIcon: string
  currentColor?: string
  onSelect: (icon: string) => void
  onColorChange?: (color: string) => void
  onClose: () => void
}

interface Position {
  top: number
  left: number
}

const PANEL_WIDTH = 214
const PANEL_HEIGHT = 238
const VIEWPORT_WIDTH = 340
const VIEWPORT_HEIGHT = 520
const GAP = 8
const PADDING = 8

export default function IconPickerPopover({
  anchorRef,
  currentIcon,
  currentColor,
  onSelect,
  onColorChange,
  onClose,
}: IconPickerPopoverProps) {
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 })
  const iconNames = Object.keys(ICON_REGISTRY)

  useLayoutEffect(() => {
    const anchor = anchorRef.current
    if (!anchor) return

    const rect = anchor.getBoundingClientRect()
    let left = rect.left
    let top = rect.bottom + GAP

    if (left + PANEL_WIDTH > VIEWPORT_WIDTH - PADDING) {
      left = VIEWPORT_WIDTH - PANEL_WIDTH - PADDING
    }
    if (left < PADDING) {
      left = PADDING
    }

    if (top + PANEL_HEIGHT > VIEWPORT_HEIGHT - PADDING) {
      top = rect.top - PANEL_HEIGHT - GAP
    }
    if (top < PADDING) {
      top = Math.max(PADDING, VIEWPORT_HEIGHT - PANEL_HEIGHT - PADDING)
    }

    setPosition({ top, left })
  }, [anchorRef])

  return (
    <div className="fixed inset-0 z-50" onClick={(e) => e.stopPropagation()}>
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className="absolute w-[214px] rounded-2xl border border-gray-100 bg-white p-2.5 shadow-xl"
        style={{ top: position.top, left: position.left }}
      >
        <div className="grid grid-cols-6 gap-1.5">
          {iconNames.map((name) => {
            const Icon = getIcon(name)
            const isSelected = name === currentIcon
            return (
              <button
                key={name}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect(name)
                }}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all
                  ${isSelected
                    ? 'border border-primary bg-primary/8 text-primary shadow-sm'
                    : 'border border-gray-100 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <Icon size={14} />
              </button>
            )
          })}
        </div>

        {onColorChange && (
          <div className="mt-2.5 border-t border-gray-100 pt-2.5">
            <div className="grid grid-cols-6 gap-1.5">
              {COLOR_OPTIONS.map((color) => {
                const isSelected = currentColor === color.value
                return (
                  <button
                    key={color.value}
                    onClick={(e) => {
                      e.stopPropagation()
                      onColorChange(color.value)
                    }}
                    className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all ${
                      isSelected
                        ? 'scale-105 border-white ring-2 ring-gray-300 ring-offset-1'
                        : 'border-white/80 hover:scale-105 hover:ring-2 hover:ring-gray-200 hover:ring-offset-1'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {isSelected && <Check size={11} className="text-white drop-shadow-sm" strokeWidth={3} />}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
