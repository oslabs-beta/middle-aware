import React from 'react'
import { CgSpinner } from "react-icons/cg";

const AwaitingInput = () => {
  return (
    <div id = 'overlay'>
      <div id='insideOverlay'>
        <h1>More Input Needed!</h1>
        <h2>Please test the selected route with fetch requests...</h2>
      </div>

        <CgSpinner id='spinner' />

    </div>
  )
}

export default AwaitingInput