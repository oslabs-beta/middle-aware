import React from 'react'
import Logo from '../static/logo.svg'

export default function Header() {
  return (
    <div className='h-18 flex flex-row bg-white shadow py-2 px-6 items-center justify-between'>
      <div>
        <Logo height={50} />
      </div>
      <div className='flex flex-row w-[40%] justify-evenly'>
        <button
          type="button"
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Button text
        </button>
        <button
          type="button"
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Button text
        </button>
        <button
          type="button"
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Button text
        </button>
      </div>
    </div>
  )
}
