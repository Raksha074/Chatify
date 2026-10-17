import { MessageCircleIcon } from "lucide-react";

const NoConversationPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="size-20 bg-gradient-to-br from-cyan-500/25 to-blue-500/10 rounded-2xl ring-1 ring-cyan-500/30 flex items-center justify-center mb-6 shadow-xl shadow-cyan-500/10">
        <MessageCircleIcon className="size-10 text-cyan-400" />
      </div>
      <h3 style={{ color: "var(--text-main)" }} className="text-xl font-bold mb-2">
        Select a conversation
      </h3>
      <p style={{ color: "var(--text-muted)" }} className="text-sm max-w-md">
        Choose a contact from the sidebar to start chatting, send voice notes, documents, videos, and photos!
      </p>
    </div>
  );
};

export default NoConversationPlaceholder;
