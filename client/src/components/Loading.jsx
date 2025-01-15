import React from 'react'

const Loading = () => {
  return (
    <div>
      <div className='min-h-screen flex items-center justify-center'>
        <div className='w-20 h-20 boder-4 border-gray-300 border-t-4 border-t-blue-400 rounded-full animate-spin'></div>
      </div>
    </div>
  )
}

export default Loading