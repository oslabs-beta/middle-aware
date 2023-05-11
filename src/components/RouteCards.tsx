import React from 'react'
import { RouteProps, statusColors } from '../Types'
import { MdOutlineRoute } from 'react-icons/md'

const RouteCards = ({ id, detail, onClick, available, error }: RouteProps) => {

  return (
    <div id={id} className='w-[100%] min-h-fit items-center p-10 rounded-md overflow-auto flex flex-row border border-slate-300 shadow mb-4'
      style={{ background: '#F8FFE5' }}
      onClick={onClick}>

      {available ?

        error ?

          (<div className='pr-2 text-[#EF476F]'>
            <MdOutlineRoute size={30} />
          </div>)
          :


          (<div className='pr-2 text-[#06D6A0]'>
            <MdOutlineRoute size={30} />
          </div>)

        :

        (<div className='pr-2 text-[#50504f91]'>
          <MdOutlineRoute size={30} />
        </div>)
      }


      <p className='whitespace-normal break-words text-slate-600'>{detail}</p>
    </div>
  )
}

export default RouteCards
