import React from 'react'
import { RouteProps, statusColors } from '../Types'

const RouteCards = ({ id, detail, onClick, available, error }: RouteProps) => {
  const statusColors: statusColors = { error: '#fba8a0', good: '#9ffad3', default: '#FAF8F4' }
  const color = (available ? (error ? statusColors.error : statusColors.good) : statusColors.default)

  return (

    <div id={id} className='routes' style={{ backgroundColor: color }} onClick={onClick}>
      Endpoint: {detail}<br/>
    </div>

  )
}

export default RouteCards
