import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../context/LatestCollection'
import BestSeller from '../components/BestSeller'

const Home = () => {
  return (
    <div>
      <Hero/>
      <LatestCollection/>
      <BestSeller/>
    </div>
  )
}

export default Home