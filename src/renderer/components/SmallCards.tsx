import React from 'react'
import {Card} from 'react-daisyui'

const SmallCards = () => {
 const menuItems = ['test'];
  return (
     <div>
      <Card {...menuItems} side="lg" className='small'>

        <Card.Body>
          <Card.Title tag="h2">Path</Card.Title>
          <p>Discovered Paths</p>

        </Card.Body>
      </Card>
    </div>
  )
}

export default SmallCards