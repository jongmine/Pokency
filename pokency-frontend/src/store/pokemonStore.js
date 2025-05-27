import { create } from "zustand";

export const usePokemonStore = create((set) => ({
  selectedPokemon: null,
  setSelectedPokemon: (pokemon) => set({ selectedPokemon: pokemon }),
  reset: () => set({ selectedPokemon: null }),
}));
