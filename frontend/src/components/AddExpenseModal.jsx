import React, { useState } from "react";
import useGetAGroupData from "../hooks/useGetAGroupData";
import {
  X,
  DollarSign,
  UserPlus,
  Trash2,
  Percent,
  LoaderIcon,
} from "lucide-react";
import useAddExpense from "../hooks/useAddExpense";

const AddExpenseModal = ({ setShowAddExpenseModal, id }) => {
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [multiplePayers, setMultiplePayers] = useState(false);
  const [payers, setPayers] = useState([{ memberId: "", amount: "" }]);
  const [singlePayer, setSinglePayer] = useState("");
  const [expenseSplitType, setExpenseSplitType] = useState("Equally");
  const [percentageSplits, setPercentageSplits] = useState({});
  const [unequalSplits, setUnequalSplits] = useState({});

  const { groupData } = useGetAGroupData(id);
  const { addExpenseMutation, isPending } = useAddExpense(
    setShowAddExpenseModal,
    id
  );

  const addPayer = () => {
    const lastPayer = payers[payers.length - 1];
    if (!lastPayer.memberId) return; // ⛔ block empty row
    setPayers([...payers, { memberId: "", amount: "" }]);
  };

  const removePayer = (index) => {
    if (payers.length > 1) {
      setPayers(payers.filter((_, i) => i !== index));
    }
  };

  const updatePayer = (index, field, value) => {
    const updatedPayers = [...payers];
    updatedPayers[index][field] = value;
    setPayers(updatedPayers);
  };

  const getTotalPaid = () => {
    return payers.reduce(
      (sum, payer) => sum + (parseFloat(payer.amount) || 0),
      0
    );
  };

  const getRemainingAmount = () => {
    const total = parseFloat(expenseAmount) || 0;
    const paid = getTotalPaid();
    return (total - paid).toFixed(2);
  };

  const updatePercentage = (memberId, percentage) => {
    setPercentageSplits({
      ...percentageSplits,
      [memberId]: percentage,
    });
  };

  const getTotalPercentage = () => {
    return Object.values(percentageSplits).reduce(
      (sum, percentage) => sum + (parseFloat(percentage) || 0),
      0
    );
  };

  const getPercentageAmount = (percentage) => {
    const amount = parseFloat(expenseAmount) || 0;
    const percent = parseFloat(percentage) || 0;
    return ((amount * percent) / 100).toFixed(2);
  };

  const updateUnequalSplit = (memberId, amount) => {
    setUnequalSplits({
      ...unequalSplits,
      [memberId]: amount,
    });
  };

  const getTotalUnequalSplit = () => {
    return Object.values(unequalSplits).reduce(
      (sum, amount) => sum + (parseFloat(amount) || 0),
      0
    );
  };

  const getRemainingUnequalAmount = () => {
    const total = parseFloat(expenseAmount) || 0;
    const split = getTotalUnequalSplit();
    return (total - split).toFixed(2);
  };
  const hasInvalidPayer =
    multiplePayers &&
    payers.some(
      (payer) => !payer.memberId || !payer.amount || Number(payer.amount) <= 0
    );

  const handleAddExpense = async () => {
    let paidBy = [];

    if (multiplePayers) {
      paidBy = payers
        .filter((payer) => payer.memberId)
        .map((payer) => ({
          userId: payer.memberId,
          amount: Number(payer.amount),
        }));
    } else {
      paidBy = [
        {
          userId: singlePayer,
          amount: Number(expenseAmount),
        },
      ];
    }

    let splits = [];

    if (expenseSplitType === "Equally") {
      const perPerson = Number(expenseAmount) / groupData.members.length;

      splits = groupData.members.map((member) => ({
        userId: member._id,
        amount: Number(perPerson.toFixed(2)),
      }));
    }

    if (expenseSplitType === "Unequally") {
      splits = Object.entries(unequalSplits).map(([userId, amount]) => ({
        userId,
        amount: Number(amount),
      }));
    }

    if (expenseSplitType === "Percentage") {
      splits = Object.entries(percentageSplits).map(([userId, percentage]) => ({
        userId,
        amount: (Number(expenseAmount) * Number(percentage)) / 100,
      }));
    }

    const payload = {
      description: expenseDescription,
      amount: Number(expenseAmount),
      date: expenseDate,
      paidBy,
      splitAmong: splits,
      groupId: id,
    };

    console.log("Sending payload:", payload);
    addExpenseMutation(payload);
  };

  const allMembersSelected =
    groupData &&
    payers.filter((p) => p.memberId).length >= groupData.members.length;

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
              Total Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="number"
                step="10"
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
              max={new Date().toISOString().split("T")[0]}
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="input input-bordered w-full border-2 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          {/* Multiple Payers Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-sm font-semibold text-gray-700">
              Multiple people paid?
            </span>
            <input
              type="checkbox"
              checked={multiplePayers}
              onChange={(e) => {
                setMultiplePayers(e.target.checked);
                if (!e.target.checked) {
                  setPayers([{ memberId: "", amount: "" }]);
                }
              }}
              className="toggle toggle-success"
            />
          </div>

          {/* Single Payer */}
          {!multiplePayers && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Paid By <span className="text-red-500">*</span>
              </label>
              <select
                value={singlePayer}
                onChange={(e) => setSinglePayer(e.target.value)}
                className="select select-bordered w-full border-2 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="">Select member</option>
                {groupData?.members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Multiple Payers */}
          {multiplePayers && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700">
                  Who Paid? <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={addPayer}
                  disabled={allMembersSelected}
                  className="btn btn-xs btn-ghost text-emerald-600"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Payer
                </button>
              </div>

              {/* Payers List */}
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {payers.map((payer, index) => {
                  const selectedMemberIds = payers
                    .filter((_, i) => i !== index)
                    .map((p) => p.memberId);
                  return (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <select
                          value={payer.memberId}
                          onChange={(e) =>
                            updatePayer(index, "memberId", e.target.value)
                          }
                          className="select select-bordered select-sm w-full border-2 focus:border-emerald-500"
                        >
                          <option value="">Select member</option>
                          {groupData?.members
                            .filter(
                              (member) =>
                                !selectedMemberIds.includes(member._id) ||
                                member._id === payer.memberId
                            )
                            .map((member) => (
                              <option key={member._id} value={member._id}>
                                {member.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="w-28">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            step="10"
                            value={payer.amount}
                            onChange={(e) =>
                              updatePayer(index, "amount", e.target.value)
                            }
                            placeholder="0.00"
                            className="input input-bordered input-sm w-full pl-7 border-2 focus:border-emerald-500"
                          />
                        </div>
                      </div>
                      {payers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePayer(index)}
                          className="btn btn-ghost btn-sm btn-circle text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Total Validation */}
              {multiplePayers && expenseAmount && (
                <div className="bg-blue-50 rounded-lg p-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Total Paid:</span>
                    <span className="font-semibold text-gray-900">
                      ${getTotalPaid().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Remaining:</span>
                    <span
                      className={`font-semibold ${
                        parseFloat(getRemainingAmount()) === 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      ${getRemainingAmount()}
                    </span>
                  </div>
                  {parseFloat(getRemainingAmount()) !== 0 && (
                    <p className="text-xs text-red-600 mt-2">
                      ⚠️ Total paid must equal total amount
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Split Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Split Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setExpenseSplitType("Equally")}
                className={`btn btn-sm flex-1 ${
                  expenseSplitType === "Equally"
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "btn-outline"
                }`}
              >
                Equally
              </button>
              <button
                type="button"
                onClick={() => setExpenseSplitType("Unequally")}
                className={`btn btn-sm flex-1 ${
                  expenseSplitType === "Unequally"
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "btn-outline"
                }`}
              >
                Unequally
              </button>
              <button
                type="button"
                onClick={() => setExpenseSplitType("Percentage")}
                className={`btn btn-sm flex-1 ${
                  expenseSplitType === "Percentage"
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "btn-outline"
                }`}
              >
                Percentage
              </button>
            </div>
          </div>

          {/* Unequal Split Section */}
          {expenseSplitType === "Unequally" && groupData?.members && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700">
                  Split Unequally
                </label>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto p-1">
                {groupData.members.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {member.name}
                      </p>
                    </div>
                    <div className="w-32">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          step="10"
                          min="0"
                          value={unequalSplits[member._id] || ""}
                          onChange={(e) =>
                            updateUnequalSplit(member._id, e.target.value)
                          }
                          placeholder="0.00"
                          className="input input-bordered input-sm w-full pl-7 border-2 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Unequal Split Validation */}
              <div className="bg-blue-50 rounded-lg p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Total Split:</span>
                  <span className="font-semibold text-gray-900">
                    ${getTotalUnequalSplit().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Remaining:</span>
                  <span
                    className={`font-semibold ${
                      parseFloat(getRemainingUnequalAmount()) === 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    ${getRemainingUnequalAmount()}
                  </span>
                </div>
                {parseFloat(getRemainingUnequalAmount()) !== 0 && (
                  <p className="text-xs text-red-600 mt-2">
                    ⚠️ Total split must equal total amount
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Percentage Split Section */}
          {expenseSplitType === "Percentage" && groupData?.members && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700">
                  Split by Percentage
                </label>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto p-1">
                {groupData.members.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {member.name}
                      </p>
                      {percentageSplits[member._id] && expenseAmount && (
                        <p className="text-xs text-gray-600 mt-1">
                          = ${getPercentageAmount(percentageSplits[member._id])}
                        </p>
                      )}
                    </div>
                    <div className="w-24">
                      <div className="relative">
                        <input
                          type="number"
                          step="10"
                          min="0"
                          max="100"
                          value={percentageSplits[member._id] || ""}
                          onChange={(e) =>
                            updatePercentage(member._id, e.target.value)
                          }
                          placeholder="0"
                          className="input input-bordered input-sm w-full pr-7 border-2 focus:border-emerald-500"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <Percent className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Percentage Validation */}
              <div className="bg-blue-50 rounded-lg p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Total Percentage:</span>
                  <span
                    className={`font-semibold ${
                      getTotalPercentage() === 100
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {getTotalPercentage().toFixed(2)}%
                  </span>
                </div>
                {getTotalPercentage() !== 100 && (
                  <p className="text-xs text-red-600 mt-2">
                    ⚠️ Total percentage must equal 100%
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={() => setShowAddExpenseModal(false)}
            className="btn btn-outline flex-1"
          >
            Cancel
          </button>
          <button
            disabled={
              isPending ||
              hasInvalidPayer ||
              (multiplePayers && parseFloat(getRemainingAmount()) !== 0) ||
              (expenseSplitType === "Percentage" &&
                getTotalPercentage() !== 100) ||
              (expenseSplitType === "Unequally" &&
                parseFloat(getRemainingUnequalAmount()) !== 0)
            }
            onClick={handleAddExpense}
            className="btn bg-emerald-600 hover:bg-emerald-700 text-white flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <LoaderIcon className="animate-spin size-5 mr-2" />
                Adding...
              </>
            ) : (
              "Add Expense"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseModal;
