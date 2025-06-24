import React from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Works from './components/Works'
import Contact from './components/Contact'
import Footer from './components/Footer'
import NavMenu from './components/NavMenu'
import Testimonial from './components/Testimonial'

const App = () => {
  return (
    <div>
      <NavMenu />
      <Hero />
      <About />
      <Skills />
      <Works />
      <Testimonial />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
