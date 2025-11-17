import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './contexts/ThemeContext'
import Dashboard from './components/Dashboard'
import HabitTracker from './components/HabitTracker'
import NewHabit from './components/NewHabit'
import HabitDetail from './components/HabitDetail'
import EditHabit from './components/EditHabit'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tracker" element={<HabitTracker />} />
            <Route path="/new-habit" element={<NewHabit />} />
            <Route path="/habit/:id" element={<HabitDetail />} />
            <Route path="/habit/:id/edit" element={<EditHabit />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </ThemeProvider>
  )
}

export default App
