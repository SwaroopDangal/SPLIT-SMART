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
import RecentActivity from "../components/RecentActivity";

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
              Sign in to start splitting expenses with friends.
            </p>

            <SignInButton mode="modal">
              <button className="btn btn-lg bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-lg w-full">
                Sign In to Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </SignInButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user?.firstName || "there"} 👋
        </h1>
        <p className="text-gray-600">Here’s your expense summary</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Net Balance */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>

          <p className="text-sm font-medium text-gray-600 mb-1">Net Balance</p>

          <p
            className={`text-3xl font-bold ${
              stats.netBalance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ${Math.abs(stats.netBalance)}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            {stats.netBalance > 0
              ? "Overall, people owe you"
              : stats.netBalance < 0
              ? "Overall, you owe people"
              : "All settled"}
          </p>
        </div>

        {/* Total Paid */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>

          <p className="text-sm font-medium text-gray-600 mb-1">Total Paid</p>

          <p className="text-3xl font-bold text-green-600">
            ${stats.totalPaid}
          </p>

          <p className="text-xs text-gray-500 mt-2">Money you’ve spent</p>
        </div>

        {/* Your Share */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
          <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4">
            <TrendingDown className="w-6 h-6 text-orange-600" />
          </div>

          <p className="text-sm font-medium text-gray-600 mb-1">Your Share</p>

          <p className="text-3xl font-bold text-orange-600">
            ${stats.totalShare}
          </p>

          <p className="text-xs text-gray-500 mt-2">Your portion of expenses</p>
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default Dashboard;
