import React from 'react'
import ErrorArrow from './ErrorArrow'
import SuccessArrow from './SuccessArrow'
import { ResultProps } from '../Types'

const resultCards = ({ id, request, response, rtt, middleware }: any) => {

  let bodyValues
  let bodyKeys
  let paramsKeys
  let paramsValues
  let queryKeys
  let queryValues
  let time
  let statusCode


  if (typeof request.body === 'object' && request.body !== null) {
    bodyKeys = Object.keys(request.body)
    bodyValues = Object.values(request.body)
  }

  if (typeof request.params === 'object' && request.params !== null) {
    paramsKeys = Object.keys(request.params)
    paramsValues = Object.values(request.params)
  }

  if (typeof request.query === 'object' && request.query !== null) {
    queryKeys = Object.keys(request.query)
    queryValues = Object.values(request.query)
  }
  if (rtt !== undefined) { time = `${rtt.slice(0, 5)} ms` }
  if (typeof request.body === 'object' && request.body?.status_code !== null) {statusCode = request.body.status_code}

  return (

    <>
      <div id={id} className='w-[100%] p-10 rounded-md overflow-auto flex flex-col border border-slate-300 shadow mb-4'
        style={{ background: '#F8FFE5' }}>

        <p className='underline underline-offset-4 text-2xl self-center text-slate-600'>Request</p>

        <div className='ReqRespCards'> <p className='card-sub-titles'>Method: </p> {request.method}</div>
        <hr className="horizontalRule" />
        <div className='ReqRespCards'> <p className='card-sub-titles'>Body: </p> {bodyValues} </div>
        <hr className="horizontalRule" />
        <div className='ReqRespCards'> <p className='card-sub-titles'>Params: </p> {paramsValues}</div>
        <hr className="horizontalRule" />
        <div className='ReqRespCards'> <p className='card-sub-titles'>Query: </p> {queryValues}</div>
      </div>

      {
        middleware.map((func: string) => {
          return (<div id={id} key={middleware.indexOf(func)} className='w-[60%] min-h-fit items-center p-10 rounded-md overflow-auto flex flex-col border border-slate-300 shadow mb-4'
            style={{ background: '#F8FFE5' }}>
            <p className='underline underline-offset-4 text-xl self-center text-slate-600 mb-3'>Function:{' '}{`${middleware.indexOf(func)+1}`}</p>
            <div className=' text-slate-600 text-lg'>{func}</div> 
          </div>)
        })

      }

      <div id={id} className='w-[100%] p-10 rounded-md overflow-auto flex flex-col border border-slate-300 shadow mb-4'
        style={{ background: '#F8FFE5' }}>

        <p className='underline underline-offset-4 text-2xl self-center text-slate-600'>Response</p>

      {/* <div id={id} className='w-[100%] min-h-fit items-center p-10 rounded-md overflow-auto flex flex-row border border-slate-300 shadow mb-4'
        style={{ background: '#F8FFE5' }}> */}
          <div className='ReqRespCards'> <p className='card-sub-titles'>Round Trip Time:</p> {time}</div>
          <hr className="horizontalRule" />
          <div className='ReqRespCards'> <p className='card-sub-titles'>Status Code: </p> {statusCode} </div>
          <hr className="horizontalRule" />
          <div className='ReqRespCards'> <p className='card-sub-titles'>Body: </p> {response.body} </div>
      </div>

      {/* </div> */}
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
