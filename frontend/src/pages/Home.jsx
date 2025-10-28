import React from 'react'
import Hero from '../components/Hero'

import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsLeterBox from '../components/NewsLeterBox'


const Home = () => {
  return (
    <div>
      <Hero/>
      <LatestCollection/>
      <BestSeller/>
      <OurPolicy/>
      <NewsLeterBox/>
    </div>
  )
}

export default Home