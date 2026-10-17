import { MessageCircleIcon, SparklesIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import useKeyboardSound from "../hooks/useKeyboardSound";

const suggestions = [
  "👋 Say Hello",
  "🤝 How are you?",
  "📅 Meet up soon?",
  "✨ Let's catch up!",
  "🚀 Working on anything cool?",
];

const NoChatHistoryPlaceholder = ({ name }) => {
  const { sendMessage, isSoundEnabled } = useChatStore();
  const { playRandomKeyStrokeSound } = useKeyboardSound();

  const handleSendSuggestion = (suggestionText) => {
    if (isSoundEnabled) playRandomKeyStrokeSound();
    sendMessage({ text: suggestionText });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 select-none">
      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/25 to-blue-500/10 rounded-2xl flex items-center justify-center mb-5 ring-1 ring-cyan-500/30 shadow-lg shadow-cyan-500/10">
        <MessageCircleIcon className="size-8 text-cyan-400" />
      </div>

      <h3 style={{ color: "var(--text-main)" }} className="text-lg font-semibold mb-2">
        Start your conversation with {name}
      </h3>

      <div className="flex flex-col space-y-3 max-w-md mb-6">
        <p style={{ color: "var(--text-muted)" }} className="text-sm">
          No message history yet. Click a suggestion below to start chatting instantly!
        </p>
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent mx-auto"></div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-cyan-400/80 flex items-center gap-1 mb-1">
          <SparklesIcon className="size-3" /> Quick suggestions
        </span>
        <div className="flex flex-wrap gap-2.5 justify-center max-w-lg">
          {suggestions.map((item, index) => (
            <button
              key={index}
              onClick={() => handleSendSuggestion(item)}
              className="px-4 py-2 text-xs font-medium text-cyan-500 hover:text-white bg-cyan-500/10 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 rounded-full border border-cyan-500/20 hover:border-transparent transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoChatHistoryPlaceholder;
