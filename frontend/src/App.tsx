import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Nav from "./components/nav";
import Header from "./components/header";
import StatsCards from "./components/StatsCards";
import ChartsSection from "./components/Chart,category,notifi,quiclAction/Chart";
import RightSidebar from "./components/rightSiderbar/rightSidebar";
import Books from "./components/books/books";
import Dashboard from "./components/dashboard";
import Members from "./components/members/members";
import IssueReturn from "./components/issueReturn/issue";
import ReportsPage from "./components/reports/reportPage";
import FineManager from "./components/fineManager/fineManager";
import Settings from "./components/settings/Settings";

import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";

import Unauthorized from "./auth/Unauthorized";

function AppLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-stone-100 min-h-screen flex">
      <Nav isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex flex-col flex-1 pt-3 transition-all duration-300 min-w-0">
        <Header isOpen={isOpen} setIsOpen={setIsOpen} />

        <div className="flex flex-1 min-w-0">
          <main className="flex-1 overflow-y-auto p-3 md:p-5 min-w-0">
            <Routes>
              {/* All roles */}
              <Route
                path="/"
                element={
                  <>
                    <Dashboard />
                    <StatsCards />
                    <ChartsSection />
                  </>
                }
              />
              <Route path="/books" element={<Books />} />
              <Route path="/issue-return" element={<IssueReturn />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Admin and Librarian only */}
              <Route element={<ProtectedRoute allowedRoles={["admin", "librarian"]} />}>
                <Route path="/members" element={<Members />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/Fine manager" element={<FineManager />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Routes>
          </main>

          {/* Right sidebar: hidden on mobile, visible on xl screens */}
          <div className="hidden xl:block">
            <RightSidebar />
          </div>
        </div>

        <footer className="text-center text-xs text-gray-600 border-t border-gray-200 py-3 px-3">
          © 2026 Uni_Library · Built by Yogesh gandu & his Super hero Team · All
          rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<AppLayout />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}