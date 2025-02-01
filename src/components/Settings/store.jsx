import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      timerBlinds: 20,
      nextBreak: 60,
      blindsMode: "normal",
      players: 4,
      initialStack: 5000,
      audioSet: "funny",

      // Funzioni per aggiornare lo stato
      updateTimerBlinds: (value) => set({ timerBlinds: value }),
      updateNextBreak: (value) => set({ nextBreak: value }),
      updateBlindsMode: (value) => set({ blindsMode: value }),
      updatePlayers: (value) => set({ players: value }),
      updateInitialStack: (value) => set({ initialStack: value }),
      updateAudioSet: (value) => set({ audioSet: value }),

      presets: {
        Default: { timerBlinds: 20, nextBreak: 60, blindsMode: "normal", players: 4, initialStack: 5000, audioSet: "funny" },
      },

      // Funzione per salvare un preset con nome personalizzato
      savePreset: (presetName) => {
        if (!presetName.trim()) return;

        const { presets, timerBlinds, nextBreak, blindsMode, players, initialStack, audioSet } = get();

        set({
          presets: {
            Default: presets.Default,
            ...presets,
            [presetName]: { timerBlinds, nextBreak, blindsMode, players, initialStack, audioSet },
          },
        });
      },

      // Funzione per caricare un preset salvato
      loadPreset: (presetName) => {
        const { presets } = get();
        if (presets[presetName]) {
          set({ ...presets[presetName] });
        }
      },

      //Funzione per eleminare un preset salvato tranne quello "Default"
      deletePreset: (presetName) => {
        const { presets } = get();
        if (presetName !== "Default") {
          const updatePreset = { ...presets };
          delete updatePreset[presetName];
          set({ presets: updatePreset });
        }
      },
    }),
    {
      name: "test-storage",
      getStorage: () => localStorage,
    }
  )
);
