import React from 'react'
import Logo from '../static/logo.svg'
import { GrConfigure, GrRefresh } from 'react-icons/gr'
import { RxDividerVertical } from 'react-icons/rx'
import Toggle from "./Toggle"
import { BiTestTube } from 'react-icons/bi'

export default function Header() {
  return (
    <div className='fixed w-screen'>
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
            Start
          </button>
          <div className='text-slate-300'>
            <RxDividerVertical size={30} />
          </div>

          <div className='flex flex-row w-44 justify-between items-center'>
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
          </div>
        </div>
      </div>
    </div>
  )
}
