import React from 'react'
import { RxDividerVertical } from 'react-icons/rx'

const testName = 'Cards-r-us'
const testPort = '3000'

export default function Footer() {
  return (
    <div className='flex flex-row w-[100%] bg-white shadow justify-between bottom-0 fixed h-8 px-6 font-light text-md items-center italic'>
      <div>
        <p>{testName} </p>
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


