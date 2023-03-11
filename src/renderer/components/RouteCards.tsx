import React from 'react'


type RouteProps = {
  id?: string;
  detail: string;
  method?: string;
  message?: string;
  available?: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement> | undefined;
}

const RouteCards = ({ id, detail, onClick, available }: RouteProps) => {


  const statusColors: any = { error: '#fba8a0', good: '#9ffad3', default: '#FAF8F4' }

  return (

    <div id={id} className='routes' style={(available ? { backgroundColor: statusColors.good } : { backgroundColor: statusColors.default })} onClick={onClick}>
      Endpoint: {detail}<br/>
      {/* Method: {method} <br/>
      Status: {message} */}
    </div>

  )
}

export default RouteCards