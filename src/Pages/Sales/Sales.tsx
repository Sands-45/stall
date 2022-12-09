import {FC} from 'react'

type Props = {}

const Sales:FC<Props> = () => {
  return (
    <div className="w-full h-full overflow-hidden px-[2.5%] py-4 flex flex-col justify-between space-y-4">
      <div className="h-12 w-full border border-slate-600 flex items-center justify-between overflow-hidden">
        <button className="h-8 w-12 rounded-l bg-white"></button>
        <button className="h-8 w-10 rounded-l-full bg-white"></button>
      </div>

      {/**Sales Table */}
      <div className="w-full h-[calc(100%-3.5rem)] bg-white rounded"></div>
    </div>
  )
}

export default Sales