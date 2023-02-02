import { Component, createEffect, For, onMount, Show } from 'solid-js'
import { Song } from '../../types/Song'
import debouncer from '../../utils/debounce'
import {
  getSearchResults,
  searchResults,
  searchTerm,
  setSearchTerm,
  selectedSongs,
} from '../../utils/song'
import SearchResult from '../SearchResults/SearchResults'

import './SearchModal.css'

const openModal = () => {
  const modal = document.querySelector('#modal')
  const searchInput = document.querySelector('#searchInput') as HTMLInputElement
  modal.classList.remove('hidden')
  searchInput.focus()
}

const closeModal = () => {
  const modal = document.querySelector('#modal')
  modal.classList.add('hidden')
}

const SearchModal: Component = () => {

  const debounceSearch = debouncer(getSearchResults, 300)

  createEffect(() => {
    searchTerm()
    debounceSearch()
  })

  return (
    <div>
      <div
        id='modal'
        class='relative z-10 hidden'
        aria-labelledby='modal-title'
        role='dialog'
        aria-modal='true'
      >
        <div class='fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-[5px] transition-opacity'></div>
        <div class='fixed inset-0 z-10 overflow-y-auto'>
          <div class='flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0'>
            <div class='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
              <a class='absolute top-3 right-3 scale-150' onClick={closeModal}>
                <svg
                  class='svg-icon'
                  style='width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;'
                  viewBox='0 0 1024 1024'
                  version='1.1'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M647.744 285.696 512 421.504 376.256 285.696 285.696 376.256 421.504 512l-135.744 135.744 90.496 90.496L512 602.496l135.744 135.744 90.496-90.496L602.496 512l135.744-135.744L647.744 285.696zM874.048 149.952c-199.936-199.936-524.16-199.936-724.096 0-199.936 199.936-199.936 524.16 0 724.096 199.936 199.936 524.16 199.936 724.096 0C1073.984 674.112 1073.984 349.888 874.048 149.952zM783.552 783.552c-149.952 149.952-393.088 149.952-543.04 0s-149.952-393.088 0-543.04c149.952-149.952 393.088-149.952 543.04 0C933.504 390.464 933.504 633.536 783.552 783.552z' />
                </svg>
              </a>
              <div class='flex flex-col px-4 justify-center items-center'>
                <div class='text-[1.5rem] input-text mt-2'>Search Songs:</div>
                <input
                  value={searchTerm()}
                  id='searchInput'
                  class='w-full rounded-md bg-base py-3 pl-10 outline-none mb-2'
                  placeholder='Song Name, Ex: High On Life'
                  onInput={(e) => setSearchTerm((e.target as any).value)} // HACK: Change any to suitable datatype
                />
              </div>

              <div class='flex flex-col items-center p-2 rounded-lg shadow-md w-full overflow-x-hidden overflow-y-scroll max-h-[50vh] scrollbar'>
                <For each={searchResults()}>
                  {(song: Song) => {
                    const selectedIds = selectedSongs()
                      .filter((selectedSong) => selectedSong !== null)
                      .map((selectedSong) => selectedSong.id)
                    if (!selectedIds.includes(song.id)) {
                      return <SearchResult song={song} />
                    }
                  }}
                </For>
                <For each={searchResults()}>
                  {(song: Song) => {
                    const selectedIds = selectedSongs()
                      .filter((selectedSong) => selectedSong !== null)
                      .map((selectedSong) => selectedSong.id)
                    if (!selectedIds.includes(song.id)) {
                      return <SearchResult song={song} />
                    }
                  }}
                </For>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchModal
export { openModal, closeModal }
