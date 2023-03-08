import React from 'react'


type RouteProps = {
  id: string
  detail: string;
  method: string;
  message: string;
}

const RouteCards = ({ id, detail, method, message }: RouteProps) => {


  const statusColors: any = { error: '#fba8a0', good: '#9ffad3', default: '#FAF8F4' }

  return (

    <div id='routes' style={{ backgroundColor: statusColors[message] }}>
      <h2>Endpoint:{detail} </h2>
      <h2>Method:{method}</h2>
      <h2>Status: {message}</h2>
    </div>

  )
}

export default RouteCards