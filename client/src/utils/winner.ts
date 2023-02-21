import { createSignal } from 'solid-js'
import { Playlist } from '../types/Playlist'
import { User } from '../types/User'
import { Winner } from '../types/Winner'

const [currentWinner, setCurrentWinner] = createSignal<Winner>(null)

const getWinnerFromData = (data: any) => {
  const playlist: Playlist = {
    Choice1: data.choice1 as string,
    Choice2: data.choice2 as string,
    Choice3: data.choice3 as string,
    Choice4: data.choice4 as string,
    Choice5: data.choice5 as string,
    Choice6: data.choice6 as string,
    Choice7: data.choice7 as string,
    Choice8: data.choice8 as string,
    Choice9: data.choice9 as string,
    Choice10: data.choice10 as string,
    UpdatedAt: data.updatedAt as Date,
  }

  const user: User = {
    SpotifyID: data.spotifyUserID,
    DisplayName: data.displayName,
    ProfileImageUrl: data.imageUrl.String || '',
  }

  const winner: Winner = {
    User: user,
    Playlist: playlist,
  }

  return winner
}

export { currentWinner, setCurrentWinner, getWinnerFromData }
