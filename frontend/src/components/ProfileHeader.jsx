import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon, SunIcon, MoonIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound, setSelectedUser } = useChatStore();
  const { theme, toggleTheme } = useThemeStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div
      style={{
        borderBottomColor: "var(--border-color)",
        backgroundColor: "var(--header-bg)",
      }}
      className="p-5 border-b backdrop-blur-md transition-colors"
    >
      {/* BRAND LOGO & TITLE */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700/20">
        <div className="flex items-center gap-2">
          <img src="/chatify-logo.svg" alt="Chatify" className="w-7 h-7 drop-shadow-md" />
          <span className="font-bold text-base tracking-wide bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
            Chatify
          </span>
        </div>

        {/* THEME TOGGLE (SUN / MOON) */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="p-1.5 rounded-lg border border-slate-700/30 hover:border-cyan-500/50 bg-slate-800/20 dark:bg-slate-700/30 hover:bg-cyan-500/10 transition-all text-slate-300 hover:text-cyan-400 cursor-pointer"
        >
          {theme === "dark" ? (
            <SunIcon className="size-4 text-amber-400 animate-spin-slow" />
          ) : (
            <MoonIcon className="size-4 text-indigo-500" />
          )}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="avatar online">
            <button
              className="size-12 rounded-full overflow-hidden relative group ring-2 ring-cyan-500/40"
              onClick={() => fileInputRef.current.click()}
              title="Click to change profile picture"
            >
              <img
                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                alt="User image"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-[10px] font-medium">Change</span>
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* USERNAME & ONLINE TEXT */}
          <div>
            <h3
              style={{ color: "var(--text-main)" }}
              className="font-semibold text-sm max-w-[140px] truncate"
            >
              {authUser?.fullName}
            </h3>
            <p className="text-emerald-500 text-xs font-medium flex items-center gap-1">
              <span className="inline-block size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Online
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2 items-center">
          {/* SOUND TOGGLE BTN */}
          <button
            className="p-1.5 rounded-lg hover:bg-cyan-500/10 transition-colors text-slate-400 hover:text-cyan-400 cursor-pointer"
            title={isSoundEnabled ? "Mute typing sound" : "Enable typing sound"}
            onClick={() => {
              mouseClickSound.currentTime = 0;
              mouseClickSound.play().catch((error) => console.log("Audio play failed:", error));
              toggleSound();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-4 text-cyan-400" />
            ) : (
              <VolumeOffIcon className="size-4 text-slate-400" />
            )}
          </button>

          {/* LOGOUT BTN */}
          <button
            className="p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors text-slate-400 hover:text-rose-400 cursor-pointer"
            title="Logout"
            onClick={() => {
              setSelectedUser(null);
              logout();
            }}
          >
            <LogOutIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProfileHeader;
