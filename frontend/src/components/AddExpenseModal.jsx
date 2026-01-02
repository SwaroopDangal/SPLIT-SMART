import React, { useState } from "react";
import useGetAGroupData from "../hooks/useGetAGroupData";
import { X, DollarSign } from "lucide-react";

const AddExpenseModal = ({ setShowAddExpenseModal, id }) => {
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const { groupData } = useGetAGroupData(id);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Add Expense</h2>
          <button
            onClick={() => setShowAddExpenseModal(false)}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={expenseDescription}
              onChange={(e) => setExpenseDescription(e.target.value)}
              placeholder="e.g., Dinner, Uber ride, Hotel"
              className="input input-bordered w-full border-2 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="number"
                step="0.01"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                placeholder="0.00"
                className="input input-bordered w-full pl-10 border-2 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="input input-bordered w-full border-2 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          {/* Paid By */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Paid By <span className="text-red-500">*</span>
            </label>
            <select className="select select-bordered w-full border-2 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100">
              <option value="">Select member</option>
              {groupData?.members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          {/* Split Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Split Type
            </label>
            <div className="flex gap-2">
              <button className="btn btn-sm flex-1 bg-emerald-600 text-white hover:bg-emerald-700">
                Equally
              </button>
              <button className="btn btn-sm flex-1 btn-outline">
                Unequally
              </button>
              <button className="btn btn-sm flex-1 btn-outline">
                Percentage
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={() => setShowAddExpenseModal(false)}
            className="btn btn-outline flex-1"
          >
            Cancel
          </button>
          <button className="btn bg-emerald-600 hover:bg-emerald-700 text-white flex-1">
            Add Expense
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseModal;
