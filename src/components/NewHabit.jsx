import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Plus, X, Bell, BookOpen, Brain, Dumbbell, Droplet, Circle,
  Coffee, Apple, Moon, Music, Heart, Sun, Flame, Target, Zap,
  Smile, Star, Trophy, Leaf, Pill, Utensils, Gamepad2, Laptop, PenTool,
  // Health & Fitness
  Activity, Bike, Footprints, Stethoscope, HeartPulse,
  // Food & Nutrition
  Carrot, Fish, Cookie, IceCream, Pizza, Sandwich, Soup, Wine, Milk,
  // Productivity & Learning
  CheckCircle2, Calendar, Clock, GraduationCap, Lightbulb, Notebook, 
  BookMarked, FileText, Clipboard, Briefcase, TrendingUp, BarChart3,
  // Mindfulness & Mental Health
  Flower, Cloud, Rainbow, Wind,
  // Hobbies & Activities
  Paintbrush, Camera, Film, Headphones, Radio, Palette,
  // Social & Relationships
  Users, UserPlus, MessageCircle, Phone, Mail, Gift, PartyPopper,
  // Personal Development
  Award, Medal, Crown, Compass, Map, Navigation, Rocket, Plane,
  // Finance
  DollarSign, CreditCard, Wallet, PiggyBank, TrendingDown, Receipt,
  // Home & Organization
  Home, ShoppingCart, Wrench, Hammer, Brush, ShoppingBag,
  // Environment
  Recycle, Mountain, Bug, Bird,
  // Technology
  Smartphone, Tablet, Monitor, Tv, Wifi, Battery, Cpu,
  // Security & Access
  Lock, Key, Shield, Eye, Ear, Hand, Fingerprint, Scan,
  // Shapes & Symbols
  Gem, Diamond, Coins, Banknote, Square, Triangle, Hexagon, Octagon, Pentagon,
  // Time & Schedule
  Timer, Clock as ClockIcon,
  // Communication
  Send, Video, Mic, Volume2,
  // Tools
  Scissors, Settings, Cog,
  // Transportation
  Car, Bus, Train, Ship,
  // Weather
  Snowflake,
  // Misc
  Infinity, Crosshair, Focus, Layers, Grid, List, Layout, Columns
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Switch } from './ui/switch'
import { addHabit } from '../db'

