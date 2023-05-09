import React from 'react'
import {CgSpinnerTwoAlt} from 'react-icons/cg'

export default function Loading() {
  return (
    <div className='h-screen w-screen bg-black opacity-40 flex items-center justify-center'>
        <CgSpinnerTwoAlt className='animate-spin text-white text-9xl' />
    </div>
  )
}

