import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Meetings from './pages/Meetings'
import MeetingDetail from './pages/MeetingDetail'
import Artisans from './pages/Artisans'
import BoothMap from './pages/BoothMap'
import { useState } from 'react'

function App() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="min-h-screen bg-heritage-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/meetings/:id" element={<MeetingDetail />} />
          <Route path="/artisans" element={<Artisans />} />
          <Route path="/booths" element={<BoothMap />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
