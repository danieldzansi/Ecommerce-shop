import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

const NewsLeterBox = () => {
  const { backend_url } = useContext(ShopContext)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      toast.error('Please enter your email address.')
      return
    }

    try {
      setLoading(true)
      const backend = backend_url || 'http://localhost:4000'
      const url = new URL('/api/newsletter/subscribe', backend).toString()
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          source: 'homepage-newsletter',
        }),
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Newsletter signup failed.')
      }

      toast.success(data.message || "You're on the list.")
      setEmail('')
    } catch (error) {
      toast.error(error.message || 'We could not join you to the list right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='page-x section-y text-center' data-gsap-reveal>
      <p className='eyebrow'>Private list</p>
      <h2 className='editorial-serif mx-auto mt-3 max-w-2xl text-4xl font-semibold leading-tight text-[#1d1115] md:text-5xl'>First look at the next edit</h2>
      <p className='mx-auto mt-4 max-w-xl text-sm leading-6 text-[#6f5860]'>
        Get early access to new drops, quiet restocks, and styling notes made for a more intentional wardrobe.
      </p>
      <form onSubmit={onSubmitHandler} className='group mx-auto mt-8 flex w-full max-w-xl flex-col border border-[#DBCCB7] bg-white p-2 transition duration-300 focus-within:border-[#5A0019] focus-within:shadow-[0_16px_40px_rgba(90,0,25,0.08)] sm:flex-row'>
         <input
          className='min-h-12 flex-1 px-4 outline-none'
          type="email"
          placeholder='Email address'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <button className='btn-primary transition-transform duration-300 group-focus-within:translate-x-0.5 disabled:cursor-not-allowed disabled:opacity-60' type='submit' disabled={loading}>
          {loading ? 'Joining...' : 'Join the list'}
        </button>
      </form>
     
    </section>
  )
}

export default NewsLeterBox
