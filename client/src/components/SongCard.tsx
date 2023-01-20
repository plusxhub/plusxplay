import { Component } from "solid-js";
import { Song } from "../types/Song";

interface SongProps {
  song: Song
}

const SongCard: Component<SongProps> = ({ song }) => {
  return (
    <div class="flex min-w-[15vh]">
      <img class="" src={song.image} alt={song.name} />
    </div>
  )
}

export default SongCard
