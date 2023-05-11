import React from 'react'
import ErrorArrow from './ErrorArrow'
import SuccessArrow from './SuccessArrow'
import { ResultProps } from '../Types'

const resultCards = ({ id, request, response, rtt, middleware }: any) => {

  if (typeof request.body === 'object' && request.body !== null) {
    const bodyKeys = Object.keys(request.body)
    const bodyValues = Object.values(request.body)
  }

  if (typeof request.params === 'object' && request.params !== null) {
    const paramsKeys = Object.keys(request.params)
    const paramsValues = Object.values(request.params)
  }

  if (typeof request.query === 'object' && request.query !== null) {
    const queryKeys = Object.keys(request.query)
    const queryValues = Object.values(request.query)
  }
  if (rtt !== undefined) { const time = `${rtt.slice(0, 5)} ms` }

  return (

    <>
      <div id={id} className='w-[100%] min-h-fit items-center p-10 rounded-md overflow-auto flex flex-row border border-slate-300 shadow mb-4'
        style={{ background: '#F8FFE5' }}>

        <h2>Request</h2>
        <div> <p>Method:</p> {request.method}</div>
        <div> <p>Body:</p> {typeof request.body}</div>
        <div> <p>Params:</p> {typeof request?.params}</div>
        <div> <p>Query:</p> {typeof request?.method}</div>


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

  )
}

export default resultCards
