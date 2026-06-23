import { FolderOpen, CheckSquare, Trash2, Lock } from 'lucide-react'

interface FooterProps {
  onManageBoards: () => void
  onBatchManage: () => void
  batchMode: boolean
  selectedCount: number
  onBatchDelete: () => void
}

export default function Footer({
  onManageBoards,
  onBatchManage,
  batchMode,
  selectedCount,
  onBatchDelete,
}: FooterProps) {
  if (batchMode) {
    return (
      <div className="flex h-full w-full items-center justify-between gap-2 bg-primary/[0.05] px-2.5 py-1 text-[10px]">
        <button
          onClick={onBatchManage}
          className="shrink-0 text-gray-500 transition-colors hover:text-gray-700"
        >
          取消
        </button>
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-gray-500">已选 {selectedCount} 项</span>
          <button
            onClick={onBatchDelete}
            disabled={selectedCount === 0}
            className={`flex shrink-0 items-center gap-1 rounded-md px-2 py-1 transition-colors ${
              selectedCount > 0
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'cursor-not-allowed bg-gray-100 text-gray-400'
            }`}
          >
            <Trash2 size={10} />
            删除
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="popup-footer-inner">
      <button onClick={onManageBoards} className="popup-footer-button">
        <FolderOpen size={11} className="shrink-0" />
        <span>板块</span>
      </button>
      <button onClick={onBatchManage} className="popup-footer-button">
        <CheckSquare size={11} className="shrink-0" />
        <span>批量</span>
      </button>
      <div className="popup-footer-note">
        <Lock size={9} className="shrink-0" />
        <span className="truncate whitespace-nowrap">本地保存</span>
      </div>
    </div>
  )
}
