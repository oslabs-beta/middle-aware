import React, { useState } from 'react'
import { RxDividerVertical } from 'react-icons/rx'
import { FaCircle } from 'react-icons/fa'
import { FooterProps } from '../Types'

export default function Footer ({ started, projectName, proxyPort, frontEndPort, backEndPort }: FooterProps) {
  console.log('Here are some props:', projectName, proxyPort, frontEndPort)
  return (
    <div className='flex flex-row w-[100%] bg-white shadow justify-between bottom-0 fixed h-8 px-6 font-light text-md items-center italic'>
      <div className='whitespace-nowrap overflow-clip max-w-[20%]'>
        <p>{projectName} </p>
      </div>
      <div className='flex flex-row items-center'>
        {
          started
            ? <div className='flex flex-row items-center'>
              <p className='mr-2'>App Status: </p>
              <FaCircle className='text-[#06D6A0] animate-pulse' />
              <p>&nbsp;(Running)</p>
            </div>
            : <div className='flex flex-row items-center'>
              <p className='mr-2'>App Status: </p>
              <FaCircle className='text-[#EF476F]' />
              <p>&nbsp;(Stopped)</p>
            </div>
        }
      </div>
      <div className='flex flex-row w-[50%] justify-between items-center'>
        <div>
          <p>Proxy Port: {proxyPort} </p>
        </div>
        <RxDividerVertical size={15} />
        <div>
          <p>Front End Port: {frontEndPort} </p>
        </div>
        <RxDividerVertical size={15} />
        <div>
          <p>Back End Port: {backEndPort} </p>
        </div>
      </div>
    </div>
  )
}
