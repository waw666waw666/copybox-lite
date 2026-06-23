import { Check } from 'lucide-react'

interface ToastProps {
  message: string
}

export default function Toast({ message }: ToastProps) {
  return (
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-xs font-medium rounded-lg shadow-lg">
        <Check size={14} />
        {message}
      </div>
    </div>
  )
}
