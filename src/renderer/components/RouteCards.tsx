import React from 'react'

type RouteProps = {
  id?: string;
  detail: string;
  method?: string;
  message?: string;
  available?: boolean;
  error?: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement> | undefined;
}

const RouteCards = ({ id, detail, onClick, available, error }: RouteProps) => {
  const statusColors: any = { error: '#fba8a0', good: '#9ffad3', default: '#FAF8F4' }
  const color = (available ? (error ? statusColors.error : statusColors.good) : statusColors.default)

  return (

    <div id={id} className='routes' style={{ backgroundColor: color }} onClick={onClick}>
      Endpoint: {detail}<br/>
    </div>

  )
}

export default RouteCards
