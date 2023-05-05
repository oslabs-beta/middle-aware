import React from 'react'
import Logo from '../static/logo.svg'
import { GrConfigure, GrRefresh } from 'react-icons/gr'
import { RxDividerVertical } from 'react-icons/rx'
import Toggle from "./Toggle"
import {BiTestTube} from 'react-icons/bi'

export default function Header() {
  return (
    <div className='h-18 flex flex-row bg-white shadow py-2 px-6 items-center justify-between'>
      <div>
        <Logo height={50} />
      </div>
      <div className='flex flex-row w-[50%] justify-evenly items-center'>
        <button
          type="button"
          className="button"
        >
          <div className='icons'>
            <GrConfigure />
          </div>
          Config File
        </button>
        <button
          type="button"
          className="button"
        >
          <div className='icons'>
            <GrRefresh />
          </div>
          Button text
        </button>
        <RxDividerVertical size={30} />

        {/* <div className='rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 items-center flex flex-row justify-between'> */}
          <Toggle />
          <button
            type="button"
          className="button"
          >
            <div className='icons'>
            <BiTestTube />
            </div>
            Fetch Tests
          </button>
        {/* </div> */}

      </div>
    </div>
  )
}
