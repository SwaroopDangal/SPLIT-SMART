import { useState } from "react";
import {
  X,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Receipt,
  Loader,
} from "lucide-react";
import useGetGroupExpensesAndSettlements from "../hooks/useGetGroupExpensesAndSettlements";
import LoaderPage from "./Loader";
import useSettleAllExpensesOfAGroup from "../hooks/useSettleAllExpensesOfAGroup";
import ConfirmSettleModal from "./ConfirmSettleModal ";

const GroupBalanceModal = ({ showModal, setShowModal, id, isAdmin }) => {
  const [showConfirmSettleModal, setShowConfirmSettleModal] = useState(false);
  const { groupBalanceData, isGroupBalnceLoading } =
    useGetGroupExpensesAndSettlements(id);
  console.log(groupBalanceData);

  const { settleExpensesMutation, isSettleExpensesPending } =
    useSettleAllExpensesOfAGroup(id);

  const handleSettle = () => {
    settleExpensesMutation();
    setShowModal(false);
  };

  if (!showModal) return null;
  if (isGroupBalnceLoading) return <LoaderPage />;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto ">
        {/* Modal Header */}
        <div className="sticky top-0 bg-linear-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {groupBalanceData?.groupName}
                </h2>
                <p className="text-emerald-100 text-sm">
                  Group Balance Summary
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="btn btn-ghost btn-sm btn-circle text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Total Expenses Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="text-emerald-100 text-sm mb-1">
              Total Group Expenses
            </p>
            <p className="text-4xl font-bold">
              ${groupBalanceData.totalExpenses.toFixed(2)}
            </p>
            <p className="text-emerald-100 text-xs mt-2">
              {groupBalanceData.members.length} members • Split equally
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Member Balances Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-gray-700" />
              <h3 className="text-xl font-bold text-gray-800">
                Member Balances
              </h3>
            </div>

            <div className="space-y-3">
              {groupBalanceData.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-emerald-300 transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full overflow-hidden shadow-md">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Member Info */}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 mb-1">
                        {member.name}
                      </p>
                      <div className="flex gap-4 text-xs text-gray-600">
                        <span>
                          Paid:{" "}
                          <strong className="text-gray-800">
                            ${member.totalPaid.toFixed(2)}
                          </strong>
                        </span>
                        <span>
                          Share:{" "}
                          <strong className="text-gray-800">
                            ${member.totalOwed.toFixed(2)}
                          </strong>
                        </span>
                      </div>
                    </div>

                    {/* Balance Badge */}
                    <div className="text-right">
                      {member.status === "owed" ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-xs text-green-700 font-medium">
                              Gets back
                            </p>
                            <p className="text-lg font-bold text-green-700">
                              ${Math.abs(member.balance).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-lg">
                          <TrendingDown className="w-5 h-5 text-orange-600" />
                          <div>
                            <p className="text-xs text-orange-700 font-medium">
                              Owes
                            </p>
                            <p className="text-lg font-bold text-orange-700">
                              ${Math.abs(member.balance).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Settlements */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-gray-700" />
              <h3 className="text-xl font-bold text-gray-800">
                Suggested Settlements
              </h3>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
              <p className="text-sm text-blue-800 mb-4 font-medium">
                💡 Settle balances with these{" "}
                {groupBalanceData.settlements.length} transactions:
              </p>

              <div className="space-y-3">
                {groupBalanceData.settlements.map((settlement, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"
                  >
                    <div className="flex-1 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-orange-600">
                          {settlement.from
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <strong className="text-gray-800">
                            {settlement.from}
                          </strong>
                          <span className="text-gray-600"> pays </span>
                          <strong className="text-gray-800">
                            {settlement.to}
                          </strong>
                        </p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-emerald-100 rounded-lg">
                      <p className="text-sm font-bold text-emerald-700">
                        ${settlement.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
              <p className="text-sm text-green-700 mb-1">
                Total Owed to Members
              </p>
              <p className="text-2xl font-bold text-green-700">
                $
                {groupBalanceData.members
                  .filter((m) => m.status === "owed")
                  .reduce((sum, m) => sum + m.balance, 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
              <p className="text-sm text-orange-700 mb-1">Total Outstanding</p>
              <p className="text-2xl font-bold text-orange-700">
                $
                {groupBalanceData.members
                  .filter((m) => m.status === "owes")
                  .reduce((sum, m) => sum + Math.abs(m.balance), 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={() => setShowModal(false)}
            className="btn btn-outline flex-1"
          >
            Close
          </button>
          {isAdmin && (
            <button
              className="btn bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
              onClick={() => setShowConfirmSettleModal(true)}
            >
              <DollarSign className="w-4 h-4" />
              Record Settlement
            </button>
          )}
        </div>
      </div>
      {/* Confirm Settlement Modal */}
      <ConfirmSettleModal
        showModal={showConfirmSettleModal}
        setShowModal={setShowConfirmSettleModal}
        onConfirm={handleSettle}
        settlementsCount={groupBalanceData.settlements.length}
      />
    </div>
  );
};

export default GroupBalanceModal;
