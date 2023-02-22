import React from 'react'
import {Card} from 'react-daisyui'

const LargeCards = () => {
const menuItems = ['test'];
  return (
     <div className='large'>
      <Card {...menuItems} side="lg">

        <Card.Body>
          <Card.Title tag="h2">Route</Card.Title>
          <p>Stats on calls to server</p>

        </Card.Body>
      </Card>
    </div>
  )
}

export default LargeCards