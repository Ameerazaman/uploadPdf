import React from 'react'

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-6 h-6 border-4 border-t-4 border-red-600 rounded-full animate-spin"></div>
        <p className="text-white text-lg font-semibold">Loading...</p>
      </div>
    </div>
  )
}

export default Loading
