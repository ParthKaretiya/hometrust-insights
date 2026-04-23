import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useApp = create(
  persist(
    (set, get) => ({
      user: null,
      login: (email, role = "buyer") => {
        const name =
          email.split("@")[0].replace(/\W/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ||
          "Demo User";
        set({ user: { id: "u1", name, email, role } });
      },
      logout: () => set({ user: null }),
      setRole: (role) => {
        const u = get().user;
        if (u) set({ user: { ...u, role } });
      },

      savedReports: [],
      saveReport: (r) => {
        const exists = get().savedReports.some((x) => x.locality.id === r.locality.id);
        if (exists) return;
        set({ savedReports: [r, ...get().savedReports] });
      },
      deleteReport: (id) =>
        set({ savedReports: get().savedReports.filter((r) => r.locality.id !== id) }),

      favoriteLocalities: [],
      toggleFavorite: (id) => {
        const f = get().favoriteLocalities;
        set({ favoriteLocalities: f.includes(id) ? f.filter((x) => x !== id) : [...f, id] });
      },

      blockedBrokers: [],
      toggleBlockBroker: (id) => {
        const b = get().blockedBrokers;
        set({ blockedBrokers: b.includes(id) ? b.filter((x) => x !== id) : [...b, id] });
      },

      reportedListings: [],
      reportListing: (id, reason, note) =>
        set({
          reportedListings: [
            { id, reason, note, at: new Date().toISOString() },
            ...get().reportedListings,
          ],
        }),
    }),
    { name: "hometrust-store" },
  ),
);
