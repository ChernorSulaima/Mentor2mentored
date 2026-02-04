import React from 'react'

const LoadingPage = ({chatpage}) => {
  return (
    <div className='h-screen flexCenter flex-col p-4'>
      <span className='loading loading-ring' />
      {chatpage && <p className="mt-4 text-center text-lg font-mono">Connecting to chat...</p>}
    </div>
  )
}

export default LoadingPage