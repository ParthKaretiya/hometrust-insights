import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LocalityReport } from "./mock-data";

export type Role = "buyer" | "broker" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
};

type AppState = {
  user: User | null;
  login: (email: string, role?: Role) => void;
  logout: () => void;
  setRole: (role: Role) => void;

  savedReports: LocalityReport[];
  saveReport: (r: LocalityReport) => void;
  deleteReport: (id: string) => void;

  favoriteLocalities: string[];
  toggleFavorite: (id: string) => void;

  blockedBrokers: string[];
  toggleBlockBroker: (id: string) => void;

  reportedListings: { id: string; reason: string; note: string; at: string }[];
  reportListing: (id: string, reason: string, note: string) => void;
};

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      login: (email, role = "buyer") => {
        const name = email.split("@")[0].replace(/\W/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Demo User";
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
