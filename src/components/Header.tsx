import React, { useState } from 'react'
import Logo from '../static/logo.svg'
import { GrConfigure, GrRefresh } from 'react-icons/gr'
import { RxDividerVertical } from 'react-icons/rx'
import Toggle from "./Toggle"
import { BiTestTube } from 'react-icons/bi'
import { IoStopSharp } from 'react-icons/io5'
import { HeaderProps } from '../Types'
import Notification from './Notification'

export default function Header({ config, configStatus, started }: HeaderProps) {

  const [auto, setAuto] = useState(true)
  const [start, setStart] = useState(false)
  const [show, setShow] = useState(false)

  const startOrNot = ()=>{
    if(!configStatus) {
      setShow(true)
    } else {
      setStart(!start)
      started()
    }
    setTimeout(() => {
      setShow(false)
    }, 4000)
  }

  return (
    <div className='fixed w-screen z-50'>
      <div className='h-18 flex flex-row bg-white shadow py-2 px-6 items-center justify-between'>
        <div>
          <Logo height={50} />
        </div>
        <div className='flex flex-row w-[50%] justify-evenly items-center'>
          <button
            type="button"
            className="button"
            onClick={config}
          >
            <div className='icons'>
              <GrConfigure />
            </div>
            Config File
          </button>

          <button
            type="button"
            className="button w-20"
            onClick={() => startOrNot()}
          >

            <div className='icons'>
              {start ? <IoStopSharp /> : <GrRefresh />}
             
            </div>
            {start ? 'Stop' : 'Start'}

          </button>
          {show ? <Notification message={'Select "Config File" first'} />: null}
          <div className='text-slate-300'>
            <RxDividerVertical size={30} />
          </div>

          <div className='flex flex-row w-48 justify-between items-center'>
            <Toggle auto={()=> setAuto(!auto)} />
           {auto ?
              <button
                type="button"
                className="fetchButton"
              >
                <div className='icons'>
                  <BiTestTube />
                </div>
                  Fetch Tests
              </button>
              :
              <button
                type="button"
                className="autoFetchButton"
              >
                <div className='icons'>
                  <BiTestTube />
                </div>
                  Auto Fetch
              </button>
          }
          </div>
        </div>
      </div>
    </div>
  )
}
