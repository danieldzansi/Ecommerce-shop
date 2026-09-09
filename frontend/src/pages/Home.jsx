import React from 'react'
import Hero from '../components/Hero'
import CategoryShowcase from '../components/CategoryShowcase'
import ProductTabs from '../components/ProductTabs'
import OurPolicy from '../components/OurPolicy'
import NewsLeterBox from '../components/NewsLeterBox'


const Home = () => {
  return (
    <div>
      <Hero/>
      <CategoryShowcase/>
      <ProductTabs/>
      <OurPolicy/>
      <NewsLeterBox/>
    </div>
  )
}

export default Home
