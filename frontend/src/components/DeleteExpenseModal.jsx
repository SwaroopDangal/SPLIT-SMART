import React, { useState } from "react";
import { Trash2, X } from "lucide-react";
import useDeleteExpense from "../hooks/useDeleteExpense";

const DeleteExpenseModal = ({ setShowDeleteExpenseModal, groupId, id }) => {
  const { deleteExpenseMutation, isDeleteExpensePending } = useDeleteExpense({
    id,
    groupId,
  });
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const handleDeleteExpense = () => {
    if (deleteConfirmText === "confirm") {
      deleteExpenseMutation();
      setShowDeleteExpenseModal(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Delete Expense</h2>
          </div>
          <button
            onClick={() => {
              setShowDeleteExpenseModal(false);
              setDeleteConfirmText("");
            }}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 font-semibold mb-2 flex items-start gap-2">
              <svg
                className="w-5 h-5 mt-0.5 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Warning: This action cannot be undone!</span>
            </p>
            <p className="text-red-700 text-sm">
              Deleting this expense will permanently remove this expense,
            </p>
          </div>

          <p className="text-gray-700 mb-4">
            To confirm deletion, please type{" "}
            <strong className="text-gray-900">confirm</strong>
          </p>

          {/* Confirmation Input */}
          <input
            type="text"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder={`Type "confirm" to confirm`}
            className="input input-bordered w-full border-2 focus:border-red-500 focus:ring-4 focus:ring-red-100"
          />
        </div>

        {/* Modal Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={() => {
              setShowDeleteExpenseModal(false);
              setDeleteConfirmText("");
            }}
            className="btn btn-outline flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteExpense}
            disabled={deleteConfirmText !== "confirm" || isDeleteExpensePending}
            className="btn bg-red-600 hover:bg-red-700 text-white flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteExpenseModal;
