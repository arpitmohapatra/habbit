import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Sparkles } from 'lucide-react'

const WelcomeModal = ({ isOpen, onSave }) => {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmedName = name.trim()
    
    if (!trimmedName) {
      setError('Please enter your name')
      return
    }
    
    if (trimmedName.length < 2) {
      setError('Name should be at least 2 characters')
      return
    }
    
    onSave(trimmedName)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full"
          >
            {/* Sparkles Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            
            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
              Welcome to Habbit!
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              Let's start by getting to know you
            </p>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  What's your name?
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setError('')
                  }}
                  placeholder="Enter your name"
                  className="w-full"
                  autoFocus
                  autoComplete="off"
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-2"
                  >
                    {error}
                  </motion.p>
                )}
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3"
              >
                Get Started
              </Button>
            </form>
            
            {/* Info Text */}
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
              Your name will be stored locally on your device
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default WelcomeModal

