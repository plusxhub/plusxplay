import { Component } from 'solid-js'

const NotFound: Component = () => {
  return (
    <div
      class='flex justify-center items-center overflow-x-hidden'
      style={{ height: window.innerHeight + 'px' }}
    >
      <div class='flex flex-col my-[7vh] md:my-0 lg:my-0 bg-white rounded-xl justify-center items-center min-h-[85vh] w-[90vw] p-4 relative'>
        <div
          style={{
            'font-family': "'Russo One', sans-serif",
            'font-weight': 500,
          }}
          class='text-4xl'
        >
          ERROR 404: Not Found
        </div>

        <div
          style={{
            'font-family': "'Russo One', sans-serif",
            'font-weight': 100,
          }}
          class='text-2xl'
        >
          Looks like you have came to a page that is not working or incorrect.
        </div>

        <a
          href='/'
          class='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 mt-3'
        >
          Home
        </a>
      </div>
    </div>
  )
}

export default NotFound
