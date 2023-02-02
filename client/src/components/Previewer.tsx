import { Component, Show } from 'solid-js'
import playButton from '../assets/play_button.svg'
import pauseButton from '../assets/pause_button.svg'
import { currentlyPreviewing, setCurrentlyPreviewing } from '../utils/song'

interface PreviewerProps {
  songUrl: string
  idx: number
}

const Previewer: Component<PreviewerProps> = ({ songUrl, idx }) => {
  const togglePreview = (id: number) => {
    if (currentlyPreviewing() !== id && currentlyPreviewing() !== null) {
      var currentPreviewer: any = document.getElementById(
        'previewer-' + currentlyPreviewing()
      ) /* HACK: Don't use any */
      currentPreviewer.pause()
    }
    var previewer: any = document.getElementById(
      'previewer-' + id
    ) /* HACK: Don't use any */
    if (previewer.paused) {
      setCurrentlyPreviewing(id)
      previewer.play()
      previewer.addEventListener('ended', function() {
        setCurrentlyPreviewing(null)
      })
    } else {
      setCurrentlyPreviewing(null)
      previewer.pause()
    }
  }

  return (
    <Show
      when={songUrl !== ""}
    >
      <button onClick={() => togglePreview(idx)}>
        <Show
          when={currentlyPreviewing() == idx}
          fallback={<img src={playButton} class='h-8' />}
        >
          <img src={pauseButton} class='h-8' />
        </Show>
        <audio id={'previewer-' + idx} src={songUrl}></audio>
      </button>
    </Show>
  )
}

export default Previewer