const iconOptions = [
  // Health & Fitness
  { name: 'activity', icon: Activity },
  { name: 'bike', icon: Bike },
  { name: 'footprints', icon: Footprints },
  { name: 'stethoscope', icon: Stethoscope },
  { name: 'heart-pulse', icon: HeartPulse },
  { name: 'workout', icon: Dumbbell },
  { name: 'running', icon: Footprints },
  
  // Food & Nutrition
  { name: 'apple', icon: Apple },
  { name: 'carrot', icon: Carrot },
  { name: 'fish', icon: Fish },
  { name: 'cookie', icon: Cookie },
  { name: 'ice-cream', icon: IceCream },
  { name: 'pizza', icon: Pizza },
  { name: 'sandwich', icon: Sandwich },
  { name: 'soup', icon: Soup },
  { name: 'wine', icon: Wine },
  { name: 'milk', icon: Milk },
  { name: 'utensils', icon: Utensils },
  { name: 'coffee', icon: Coffee },
  { name: 'water', icon: Droplet },
  
  // Productivity & Learning
  { name: 'check-circle', icon: CheckCircle2 },
  { name: 'calendar', icon: Calendar },
  { name: 'clock', icon: Clock },
  { name: 'graduation-cap', icon: GraduationCap },
  { name: 'lightbulb', icon: Lightbulb },
  { name: 'notebook', icon: Notebook },
  { name: 'book', icon: BookOpen },
  { name: 'bookmarked', icon: BookMarked },
  { name: 'file-text', icon: FileText },
  { name: 'clipboard', icon: Clipboard },
  { name: 'briefcase', icon: Briefcase },
  { name: 'trending-up', icon: TrendingUp },
  { name: 'bar-chart', icon: BarChart3 },
  { name: 'laptop', icon: Laptop },
  { name: 'pen', icon: PenTool },
  
  // Mindfulness & Mental Health
  { name: 'meditation', icon: Brain },
  { name: 'flower', icon: Flower },
  { name: 'cloud', icon: Cloud },
  { name: 'rainbow', icon: Rainbow },
  { name: 'wind', icon: Wind },
  { name: 'smile', icon: Smile },
  { name: 'heart', icon: Heart },
  { name: 'sleep', icon: Moon },
  
  // Hobbies & Activities
  { name: 'paintbrush', icon: Paintbrush },
  { name: 'camera', icon: Camera },
  { name: 'film', icon: Film },
  { name: 'headphones', icon: Headphones },
  { name: 'radio', icon: Radio },
  { name: 'palette', icon: Palette },
  { name: 'music', icon: Music },
  { name: 'gamepad', icon: Gamepad2 },
  
  // Social & Relationships
  { name: 'users', icon: Users },
  { name: 'user-plus', icon: UserPlus },
  { name: 'message-circle', icon: MessageCircle },
  { name: 'phone', icon: Phone },
  { name: 'mail', icon: Mail },
  { name: 'gift', icon: Gift },
  { name: 'party-popper', icon: PartyPopper },
  
  // Personal Development
  { name: 'award', icon: Award },
  { name: 'medal', icon: Medal },
  { name: 'crown', icon: Crown },
  { name: 'trophy', icon: Trophy },
  { name: 'compass', icon: Compass },
  { name: 'map', icon: Map },
  { name: 'navigation', icon: Navigation },
  { name: 'rocket', icon: Rocket },
  { name: 'plane', icon: Plane },
  { name: 'target', icon: Target },
  { name: 'star', icon: Star },
  
  // Finance
  { name: 'dollar-sign', icon: DollarSign },
  { name: 'credit-card', icon: CreditCard },
  { name: 'wallet', icon: Wallet },
  { name: 'piggy-bank', icon: PiggyBank },
  { name: 'trending-down', icon: TrendingDown },
  { name: 'receipt', icon: Receipt },
  { name: 'banknote', icon: Banknote },
  { name: 'coins', icon: Coins },
  
  // Home & Organization
  { name: 'home', icon: Home },
  { name: 'shopping-cart', icon: ShoppingCart },
  { name: 'wrench', icon: Wrench },
  { name: 'hammer', icon: Hammer },
  { name: 'brush', icon: Brush },
  { name: 'shopping-bag', icon: ShoppingBag },
  
  // Environment & Nature
  { name: 'leaf', icon: Leaf },
  { name: 'recycle', icon: Recycle },
  { name: 'mountain', icon: Mountain },
  { name: 'bug', icon: Bug },
  { name: 'bird', icon: Bird },
  
  // Technology
  { name: 'smartphone', icon: Smartphone },
  { name: 'tablet', icon: Tablet },
  { name: 'monitor', icon: Monitor },
  { name: 'tv', icon: Tv },
  { name: 'wifi', icon: Wifi },
  { name: 'battery', icon: Battery },
  { name: 'cpu', icon: Cpu },
  { name: 'scan', icon: Scan },
  
  
  // Security & Access
  { name: 'lock', icon: Lock },
  { name: 'key', icon: Key },
  { name: 'shield', icon: Shield },
  { name: 'eye', icon: Eye },
  { name: 'ear', icon: Ear },
  { name: 'hand', icon: Hand },
  { name: 'fingerprint', icon: Fingerprint },
  
  // Shapes & Symbols
  { name: 'circle', icon: Circle },
  { name: 'square', icon: Square },
  { name: 'triangle', icon: Triangle },
  { name: 'hexagon', icon: Hexagon },
  { name: 'octagon', icon: Octagon },
  { name: 'pentagon', icon: Pentagon },
  { name: 'diamond', icon: Diamond },
  { name: 'gem', icon: Gem },
  
  // Time & Schedule
  { name: 'timer', icon: Timer },
  { name: 'alarm-clock', icon: ClockIcon },
  
  // Communication
  { name: 'send', icon: Send },
  { name: 'video', icon: Video },
  { name: 'mic', icon: Mic },
  { name: 'volume', icon: Volume2 },
  
  // Tools
  { name: 'scissors', icon: Scissors },
  { name: 'settings', icon: Settings },
  { name: 'cog', icon: Cog },
  
  // Transportation
  { name: 'car', icon: Car },
  { name: 'bus', icon: Bus },
  { name: 'train', icon: Train },
  { name: 'ship', icon: Ship },
  
  // Weather
  { name: 'sun', icon: Sun },
  { name: 'snowflake', icon: Snowflake },
  
  // Misc
  { name: 'infinity', icon: Infinity },
  { name: 'crosshair', icon: Crosshair },
  { name: 'focus', icon: Focus },
  { name: 'layers', icon: Layers },
  { name: 'grid', icon: Grid },
  { name: 'list', icon: List },
  { name: 'layout', icon: Layout },
  { name: 'columns', icon: Columns },
  { name: 'flame', icon: Flame },
  { name: 'zap', icon: Zap },
  { name: 'bell', icon: Bell },
]

