import { useUser, SignInButton } from "@clerk/clerk-react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import useGetStats from "../hooks/useGetStats";
import LoaderPage from "../components/Loader";

const Dashboard = () => {
  const { isSignedIn, user } = useUser();
  const { stats, isStatsLoading } = useGetStats();

  if (isStatsLoading) return <LoaderPage />;

  if (!isSignedIn) {
    return (
      <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
            <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-10 h-10 text-emerald-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Welcome to SplitSmart
            </h1>

            <p className="text-gray-600 mb-8 text-lg">
              Sign in to start splitting expenses with friends and keep track of
              who owes what.
            </p>

            <SignInButton mode="modal">
              <button className="btn btn-lg bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-lg w-full">
                Sign In to Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </SignInButton>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Split bills, track expenses, and settle up with ease
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user?.firstName || "there"}! 👋
        </h1>
        <p className="text-gray-600">Here's your expense summary</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Balance */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">
            Total Balance
          </p>
          <p
            className={`text-3xl font-bold ${
              stats.totalBalance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ${Math.abs(stats.totalBalance)}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {stats.totalBalance >= 0
              ? "You are owed overall"
              : "You owe overall"}
          </p>
        </div>

        {/* You Are Owed */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">You Are Owed</p>
          <p className="text-3xl font-bold text-green-600">
            ${stats.amountIamOwed}
          </p>
          <p className="text-xs text-gray-500 mt-2">Money coming to you</p>
        </div>

        {/* You Owe */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingDown className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">You Owe</p>
          <p className="text-3xl font-bold text-orange-600">${stats.amountIowe}</p>
          <p className="text-xs text-gray-500 mt-2">Money you need to pay</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recent Activity
        </h2>
        <div className="text-center py-8 text-gray-500">
          <p>No recent activity yet</p>
          <p className="text-sm mt-2">
            Start by creating a group or adding an expense!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
