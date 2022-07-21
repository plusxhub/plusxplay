import create from 'zustand'
import ISong from '../types/SearchResults'

// An interface that has a key value pair with a getter and setter public method
interface SelectedSongsStore {
  selectedSongs: (ISong | null)[]
  addSelectedSong: (index: number, song: ISong) => void
  unselectSong: (index: number) => void
}

// Implement a zustand store out of IChoices
const useChoices = create<SelectedSongsStore>((set) => ({
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
}))

export default useChoices
