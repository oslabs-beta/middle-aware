import React from 'react'
import Logo from '../static/logo.svg'

const Header = () => {
  return (
    <div className='flex flex-row h-10'>
      <Logo height={50}/>
      <h1 className='text-3xl'>Middle-Aware</h1>
    </div>
  )
}

export default Header
