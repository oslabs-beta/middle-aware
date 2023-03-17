import React from 'react'
import ErrorArrow from './ErrorArrow'
import SuccessArrow from './SuccessArrow'

type ResultProps = {
  id: string;
  request: any;
  response: any;
  rtt: string;
  route_id?:string;
}

const resultCards = ({ id, request, response, rtt }: ResultProps) => {
  return (
    <>
    {/* use a conditional statement to not allow
    the first arrow to be rendered perhaps passing the index and making a rule if its [0] */}

      <div id={id} className='resultCards'>
     <h1>Request</h1>
      {/* Endpoint: {request.endpoint}<br />
      Method: {request.method}<br /> */}

      <p>Endpoint: {request.endpoint}</p>
      <br />
      <p>Method: {request.method}</p>
      </div>

      {
      response.status_code !== 200 ? <ErrorArrow/> : <SuccessArrow/>
    }

    <div id={id} className='resultCards'>
     <h1>Response</h1>
      <p>Message: {response.message}</p>
      <br />
      {/* <p>Payload: {response.payload}</p>
      <br /> */}
      <p>Status Code: {response.status_code}</p>
      <br />
      <p>Round Trip Time: {rtt}</p>
      </div>

    </>
  )
}

export default resultCards
