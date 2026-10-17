import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";

import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div
      style={{ backgroundColor: "var(--app-bg)" }}
      className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden transition-colors duration-300"
    >
      {/* DECORATORS - GRID BG & GLOW SHAPES */}
      <div
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
        }}
        className="absolute inset-0 bg-[size:16px_28px] pointer-events-none"
      />
      <div className="absolute top-0 -left-4 size-96 bg-pink-500/15 dark:bg-pink-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500/15 dark:bg-cyan-500/20 blur-[120px] pointer-events-none" />

      <Routes>
        <Route path="/" element={authUser ? <ChatPage /> : <Navigate to={"/login"} />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
      </Routes>

      <Toaster />
    </div>
  );
}
export default App;
