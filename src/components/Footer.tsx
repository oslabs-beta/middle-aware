import React, { useState } from 'react'
import { RxDividerVertical } from 'react-icons/rx'
import { FaCircle } from 'react-icons/fa'

const testName = 'Cards-r-us'
const testPort = '3000'

export default function Footer() {
  const [running, setRunning] = useState(false)

  return (
    <div className='flex flex-row w-[100%] bg-white shadow justify-between bottom-0 fixed h-8 px-6 font-light text-md items-center italic'>
      <div className='whitespace-nowrap overflow-clip max-w-[20%]'>
        <p>{testName} </p>
      </div>
      <div className='flex flex-row items-center'>
        {
          running ?
            <div className='flex flex-row items-center'>
              <p className='mr-2'>App Status: </p>
              <FaCircle className='text-[#06D6A0] animate-pulse' />
              <p>&nbsp;(Running)</p>
            </div>
            :
            <div className='flex flex-row items-center'>
              <p className='mr-2'>App Status: </p>
              <FaCircle className='text-[#EF476F]' />
              <p>&nbsp;(Stopped)</p>
            </div>
        }
      </div>
      <div className='flex flex-row w-[50%] justify-between items-center'>
        <div>
          <p>Proxy Port: {testPort} </p>
        </div>
        <RxDividerVertical size={15} />
        <div>
          <p>Front End Port: {testPort} </p>
        </div>
        <RxDividerVertical size={15} />
        <div>
          <p>Back End Port: {testPort} </p>
        </div>
      </div>
    </div>
  )
}