const weekDays = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
]

const NewHabit = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'book',
    frequency: 'daily',
    isRecurring: true,
    selectedDays: [],
    reminders: [],
    remindersEnabled: false,
  })
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [newReminderTime, setNewReminderTime] = useState('09:00')

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const selectedIcon = iconOptions.find(opt => opt.name === formData.icon)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    // Validate selectedDays for weekly and custom frequencies
    if ((formData.frequency === 'weekly' || formData.frequency === 'custom') && formData.selectedDays.length === 0) {
      alert('Please select at least one day for weekly or custom frequency')
      return
    }

    const habitData = {
      name: formData.name,
      description: formData.description,
      icon: formData.icon,
      frequency: formData.frequency,
      isRecurring: formData.isRecurring,
      selectedDays: (formData.frequency === 'weekly' || formData.frequency === 'custom') ? formData.selectedDays : [],
      reminders: formData.remindersEnabled ? formData.reminders : [],
    }

    await addHabit(habitData)
    navigate('/')
  }

  const toggleDay = (dayValue) => {
    setFormData({
      ...formData,
      selectedDays: formData.selectedDays.includes(dayValue)
        ? formData.selectedDays.filter(d => d !== dayValue)
        : [...formData.selectedDays, dayValue].sort((a, b) => a - b)
    })
  }

  const addReminder = () => {
    if (newReminderTime) {
      setFormData({
        ...formData,
        reminders: [...formData.reminders, newReminderTime],
      })
      setNewReminderTime('09:00')
    }
  }

  const removeReminder = (index) => {
    setFormData({
      ...formData,
      reminders: formData.reminders.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="text-foreground"
        >
          <X className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold flex-1 text-center">Let's start a new habit</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Name</label>
              <Input
                placeholder="Type habit name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Description</label>
              <Input
                placeholder="Describe a habit"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <button
                type="button"
                onClick={() => setShowIconPicker(!showIconPicker)}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-input hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  {selectedIcon && (
                    <selectedIcon.icon className="h-5 w-5" />
                  )}
                  <span>Choose an Icon</span>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </button>
              {showIconPicker && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 grid grid-cols-5 gap-3 max-h-64 overflow-y-auto"
                >
                  {iconOptions.map((option) => {
                    const IconComponent = option.icon
                    return (
                      <button
                        key={option.name}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, icon: option.name })
                          setShowIconPicker(false)
                        }}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          formData.icon === option.name
                            ? 'border-primary bg-primary/20'
                            : 'border-border hover:bg-accent'
                        }`}
                      >
                        <IconComponent className="h-6 w-6 mx-auto text-foreground" />
                      </button>
                    )
                  })}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="text-sm text-muted-foreground mb-2 block">Intervals</label>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={formData.isRecurring ? 'secondary' : 'outline'}
                className="flex-1 h-10"
                onClick={() => setFormData({ ...formData, isRecurring: false })}
              >
                One-Time
              </Button>
              <Button
                type="button"
                variant={formData.isRecurring ? 'default' : 'outline'}
                className="flex-1 h-10"
                onClick={() => setFormData({ ...formData, isRecurring: true })}
              >
                Every day
              </Button>
            </div>
            {formData.isRecurring && (
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  {['daily', 'weekly', 'monthly', 'custom'].map((freq) => (
                    <Button
                      key={freq}
                      type="button"
                      variant={formData.frequency === freq ? 'default' : 'outline'}
                      size="sm"
                      className="h-9"
                      onClick={() => {
                        // Reset selectedDays when switching away from weekly/custom
                        if (freq !== 'weekly' && freq !== 'custom') {
                          setFormData({ ...formData, frequency: freq, selectedDays: [] })
                        } else {
                          setFormData({ ...formData, frequency: freq })
                        }
                      }}
                    >
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </Button>
                  ))}
                </div>
                {(formData.frequency === 'weekly' || formData.frequency === 'custom') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <label className="text-sm text-muted-foreground block">
                      {formData.frequency === 'weekly' ? 'Select days of the week' : 'Select custom days'}
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {weekDays.map((day) => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => toggleDay(day.value)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            formData.selectedDays.includes(day.value)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground hover:bg-accent'
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                    {formData.selectedDays.length === 0 && (
                      <p className="text-xs text-muted-foreground">Please select at least one day</p>
                    )}
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button type="submit" className="w-full h-11 text-base" size="lg">
            Create Habit
          </Button>
        </motion.div>
      </form>
      </div>
    </div>
  )
}

export default NewHabit

