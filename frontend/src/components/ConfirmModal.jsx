import { X, AlertTriangle } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi Hapus",
  message = "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.",
  confirmText = "Hapus",
  roleTheme = "red",
}) {
  if (!isOpen) return null;

  const themes = {
    red: "bg-red-600 hover:bg-red-700 active:bg-red-800",
    teal: "bg-teal-600 hover:bg-teal-700 active:bg-teal-800",
    blue: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800",
  };

  const btnColor = themes[roleTheme] || themes.red;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-red-500 shrink-0" />
            <span className="text-sm font-bold text-slate-850">{title}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-slate-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="btn-secondary text-xs font-semibold py-2 px-4 rounded-xl cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`inline-flex items-center gap-2 py-2.5 px-5 ${btnColor} text-white text-xs font-semibold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer border-none`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
