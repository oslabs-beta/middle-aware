import React from 'react'
import ErrorArrow from './ErrorArrow'
import SuccessArrow from './SuccessArrow'

type ResultProps = {
  id: string;
  request: any;
  response: any;
  rtt: string;
  route_id:string;
}
//dummy data
const error = false;

const resultCards = ({id, request, response, rtt, route_id}: ResultProps) => {

  return (
    <>
    {/* use a conditional statement to not allow 
    the first arrow to be rendered perhaps passing the index and making a rule if its [0] */}

    


      <div id={id} className='resultCards'>
     <h1>Request</h1>
      Req: {request.endpoint}<br />
      </div>

      {
      error ? <ErrorArrow/> : <SuccessArrow/>
    }

    <div id={id} className='resultCards'>
     <h1>Response</h1>
      Res: {response.message}<br />
      Res: {response.payload}<br />
      Res: {response.status_code}<br />
      rtt: {rtt}<br />
      </div>

    </>
  )
}

export default resultCards