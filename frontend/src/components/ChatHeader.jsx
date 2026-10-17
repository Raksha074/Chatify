import { XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);

    // cleanup function
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div
      style={{
        backgroundColor: "var(--header-bg)",
        borderBottomColor: "var(--border-color)",
      }}
      className="flex justify-between items-center border-b max-h-[84px] px-6 py-4 flex-1 backdrop-blur-md transition-colors"
    >
      <div className="flex items-center space-x-3">
        <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className="w-12 rounded-full ring-2 ring-cyan-500/30">
            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
          </div>
        </div>

        <div>
          <h3 style={{ color: "var(--text-main)" }} className="font-semibold text-base">
            {selectedUser.fullName}
          </h3>
          <p
            style={{ color: isOnline ? "#10b981" : "var(--text-muted)" }}
            className="text-xs font-medium"
          >
            {isOnline ? "● Online" : "○ Offline"}
          </p>
        </div>
      </div>

      <button
        onClick={() => setSelectedUser(null)}
        title="Close chat (Esc)"
        className="p-2 rounded-full hover:bg-slate-700/20 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
      >
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
export default ChatHeader;
