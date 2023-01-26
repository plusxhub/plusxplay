import { Component } from 'solid-js'

import './SearchModal.css'

const openModal = () => {
  const modal = document.querySelector('#modal')
  modal.classList.remove('hidden')
}

const closeModal = () => {
  const modal = document.querySelector('#modal')
  modal.classList.add('hidden')
}

const SearchModal: Component = () => {

  return (
    <div>
      <div
        id='modal'
        class='relative z-10 hidden'
        aria-labelledby='modal-title'
        role='dialog'
        aria-modal='true'
      >
        <div class='fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-[3px] transition-opacity'></div>
        <div class='fixed inset-0 z-10 overflow-y-auto'>
          <div class='flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0'>
            <div class='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
              <div class='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                <div class='sm:flex sm:items-start'>
                  <div class='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                    <h3
                      class='text-lg font-medium leading-6 text-gray-900'
                      id='modal-title'
                    >
                      Deactivate account
                    </h3>
                  </div>
                </div>
              </div>
              <div class='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
                <button onClick={closeModal}
                  type='button'
                  class='inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm'
                >
                  Deactivate
                </button>
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
