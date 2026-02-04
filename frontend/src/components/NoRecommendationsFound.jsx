import React from 'react'

const NoRecommendationsFound = () => {
  return (
     <div className="card bg-base-100 p-6 text-center">
      <h4 className="mb-2">No recommendations available</h4>
      <p className="para">
        Check back later for skill sharing opportunities
      </p>
    </div>
  )
}

export default NoRecommendationsFound