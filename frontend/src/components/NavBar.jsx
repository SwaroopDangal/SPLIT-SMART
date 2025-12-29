import { Wallet } from "lucide-react";
import { UserButton, useUser, SignInButton } from "@clerk/clerk-react";

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg shadow-md">
              <Wallet className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold text-white">SplitSmart</span>
          </div>

          {/* Clerk User Button or Sign In */}
          <div>
            {isSignedIn ? (
              <div className="scale-110">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    },
                  }}
                />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="btn btn-sm bg-white text-emerald-600 hover:bg-emerald-50 border-none shadow-md font-semibold">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
