import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image || (messageData.fileType === "image" ? messageData.fileUrl : undefined),
      fileUrl: messageData.fileUrl || messageData.image,
      fileType: messageData.fileType || (messageData.image ? "image" : "text"),
      fileName: messageData.fileName,
      fileSize: messageData.fileSize,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    set({ messages: [...messages, optimisticMessage] });

    try {
      const payloadForBackend = {
        text: messageData.text,
        image: messageData.image || messageData.fileUrl,
        fileType: messageData.fileType,
        fileName: messageData.fileName,
        fileSize: messageData.fileSize
      };

      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, payloadForBackend);

      set((state) => {
        const updatedChats = state.chats.filter((c) => c._id !== selectedUser._id);
        return {
          messages: state.messages.map((msg) => msg._id === tempId ? res.data : msg),
          chats: [selectedUser, ...updatedChats],
        };
      });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      set({ messages: messages.filter((msg) => msg._id !== tempId) });
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // Purana listener clear karein taaki duplicate events trigger na hon
    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      // Sound play karein
      const { isSoundEnabled } = get();
      if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.currentTime = 0;
        notificationSound.play().catch((e) => console.log("Audio play failed:", e));
      }

      set((state) => {
        // ✅ SMART FIX: ID ko String mein convert karke check karein
        const incomingSenderId = String(newMessage.senderId);

        const senderUser = state.chats.find((c) => String(c._id) === incomingSenderId) ||
          state.allContacts.find((c) => String(c._id) === incomingSenderId);

        if (!senderUser) return state;

        // Purani jagah se delete karein aur top par add karein
        const updatedChats = state.chats.filter((c) => String(c._id) !== incomingSenderId);
        const isCurrentChat = state.selectedUser && incomingSenderId === String(state.selectedUser._id);

        return {
          chats: [senderUser, ...updatedChats], // Naya message aane par sender top par
          messages: isCurrentChat ? [...state.messages, newMessage] : state.messages
        };
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

}));
