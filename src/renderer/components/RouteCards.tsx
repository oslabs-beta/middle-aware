import React from 'react'

const RouteCards = () => {

  const statusColors: any = { error: '#fba8a0', good: '#9ffad3', default: '#FAF8F4' }

  return (
    <>
      {/* DUPLICATED FOR DEMO PURPOSES ONLY */}
      <div id='routes' style={{ backgroundColor: statusColors.good }}>
      <h2>Endpoint: </h2>
      <h2>Method: </h2>
      <h2>Status: </h2>
    </div>
      <div id='routes' style={{ backgroundColor: statusColors.default }}>
        <h2>Endpoint: </h2>
        <h2>Method: </h2>
        <h2>Status: </h2>
      </div>
      <div id='routes' style={{ backgroundColor: statusColors.error }}>
        <h2>Endpoint: </h2>
        <h2>Method: </h2>
        <h2>Status: </h2>
      </div>

    </>
  )
}

export default RouteCards