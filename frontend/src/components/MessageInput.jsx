import { useRef, useState, useEffect } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import { uploadToCloudinary } from "../lib/cloudinaryUpload";
import toast from "react-hot-toast";
import {
  SendIcon,
  XIcon,
  SmileIcon,
  PaperclipIcon,
  ImageIcon,
  VideoIcon,
  MusicIcon,
  FileTextIcon,
  Loader2Icon,
} from "lucide-react";
import EmojiPicker from "./EmojiPicker";

function formatFileSize(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [attachment, setAttachment] = useState(null);
  // attachment: { file: File, preview?: string, type: "image"|"video"|"audio"|"document", name, size }
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const textInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const attachMenuRef = useRef(null);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const docInputRef = useRef(null);

  const { sendMessage, isSoundEnabled } = useChatStore();

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target)) {
        setShowAttachMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectEmoji = (emoji) => {
    setText((prev) => prev + emoji);
    textInputRef.current?.focus();
  };

  const handleFileSelection = (e, detectedType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Max 50MB
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size exceeds 50MB limit");
      return;
    }

    let finalType = detectedType;
    if (file.type.startsWith("image/")) finalType = "image";
    else if (file.type.startsWith("video/")) finalType = "video";
    else if (file.type.startsWith("audio/")) finalType = "audio";
    else finalType = "document";

    // Generate a local preview URL for images/videos
    const previewUrl = finalType === "image" || finalType === "video"
      ? URL.createObjectURL(file)
      : null;

    setAttachment({
      file,
      preview: previewUrl,
      type: finalType,
      name: file.name,
      size: formatFileSize(file.size),
    });
    setShowAttachMenu(false);
    e.target.value = "";
  };

  const removeAttachment = () => {
    if (attachment?.preview) URL.revokeObjectURL(attachment.preview);
    setAttachment(null);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !attachment) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();

    try {
      let fileUrl = null;
      let fileType = "text";
      let fileName = null;
      let fileSize = null;

      if (attachment) {
        setIsUploading(true);
        setUploadProgress(0);

        const result = await uploadToCloudinary(attachment.file, (progress) => {
          setUploadProgress(progress);
        });

        fileUrl = result.url;
        fileType = attachment.type;
        fileName = attachment.name;
        fileSize = attachment.size;
        setIsUploading(false);
      }

      await sendMessage({
        text: text.trim(),
        fileUrl,
        fileType: fileUrl ? fileType : "text",
        fileName,
        fileSize,
      });

      setText("");
      if (attachment?.preview) URL.revokeObjectURL(attachment.preview);
      setAttachment(null);
      setShowEmojiPicker(false);
      setShowAttachMenu(false);
    } catch (err) {
      setIsUploading(false);
      toast.error(err.message || "Failed to upload file. Please try again.");
    }
  };

  return (
    <div
      style={{
        borderTopColor: "var(--border-color)",
        backgroundColor: "var(--chat-bg)",
      }}
      className="p-3.5 border-t relative transition-colors"
    >
      {/* EMOJI PICKER POPUP */}
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-20 left-4 z-50">
          <EmojiPicker
            onSelectEmoji={handleSelectEmoji}
            onClose={() => setShowEmojiPicker(false)}
          />
        </div>
      )}

      {/* WHATSAPP-STYLE ATTACHMENT MENU */}
      {showAttachMenu && (
        <div
          ref={attachMenuRef}
          style={{
            backgroundColor: "var(--modal-bg)",
            borderColor: "var(--border-color)",
          }}
          className="absolute bottom-20 left-14 z-50 p-3 rounded-2xl border shadow-2xl backdrop-blur-xl flex flex-col gap-2 min-w-[200px]"
        >
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-400 text-sm font-medium transition-colors text-left cursor-pointer"
          >
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ImageIcon className="size-4" />
            </div>
            <span>Photos & Images</span>
          </button>

          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-400 text-sm font-medium transition-colors text-left cursor-pointer"
          >
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
              <VideoIcon className="size-4" />
            </div>
            <span>Videos</span>
          </button>

          <button
            type="button"
            onClick={() => audioInputRef.current?.click()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-400 text-sm font-medium transition-colors text-left cursor-pointer"
          >
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <MusicIcon className="size-4" />
            </div>
            <span>Audio & Music</span>
          </button>

          <button
            type="button"
            onClick={() => docInputRef.current?.click()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-400 text-sm font-medium transition-colors text-left cursor-pointer"
          >
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <FileTextIcon className="size-4" />
            </div>
            <span>Document / PDF</span>
          </button>
        </div>
      )}

      {/* HIDDEN FILE INPUTS */}
      <input type="file" accept="image/*" ref={imageInputRef} onChange={(e) => handleFileSelection(e, "image")} className="hidden" />
      <input type="file" accept="video/*" ref={videoInputRef} onChange={(e) => handleFileSelection(e, "video")} className="hidden" />
      <input type="file" accept="audio/*" ref={audioInputRef} onChange={(e) => handleFileSelection(e, "audio")} className="hidden" />
      <input type="file" accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.zip,.rar,.csv,.ppt,.pptx" ref={docInputRef} onChange={(e) => handleFileSelection(e, "document")} className="hidden" />

      {/* UPLOAD PROGRESS BAR */}
      {isUploading && (
        <div className="max-w-3xl mx-auto mb-3">
          <div
            style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
            className="p-3 rounded-xl border flex items-center gap-3"
          >
            <Loader2Icon className="size-4 text-cyan-400 animate-spin shrink-0" />
            <div className="flex-1">
              <div className="text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                Uploading {attachment?.name}... {uploadProgress}%
              </div>
              <div className="w-full bg-slate-700/30 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ATTACHMENT PREVIEW BAR (when not uploading) */}
      {attachment && !isUploading && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
            }}
            className="relative p-2.5 rounded-2xl border flex items-center gap-3 shadow-lg max-w-sm"
          >
            {attachment.type === "image" && attachment.preview && (
              <img
                src={attachment.preview}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-xl border border-slate-700/50"
              />
            )}
            {attachment.type === "video" && attachment.preview && (
              <div className="w-24 h-16 rounded-xl bg-black/50 flex items-center justify-center relative overflow-hidden border border-slate-700/50">
                <video src={attachment.preview} className="w-full h-full object-cover" muted />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <VideoIcon className="size-6 text-white" />
                </div>
              </div>
            )}
            {attachment.type === "audio" && (
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                <MusicIcon className="size-6" />
              </div>
            )}
            {attachment.type === "document" && (
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                <FileTextIcon className="size-6" />
              </div>
            )}

            <div className="flex-1 min-w-0 pr-4">
              <p style={{ color: "var(--text-main)" }} className="text-xs font-semibold truncate">
                {attachment.name}
              </p>
              <p style={{ color: "var(--text-muted)" }} className="text-[11px]">
                {attachment.size} • {attachment.type.toUpperCase()}
              </p>
            </div>

            <button
              onClick={removeAttachment}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-rose-600 flex items-center justify-center shadow-md transition-colors"
              type="button"
              title="Remove attachment"
            >
              <XIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* INPUT FORM */}
      <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex items-center gap-2">
        {/* EMOJI TOGGLE BUTTON */}
        <button
          type="button"
          onClick={() => {
            setShowEmojiPicker(!showEmojiPicker);
            setShowAttachMenu(false);
          }}
          disabled={isUploading}
          className={`p-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-40 ${
            showEmojiPicker
              ? "bg-cyan-500/20 text-cyan-400"
              : "text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10"
          }`}
          title="Emoji picker"
        >
          <SmileIcon className="w-5 h-5" />
        </button>

        {/* ATTACHMENT MENU TOGGLE */}
        <button
          type="button"
          onClick={() => {
            setShowAttachMenu(!showAttachMenu);
            setShowEmojiPicker(false);
          }}
          disabled={isUploading}
          className={`p-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-40 ${
            showAttachMenu || attachment
              ? "bg-cyan-500/20 text-cyan-400"
              : "text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10"
          }`}
          title="Attach file"
        >
          <PaperclipIcon className={`w-5 h-5 transition-transform ${showAttachMenu ? "rotate-45" : ""}`} />
        </button>

        {/* TEXT INPUT */}
        <div className="flex-1 relative">
          <input
            ref={textInputRef}
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              isSoundEnabled && playRandomKeyStrokeSound();
            }}
            disabled={isUploading}
            style={{
              backgroundColor: "var(--input-bg)",
              borderColor: "var(--border-color)",
              color: "var(--text-main)",
            }}
            className="w-full border rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-slate-400 disabled:opacity-60"
            placeholder={
              isUploading
                ? "Uploading..."
                : attachment
                ? `Add a caption for ${attachment.name}...`
                : "Type a message..."
            }
          />
        </div>

        {/* SEND BUTTON */}
        <button
          type="submit"
          disabled={(!text.trim() && !attachment) || isUploading}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl px-4 py-2.5 font-medium hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 active:scale-95 cursor-pointer flex items-center justify-center min-w-[48px]"
          title={isUploading ? "Uploading..." : "Send message"}
        >
          {isUploading ? (
            <Loader2Icon className="w-5 h-5 animate-spin" />
          ) : (
            <SendIcon className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
}

export default MessageInput;
