import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ParkingState {
  favoriteParkingId: string | null;
  toggleFavorite: (id: string) => void;
  clearFavorite: () => void;
}

export const useParkingStore = create<ParkingState>()(
  persist(
    (set, get) => ({
      favoriteParkingId: null,
      toggleFavorite: (id: string) => {
        set({
          favoriteParkingId: get().favoriteParkingId === id ? null : id,
        });
      },
      clearFavorite: () => set({ favoriteParkingId: null }),
    }),
    { name: 'lynx-parking-favorite' }
  )
);
