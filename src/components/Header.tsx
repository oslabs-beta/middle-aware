import React, { useState } from 'react'
import Logo from '../static/logo.svg'
import { GrConfigure, GrRefresh } from 'react-icons/gr'
import { RxDividerVertical } from 'react-icons/rx'
import Toggle from "./Toggle"
import { BiTestTube } from 'react-icons/bi'
import { IoStopSharp } from 'react-icons/io5'
import { HeaderProps } from '../Types'
import Notification from './Notification'

export default function Header({ config, configStatus, started, instrument, tests }: HeaderProps) {

  const [auto, setAuto] = useState(true)
  const [start, setStart] = useState(false)
  //for notification
  const [show, setShow] = useState(false)
  //to rotate start button refresh icon
  const [loading, setLoading] = useState(false)
  //for tracking when stop is an active option
  const [stop, setStop] = useState(false)

  //Prevent start if config file is not loaded or if stop is active
  const startOrNot = () => {
    instrument()
    console.log('startInstrumentation triggered')
    if (!configStatus) {
      setShow(true)
    } else if (!start && configStatus) { 
      //spinner while starting
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setStart(!start)
        started()
      }, 3000)
    } else {
      //flashing stop button (start is true)
      setStop(true)
      setTimeout(() => {
        setStop(false)
        setStart(!start)
        started()
      }, 3000)
    }
    //dismiss the notification (5s is longer than component-(4s) for transition)
    setTimeout(() => {
      setShow(false)
    }, 5000)
  }
  //Prevent fetch if config file is not loaded
  const fetchOrNot = () => {
    if (!configStatus) {
      setShow(true)
    } else {
      tests()
      console.log('Tests triggered')
    }
    setTimeout(() => {
      setShow(false)
    }, 5000)
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
              {start ? 
              
                stop?
                <IoStopSharp className='animate-pulse text-[#EF476F]' /> 
                :
                  <IoStopSharp /> 

                :

                loading ? <GrRefresh className='animate-spin' /> 
                  :
                  <GrRefresh />}
            </div>
            {start ? 'Stop' : 'Start'}
          </button>
          <div className='text-slate-300'>
            <RxDividerVertical size={30} />
          </div>

          <div className='flex flex-row w-48 justify-between items-center'>
            <Toggle auto={() => setAuto(!auto)} />
            {auto ?
              <button
                type="button"
                className="fetchButton"
                onClick={fetchOrNot}
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
      {show ? <Notification message={'Select a Config File'} /> : null}
    </div>
  )
}
