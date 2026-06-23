import { useState, useEffect, useRef } from 'react'
import { X, Download, Upload, Trash2, Info } from 'lucide-react'
import { Settings, Board } from '../types'
import { exportAll, importAll, clearAll } from '../utils/storage'

interface SettingsDialogProps {
  settings: Settings
  boards: Board[]
  onUpdate: (s: Settings) => void
  onClose: () => void
}

export default function SettingsDialog({ settings, boards, onUpdate, onClose }: SettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState(settings)
  const [confirmClear, setConfirmClear] = useState(false)
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const fileRef = useRef<HTMLInputElement>(null)
  const sorted = [...boards].sort((a, b) => a.order - b.order)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const toggle = (key: keyof Settings) => {
    const updated = { ...localSettings, [key]: !localSettings[key] }
    setLocalSettings(updated)
    onUpdate(updated)
  }

  const handleDefaultBoardChange = async (boardId: string) => {
    const updated = { ...localSettings, defaultBoardId: boardId }
    setLocalSettings(updated)
    await onUpdate(updated)
  }

  const handleExport = async () => {
    const json = await exportAll()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'copybox-lite-backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      await importAll(text)
      setImportStatus('success')
      setTimeout(() => {
        setImportStatus('idle')
        onClose()
        window.location.reload()
      }, 1000)
    } catch {
      setImportStatus('error')
      setTimeout(() => setImportStatus('idle'), 2000)
    }

    e.target.value = ''
  }

  const handleClear = async () => {
    if (!confirmClear) {
      setConfirmClear(true)
      return
    }

    await clearAll()
    onClose()
    window.location.reload()
  }

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative flex w-[320px] flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-4 pb-2 pt-4">
          <h3 className="text-sm font-semibold text-gray-800">设置</h3>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100">
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 pb-4">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-gray-500">默认打开板块</label>
            <select
              value={localSettings.defaultBoardId}
              onChange={(e) => handleDefaultBoardChange(e.target.value)}
              className="h-8 w-full rounded-lg border border-gray-200 bg-white px-2.5 text-xs
                         focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
            >
              {sorted.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2.5">
            <ToggleItem
              label="紧凑模式"
              checked={localSettings.compactMode}
              onChange={() => toggle('compactMode')}
            />
            <ToggleItem
              label="点击整行复制"
              checked={localSettings.clickRowToCopy}
              onChange={() => toggle('clickRowToCopy')}
            />
            <ToggleItem
              label="显示复制提示"
              checked={localSettings.showCopyToast}
              onChange={() => toggle('showCopyToast')}
            />
            <ToggleItem
              label="显示内容前图标"
              checked={localSettings.showSnippetIcons}
              onChange={() => toggle('showSnippetIcons')}
            />
          </div>

          <div className="space-y-1.5 border-t border-gray-100 pt-3">
            <button
              onClick={handleExport}
              className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Download size={14} />
              导出 JSON
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Upload size={14} />
              导入 JSON
              {importStatus === 'success' && <span className="ml-auto text-[10px] text-green-500">导入成功</span>}
              {importStatus === 'error' && <span className="ml-auto text-[10px] text-red-500">导入失败</span>}
            </button>
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

            <button
              onClick={handleClear}
              className="flex w-full items-center gap-2 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs text-red-500 transition-colors hover:bg-red-50"
            >
              <Trash2 size={14} />
              {confirmClear ? '确认清空？不可恢复' : '清空全部数据'}
            </button>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
              <Info size={12} />
              <span>所有内容仅保存在本地</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ToggleItem({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-xs text-gray-700">{label}</span>
      <button
        onClick={onChange}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${
          checked ? 'bg-primary' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
