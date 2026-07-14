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

function AppLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-stone-100 min-h-screen flex">
      <Nav isOpen={isOpen} setIsOpen={setIsOpen} />

      <div
        className={`flex flex-col flex-1 pt-3 transition-all duration-300 mr-3 ml-3 ${isOpen ? "ml-64" : ""
          }`}
      >
        <Header isOpen={isOpen} setIsOpen={setIsOpen} />

        <div className="flex flex-1">
          <main className="flex-1 overflow-y-auto p-5">
            <Routes>
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
              <Route path="/members" element={<Members />} />
              <Route path="/issue-return" element={<IssueReturn />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/Fine manager" element={<FineManager />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>

          <RightSidebar />
        </div>

        <footer className="text-center text-xs text-gray-600 border-t border-gray-200 py-3">
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

        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<AppLayout />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}