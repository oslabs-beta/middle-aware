import React from 'react'
import ErrorArrow from './ErrorArrow'
import SuccessArrow from './SuccessArrow'
import { ResultProps } from '../Types'

const resultCards = ({ id, request, response, rtt, middleware }: any) => {
  return (
    // <>
    // {/* use a conditional statement to not allow
    // the first arrow to be rendered perhaps passing the index and making a rule if its [0] */}

    //   <div id={id} className='cards'>
    //  <h1>Request</h1>
    //   {/* Endpoint: {request.endpoint}<br />
    //   Method: {request.method}<br /> */}

    //   <p>Endpoint: {request.endpoint}</p>
    //   <br />
    //   <p>Method: {request.method}</p>
    //   </div>

    //   {
    //   response.status_code !== 200 ? <ErrorArrow/> : <SuccessArrow/>
    // }

    // <div id={id} className='cards'>
    //  <h1>Response</h1>
    //   <p>Message: {response.message}</p>
    //   <br />
    //   {/* <p>Payload: {response.payload}</p>
    //   <br /> */}
    //   <p>Status Code: {response.status_code}</p>
    //   <br />
    //   <p>Round Trip Time: {rtt}</p>
    //   </div>

    // </>
    <>
      <div id={id} className='w-[100%] min-h-fit items-center p-10 rounded-md overflow-auto flex flex-row border border-slate-300 shadow mb-4'
        style={{ background: '#F8FFE5' }}>
          


        {request.method}
      </div>

      {
        middleware.map((func: string) => {
          return (<div id={id} key={middleware.indexOf(func)} className='w-[100%] min-h-fit items-center p-10 rounded-md overflow-auto flex flex-row border border-slate-300 shadow mb-4'
            style={{ background: '#F8FFE5' }}>
            {func}
          </div>)
        })

      }

      <div id={id} className='w-[100%] min-h-fit items-center p-10 rounded-md overflow-auto flex flex-row border border-slate-300 shadow mb-4'
        style={{ background: '#F8FFE5' }}>
        {response.body}
        {rtt}
      </div>
    </>

  )
}

export default resultCards
