import React from 'react'
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineArrowDown } from "react-icons/ai";

const resultCards = () => {

  return (
    <>
    <div id='resultCards'>
      <h2>Message: </h2>
      <h2>Payload: </h2>
      <h2>Status: </h2>
    </div>
<AiOutlineArrowDown id='successArrow' />
<AiOutlineCheckCircle id='successStatus'/>
     
      <div id='resultCards'>
        <h2>Message: </h2>
        <h2>Payload: </h2>
        <h2>Status: </h2>
      </div>
<AiOutlineCloseCircle id='errorStatus'/>
      <div id='resultCards'>
        <h2>Message: </h2>
        <h2>Payload: </h2>
        <h2>Status: </h2>
      </div>
      <div id='resultCards'>
        <h2>Message: </h2>
        <h2>Payload: </h2>
        <h2>Status: </h2>
      </div>

      <div id='resultCards'>
        <h2>Message: </h2>
        <h2>Payload: </h2>
        <h2>Status: </h2>
      </div>
    </>
  )
}

export default resultCards