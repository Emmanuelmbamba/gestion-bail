import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout({ children }) {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex bg-slate-50 h-screen text-slate-800 relative">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Overlay Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col md:ml-64 h-screen">
  <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

  <main className="flex-1 overflow-y-auto p-4 sm:p-6">
    {children}
  </main>
</div>
    </div>
  );
}

export default Layout;