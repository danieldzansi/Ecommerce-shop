import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className="border-t pt-16 text-gray-700">
      
      <div className="text-2xl mb-6"> 
        <Title text1={'ABOUT'} text2={'US'} />
      </div>
      <div className='my-10 flex-col md:flex pt-8 border-t'>
         <img className='w-full md:max-[450px]:' src={assets.about_img} alt="" />
      </div>
      
      <div className="max-w-4xl mx-auto px-4 leading-relaxed space-y-6">
        <p>
          Welcome to <span className="font-semibold text-gray-900">Forever</span> — your trusted digital marketplace that makes shopping simple, secure, and seamless.
          We connect customers with quality products and ensure a smooth checkout process using modern payment technology.
        </p>

        <p>
          Our mission is to make online shopping effortless. Whether you're buying for yourself or sending gifts to loved ones,
          we provide a fast, reliable, and transparent experience from browsing to delivery.
        </p>

        <p>
          At <span className="font-semibold text-gray-900">Bitsend</span>, we value innovation and customer satisfaction. 
          Our platform is designed with user convenience in mind, combining beautiful design, speed, and security.
        </p>

        <p>
          Thank you for choosing us! We’re constantly improving our platform to serve you better and bring you the latest products at the best prices.
        </p>

        {/* 🌍 Mission Section */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">Our Mission</h2>
          <p>
            To empower people across Africa to shop, pay, and connect effortlessly through technology —
            turning every purchase into a seamless experience powered by trust and innovation.
          </p>
        </div>

        {/* 👥 Vision Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">Our Vision</h2>
          <p>
            To become Africa’s most customer-centric eCommerce brand, where people can find and discover anything they love — 
            all while enjoying fast, secure, and borderless payments.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
