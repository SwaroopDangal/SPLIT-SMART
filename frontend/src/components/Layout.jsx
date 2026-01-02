import { useState } from "react";
import NavBar from "./NavBar";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";

const Layout = ({ children, showSidebar = true, showNavbar = true }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navbar - Full Width at Top */}
      {showNavbar && (
        <div className="shadow-md z-20 sticky top-0">
          <NavBar />
        </div>
      )}

      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* Desktop Sidebar */}
        {showSidebar && (
          <div className="hidden lg:block shadow-xl z-10">
            <Sidebar />
          </div>
        )}

        {/* Mobile Sidebar Overlay */}
        {showSidebar && mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fadeIn"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Sliding Sidebar */}
            <div className="fixed top-16 bottom-0 left-0 z-50 lg:hidden animate-slideIn shadow-2xl">
              <Sidebar />
            </div>
          </>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          {/* Main Content with padding and smooth scroll */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
              <div className="animate-fadeIn">{children}</div>
            </div>
          </main>

          {/* Optional Footer */}
          <footer className="bg-white border-t border-gray-200 py-4 px-6">
            <div className="container mx-auto max-w-7xl">
              <p className="text-center text-sm text-gray-600">
                © 2025 SplitSmart. Split expenses, stay smart.
              </p>
            </div>
          </footer>
        </div>
      </div>

      {/* Mobile Menu Toggle Button */}
      {showSidebar && (
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xl flex items-center justify-center active:scale-95 transition-transform"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
    </div>
  );
};

export default Layout;
