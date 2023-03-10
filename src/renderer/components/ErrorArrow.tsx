import React from 'react'
import { AiOutlineCloseCircle, AiOutlineArrowDown } from "react-icons/ai";

const ErrorArrow = () => {
  return (
    <>
      <AiOutlineArrowDown id='arrow' />
      <AiOutlineCloseCircle id='errorStatus' />
    </>
  )
}

export default ErrorArrow