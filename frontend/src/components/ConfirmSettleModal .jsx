import { X, AlertTriangle, DollarSign } from "lucide-react";

const ConfirmSettleModal = ({
  showModal,
  setShowModal,
  onConfirm,
  settlementsCount,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-60 p-4">
      {/* Modal positioned to the right */}
      <div className="absolute  top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-in-right">
        {/* Header */}
        <div className="bg-linear-to-r from-orange-600 to-red-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Confirm Settlement</h2>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="btn btn-ghost btn-sm btn-circle text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-yellow-800 mb-2">
                  Are you sure you want to settle all balances?
                </p>
                <p className="text-sm text-yellow-700">
                  This action will mark all {settlementsCount} pending
                  settlements as completed and reset all member balances to
                  zero.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-800 font-semibold mb-2">
              ⚠️ Important:
            </p>
            <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
              <li>This action cannot be undone</li>
              <li>All expense records will be deleted permanently</li>
              <li>Member balances will be reset</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <p className="text-xs text-blue-700">
              💡 <strong>Tip:</strong> Make sure all members have completed
              their payments before settling.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={() => setShowModal(false)}
            className="btn btn-outline flex-1"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              setShowModal(false);
            }}
            className="btn bg-red-600 hover:bg-red-700 text-white flex-1"
          >
            <DollarSign className="w-4 h-4" />
            Confirm Settlement
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%) translateY(-50%);
            opacity: 0;
          }
          to {
            transform: translateX(0) translateY(-50%);
            opacity: 1;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ConfirmSettleModal;
