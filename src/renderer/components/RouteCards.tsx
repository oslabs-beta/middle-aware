import React from 'react'


type RouteProps = {
  detail: string;
  method: string;
  error: string;
}

const RouteCards = ({ detail, method, error }: RouteProps) => {


  const statusColors: any = { error: '#fba8a0', good: '#9ffad3', default: '#FAF8F4' }

  return (

    <div id='routes' style={{ backgroundColor: statusColors.good }}>
      <h2>Endpoint:{detail} </h2>
      <h2>Method:{method}</h2>
      <h2>Status: </h2>
    </div>

  )
}

export default RouteCards