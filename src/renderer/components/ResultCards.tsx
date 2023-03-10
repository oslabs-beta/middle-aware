import React from 'react'
import ErrorArrow from './ErrorArrow'
import SuccessArrow from './SuccessArrow'

type ResultProps = {
  id: string;
  message: string;
  payload: string;
  status: string;
}
//dummy data
const error = true;

const resultCards = ({id, message, payload, status}: ResultProps) => {

  return (
    <>
    {/* use a conditional statement to not allow 
    the first arrow to be rendered perhaps passing the index and making a rule if its [0] */}

    
    {
      error ? <ErrorArrow/> : <SuccessArrow/>
    }

      <div id={id} className='resultCards'>
      Message: {message}<br />
      {/* Payload: {payload}<br /> */}
      Status: {status}
      </div>

    </>
  )
}

export default resultCards