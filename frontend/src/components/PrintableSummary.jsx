import React, { forwardRef } from "react";
import { Wallet, CheckCircle, TrendingUp, TrendingDown } from "lucide-react";

const PrintableSummary = forwardRef(({ groupBalance }, ref) => {
  return (
    <div ref={ref} className="bg-white text-black p-6 pt-16 max-w-4xl mx-auto">
      {/* Compact Header */}
      <div className="border-b-2 border-emerald-600 pb-3 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-linear-to-br from-emerald-600 to-teal-600 p-2 rounded-lg">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {groupBalance?.groupName}
            </h1>
            <p className="text-xs text-gray-500">Expense Summary</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Compact Total */}
      <div className="bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-3 mb-4 text-center">
        <p className="text-xs font-semibold text-emerald-700 uppercase">
          Total Expenses
        </p>
        <p className="text-3xl font-bold text-emerald-800">
          $
          {groupBalance.totalExpenses.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
          })}
        </p>
        <p className="text-xs text-emerald-600">
          {groupBalance.members.length} members
        </p>
      </div>

      {/* Compact Members Table */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          Member Balances
        </h2>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-3 py-2 text-xs font-bold text-gray-700">
                  Member
                </th>
                <th className="text-right px-3 py-2 text-xs font-bold text-gray-700">
                  Paid
                </th>
                <th className="text-right px-3 py-2 text-xs font-bold text-gray-700">
                  Share
                </th>
                <th className="text-right px-3 py-2 text-xs font-bold text-gray-700">
                  Balance
                </th>
                <th className="text-center px-3 py-2 text-xs font-bold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {groupBalance.members.map((m, index) => (
                <tr
                  key={m.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={m.avatar}
                        alt={m.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="font-medium text-gray-900 text-xs">
                        {m.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right text-xs">
                    ${m.totalPaid.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-right text-xs">
                    ${m.totalOwed.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <span
                      className={`font-bold text-sm ${
                        m.balance > 0
                          ? "text-green-600"
                          : m.balance < 0
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {m.balance > 0 ? "+" : ""}${m.balance.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    {m.status === "owed" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        <TrendingUp className="w-3 h-3" />
                        Gets
                      </span>
                    ) : m.status === "owes" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        <TrendingDown className="w-3 h-3" />
                        Owes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compact Settlements */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Settlements</h2>
        {groupBalance.settlements.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <p className="text-sm font-semibold text-green-800">
              All settled! 🎉
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="space-y-2">
              {groupBalance.settlements.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white rounded p-2 text-xs"
                >
                  <span>
                    <strong>{s.from}</strong> → <strong>{s.to}</strong>
                  </span>
                  <span className="font-bold text-emerald-700">
                    ${s.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Compact Summary Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-2">
          <p className="text-xs font-semibold text-green-700">To Receive</p>
          <p className="text-lg font-bold text-green-700">
            $
            {groupBalance.members
              .filter((m) => m.status === "owed")
              .reduce((sum, m) => sum + m.balance, 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-2">
          <p className="text-xs font-semibold text-red-700">Outstanding</p>
          <p className="text-lg font-bold text-red-700">
            $
            {groupBalance.members
              .filter((m) => m.status === "owes")
              .reduce((sum, m) => sum + Math.abs(m.balance), 0)
              .toFixed(2)}
          </p>
        </div>
      </div>

      {/* Compact Footer */}
      <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Wallet className="w-3 h-3 text-emerald-600" />
          <span className="text-xs font-bold text-emerald-600">SplitSmart</span>
        </div>
        <p className="text-xs text-gray-500">
          ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
        </p>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          @page {
            margin: 0.5cm;
            size: A4;
          }

          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
});

export default PrintableSummary;
