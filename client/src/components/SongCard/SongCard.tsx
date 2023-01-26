import { Component } from "solid-js";
import { Song } from "../../types/Song";

interface SongProps {
  song: Song
}

const SongCard: Component<SongProps> = ({ song }) => {
  return (
    <div class="lg:flex m-2 hidden">
      <img class="w-full h-full object-cover rounded-lg" src={song.image} alt={song.name} />
    </div>
  )
}

export default SongCard
