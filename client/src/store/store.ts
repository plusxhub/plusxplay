import create from 'zustand'
import ISong from '../types/SearchResults'
import { configurePersist } from 'zustand-persist'

const { persist, purge } = configurePersist({
  storage: localStorage,
  key: 'choices',
})

interface SelectedSongsStore {
  selectedSongs: (ISong | null)[]
  addSelectedSong: (index: number, song: ISong) => void
  unselectSong: (index: number) => void
}

// Implement a zustand store out of IChoices
const useChoices = create<SelectedSongsStore>(
  persist(
    {
      key: 'selectedSongs',
      allowlist: ['selectedSongs'],
    },
    (set) => ({
      selectedSongs: new Array<ISong | null>(10).fill(null),
      addSelectedSong: (index: number, song: ISong) =>
        set((state) => {
          const newSelectedSongs = [...state.selectedSongs]
          newSelectedSongs[index] = song

          return { selectedSongs: newSelectedSongs }
        }),
      unselectSong: (index: number) =>
        set((state) => {
          const newSelectedSongs = [...state.selectedSongs]
          newSelectedSongs[index] = null

          return { selectedSongs: newSelectedSongs }
        }),
    })
  )
)

export default useChoices
