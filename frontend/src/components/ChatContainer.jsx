import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import {
  FileTextIcon,
  DownloadIcon,
  MusicIcon,
  XIcon,
  ExternalLinkIcon,
} from "lucide-react";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    setSelectedUser,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    if (!selectedUser?._id) return;
    if (selectedUser._id === authUser?._id) {
      setSelectedUser(null);
      return;
    }

    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    // clean up
    return () => unsubscribeFromMessages();
  }, [selectedUser, authUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages, setSelectedUser]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => {
              const isMe = msg.senderId === authUser._id;
              const mediaUrl = msg.fileUrl || msg.image;
              const type =
                msg.fileType ||
                (msg.image
                  ? "image"
                  : mediaUrl?.startsWith("data:video")
                  ? "video"
                  : mediaUrl?.startsWith("data:audio")
                  ? "audio"
                  : "text");

              return (
                <div
                  key={msg._id}
                  className={`chat ${isMe ? "chat-end" : "chat-start"}`}
                >
                  <div
                    style={{
                      backgroundColor: isMe ? "var(--bubble-me)" : "var(--bubble-other)",
                      color: isMe ? "var(--bubble-me-text)" : "var(--bubble-other-text)",
                    }}
                    className="chat-bubble relative shadow-md p-3.5 max-w-[85%] sm:max-w-[75%]"
                  >
                    {/* 1. IMAGE */}
                    {(type === "image" || (!msg.fileType && msg.image)) && mediaUrl && (
                      <div className="overflow-hidden rounded-xl mb-1.5 cursor-pointer group relative">
                        <img
                          src={mediaUrl}
                          alt="Shared attachment"
                          onClick={() => setLightboxImage(mediaUrl)}
                          className="rounded-xl max-h-72 w-full object-cover group-hover:scale-102 transition-transform duration-200"
                        />
                      </div>
                    )}

                    {/* 2. VIDEO */}
                    {type === "video" && mediaUrl && (
                      <div className="overflow-hidden rounded-xl mb-1.5 shadow-inner bg-black/40">
                        <video
                          controls
                          src={mediaUrl}
                          className="rounded-xl max-h-72 w-full object-contain"
                        />
                      </div>
                    )}

                    {/* 3. AUDIO */}
                    {type === "audio" && mediaUrl && (
                      <div className="flex flex-col gap-1.5 py-1 min-w-[240px] sm:min-w-[280px]">
                        <div className="flex items-center gap-2 text-xs font-medium opacity-90">
                          <MusicIcon className="size-4 shrink-0" />
                          <span className="truncate">{msg.fileName || "Audio file"}</span>
                        </div>
                        <audio controls src={mediaUrl} className="w-full h-9 rounded-lg" />
                      </div>
                    )}

                    {/* 4. DOCUMENT */}
                    {type === "document" && mediaUrl && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20 hover:bg-black/30 transition-colors my-1 min-w-[220px]">
                        <div className="p-2.5 rounded-xl bg-cyan-500/25 text-white shrink-0">
                          <FileTextIcon className="size-6" />
                        </div>
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="text-xs font-semibold truncate">
                            {msg.fileName || "Document file"}
                          </p>
                          <p className="text-[10px] opacity-75">
                            {msg.fileSize || "Attachment"}
                          </p>
                        </div>
                        <a
                          href={mediaUrl}
                          download={msg.fileName || "document"}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white transition-all shadow-sm shrink-0"
                          title="Download document"
                        >
                          <DownloadIcon className="size-4" />
                        </a>
                      </div>
                    )}

                    {/* TEXT MESSAGE */}
                    {msg.text && (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words mt-1">
                        {msg.text}
                      </p>
                    )}

                    {/* TIMESTAMP */}
                    <div className="flex items-center justify-end gap-1 mt-1.5">
                      <span className="text-[10px] opacity-70">
                        {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* 👇 scroll target */}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <MessageInput />

      {/* LIGHTBOX MODAL FOR IMAGES */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white transition-all"
              title="Close image"
            >
              <XIcon className="size-5" />
            </button>
            <img
              src={lightboxImage}
              alt="Full size view"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ChatContainer;
