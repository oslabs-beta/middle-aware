import React from 'react'
import { AiFillPauseCircle, AiFillPlayCircle } from 'react-icons/ai'

const Footer = () => {
  return (
    <div className='flex flex-row w-[100%] bg-white shadow justify-between bottom-0 fixed h-8 px-6'>
      <p>File Locaton ///////</p>
      <div className='flex flex-row'>
        <p>Status: </p>
        <AiFillPauseCircle className='w-5 text-green-600' />
      </div>
    </div>
  )
}

export default Footer
