import { Component } from 'solid-js'
import { Song } from '../../types/Song'
import playButton from '../../assets/play_button.svg'
import pauseButton from '../../assets/pause_button.svg'
import { truncateString } from '../../utils/song'

interface SongProps {
  song: Song
}

const SongCardMobile: Component<SongProps> = ({ song }) => {
  const artists = song.artists.map((artist) => artist.name).join(', ')
  return (
    <div class='flex items-center p-2 rounded-lg shadow-md lg:hidden'>
      <div class='relative'>
        <img
          src={song.image}
          alt={song.name}
          class='w-24 h-24 rounded-lg mr-6 object-contain'
        />
      </div>
      <div>
        <p class='font-medium'>{truncateString(song.name, 18)}</p>
        <p class='text-gray-600 text-sm'>
          {truncateString(artists, 30)}
        </p>
        <p class='text-gray-600 text-sm'>{song.release_date}</p>
      </div>
    </div>
  )
}

export default SongCardMobile
