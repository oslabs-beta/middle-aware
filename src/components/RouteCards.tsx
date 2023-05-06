import React from 'react'
import { RouteProps, statusColors } from '../Types'
import { MdOutlineRoute } from 'react-icons/md'

const RouteCards = ({ id, detail, onClick, available, error }: RouteProps) => {
  const statusColors: statusColors = { 
    error: '#EF476F', 
    good: '#9ffad3', 
    default: '#F8FFE5' }
  const color = (available ? (error ? statusColors.error : statusColors.good) : statusColors.default)

  return (

    <div id={id} className='w-[30%] min-h-fit items-center p-10 rounded-md overflow-auto flex flex-row border border-slate-300 shadow' 
      style={{ background: '#F8FFE5' }} 
    onClick={onClick}>
      <div className='pr-2 text-white'>
        <MdOutlineRoute size={30} />
      </div>
      
      <p className='whitespace-normal break-words text-white'>{detail}</p>
</div>

  )
}

export default RouteCards
