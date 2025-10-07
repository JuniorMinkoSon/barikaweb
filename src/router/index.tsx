import { HashRouter, Routes, Route } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'
import Settings from '../pages/Settings'

import Home from '../pages/Home'
import About from '../pages/About'
import Services from '../pages/Services'
import Objectives from '../pages/Objectives'
import Projects from '../pages/Projects'
import Contact from '../pages/Contact'

const AppRouter = () => (
  <HashRouter>
    <Navbar />
    {/* Espace pour compenser la navbar fixe */}
    <div className="h-16" />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/profile" element={<Profile />} />
      <Route path="/dashboard/settings" element={<Settings />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/objectives" element={<Objectives />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  </HashRouter>
)

export default AppRouter