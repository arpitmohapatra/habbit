import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, Plus, BookOpen, Brain, Dumbbell, Droplet, Flame, Home, User, Check, Sun, Moon, ChevronLeft, ChevronRight,
  Coffee, Apple, Music, Heart, Target, Zap, Smile, Star, Trophy, Leaf, Pill, Utensils, Gamepad2, Laptop, PenTool, Circle,
  Activity, Bike, Footprints, Stethoscope, HeartPulse, Carrot, Fish, Cookie, IceCream, Pizza, Sandwich, Soup, Wine, Milk,
  CheckCircle2, Calendar as CalendarIcon, Clock, GraduationCap, Lightbulb, Notebook, BookMarked, FileText, Clipboard, Briefcase, TrendingUp, BarChart3,
  Flower, Cloud, Rainbow, Wind, Paintbrush, Camera, Film, Headphones, Radio, Palette,
  Users, UserPlus, MessageCircle, Phone, Mail, Gift, PartyPopper, Award, Medal, Crown, Compass, Map, Navigation, Rocket, Plane,
  DollarSign, CreditCard, Wallet, PiggyBank, TrendingDown, Receipt, ShoppingCart, Wrench, Hammer, Brush, ShoppingBag,
  Recycle, Mountain, Bug, Bird,
  Smartphone, Tablet, Monitor, Tv, Wifi, Battery, Cpu, Lock, Key, Shield, Eye, Ear, Hand, Fingerprint, Scan,
  Gem, Diamond, Coins, Banknote, Square, Triangle, Hexagon, Octagon, Pentagon, Timer, Clock as ClockIcon,
  Send, Video, Mic, Volume2, Scissors, Cog,
  Car, Bus, Train, Ship, Snowflake, Infinity, Crosshair, Focus, Layers, Grid, List, Layout, Columns, Bell
} from 'lucide-react'
import { Calendar } from './ui/calendar'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from './ui/dropdown-menu'
import { getAllHabits, toggleHabitCompletion, getUserName, saveUserName, isFirstTimeUser } from '../db'
import { format, isSameDay, addDays } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import WelcomeModal from './WelcomeModal'
import { Download } from 'lucide-react'

const iconMap = {
  // Health & Fitness
  activity: Activity,
  bike: Bike,
  footprints: Footprints,
  stethoscope: Stethoscope,
  'heart-pulse': HeartPulse,
  workout: Dumbbell,
  running: Footprints,
  // Food & Nutrition
  apple: Apple,
  carrot: Carrot,
  fish: Fish,
  cookie: Cookie,
  'ice-cream': IceCream,
  pizza: Pizza,
  sandwich: Sandwich,
  soup: Soup,
  wine: Wine,
  milk: Milk,
  utensils: Utensils,
  coffee: Coffee,
  water: Droplet,
  // Productivity & Learning
  'check-circle': CheckCircle2,
  calendar: CalendarIcon,
  clock: Clock,
  'graduation-cap': GraduationCap,
  lightbulb: Lightbulb,
  notebook: Notebook,
  book: BookOpen,
  bookmarked: BookMarked,
  'file-text': FileText,
  clipboard: Clipboard,
  briefcase: Briefcase,
  'trending-up': TrendingUp,
  'bar-chart': BarChart3,
  laptop: Laptop,
  pen: PenTool,
  // Mindfulness & Mental Health
  meditation: Brain,
  flower: Flower,
  cloud: Cloud,
  rainbow: Rainbow,
  wind: Wind,
  smile: Smile,
  heart: Heart,
  sleep: Moon,
  // Hobbies & Activities
  paintbrush: Paintbrush,
  camera: Camera,
  film: Film,
  headphones: Headphones,
  radio: Radio,
  palette: Palette,
  music: Music,
  gamepad: Gamepad2,
  // Social & Relationships
  users: Users,
  'user-plus': UserPlus,
  'message-circle': MessageCircle,
  phone: Phone,
  mail: Mail,
  gift: Gift,
  'party-popper': PartyPopper,
  // Personal Development
  award: Award,
  medal: Medal,
  crown: Crown,
  trophy: Trophy,
  compass: Compass,
  map: Map,
  navigation: Navigation,
  rocket: Rocket,
  plane: Plane,
  target: Target,
  star: Star,
  // Finance
  'dollar-sign': DollarSign,
  'credit-card': CreditCard,
  wallet: Wallet,
  'piggy-bank': PiggyBank,
  'trending-down': TrendingDown,
  receipt: Receipt,
  banknote: Banknote,
  coins: Coins,
  // Home & Organization
  home: Home,
  'shopping-cart': ShoppingCart,
  wrench: Wrench,
  hammer: Hammer,
  brush: Brush,
  'shopping-bag': ShoppingBag,
  // Environment & Nature
  leaf: Leaf,
  recycle: Recycle,
  mountain: Mountain,
  bug: Bug,
  bird: Bird,
  // Technology
  smartphone: Smartphone,
  tablet: Tablet,
  monitor: Monitor,
  tv: Tv,
  wifi: Wifi,
  battery: Battery,
  cpu: Cpu,
  scan: Scan,
  // Security & Access
  lock: Lock,
  key: Key,
  shield: Shield,
  eye: Eye,
  ear: Ear,
  hand: Hand,
  fingerprint: Fingerprint,
  // Shapes & Symbols
  circle: Circle,
  square: Square,
  triangle: Triangle,
  hexagon: Hexagon,
  octagon: Octagon,
  pentagon: Pentagon,
  diamond: Diamond,
  gem: Gem,
  // Time & Schedule
  timer: Timer,
  'alarm-clock': ClockIcon,
  // Communication
  send: Send,
  video: Video,
  mic: Mic,
  volume: Volume2,
  // Tools
  scissors: Scissors,
  settings: Settings,
  cog: Cog,
  // Transportation
  car: Car,
  bus: Bus,
  train: Train,
  ship: Ship,
  // Weather
  sun: Sun,
  snowflake: Snowflake,
  // Misc
  infinity: Infinity,
  crosshair: Crosshair,
  focus: Focus,
  layers: Layers,
  grid: Grid,
  list: List,
  layout: Layout,
  columns: Columns,
  flame: Flame,
  zap: Zap,
  bell: Bell,
}

// Color palette for habit cards
const habitColors = [
  'habit-yellow',
  'habit-green',
  'habit-gray',
  'habit-blue',
  'habit-pink',
  'habit-white',
]

const getHabitColor = (index) => {
  return habitColors[index % habitColors.length]
}

const getHabitColorClasses = (colorClass) => {
  // Return empty string since we'll use inline styles for better control
  return ''
}

const getHabitColorStyle = (colorClass) => {
  return {
    backgroundColor: `hsl(var(--${colorClass}))`
  }
}

const Dashboard = () => {
  const [habits, setHabits] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [userName, setUserName] = useState('')
  const [showWelcome, setShowWelcome] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [canInstall, setCanInstall] = useState(false)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const dateSelectorRef = useRef(null)

  useEffect(() => {
    fetchHabits()
    checkFirstTimeUser()
    setupPWAInstall()
  }, [])

  const setupPWAInstall = () => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isInStandaloneMode = window.navigator.standalone === true
    
    if (isStandalone || isInStandaloneMode) {
      setCanInstall(false)
      return
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setCanInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setCanInstall(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setCanInstall(false)
      setDeferredPrompt(null)
    }
  }

  const checkFirstTimeUser = async () => {
    const isFirstTime = await isFirstTimeUser()
    if (isFirstTime) {
      setShowWelcome(true)
    } else {
      const name = await getUserName()
      setUserName(name || 'User')
    }
  }

  const handleSaveName = async (name) => {
    await saveUserName(name)
    setUserName(name)
    setShowWelcome(false)
  }

  const fetchHabits = async () => {
    const allHabits = await getAllHabits()
    setHabits(allHabits)
  }

  const handleDateSelect = async (date) => {
    setSelectedDate(date)
    // Refresh habits to show updated completion status
    await fetchHabits()
  }

  const handleCalendarDateToggle = async (date, habitId) => {
    await toggleHabitCompletion(habitId, date)
    await fetchHabits()
  }

  const handleHabitClick = (habitId) => {
    navigate(`/habit/${habitId}`)
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const getCompletedDatesForMonth = () => {
    const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
    const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
    const allDates = []
    
    habits.forEach(habit => {
      habit.completedDates?.forEach(dateStr => {
        const date = new Date(dateStr)
        if (date >= monthStart && date <= monthEnd) {
          allDates.push(date.toISOString())
        }
      })
    })
    
    return [...new Set(allDates)]
  }

  const getDays = () => {
    const today = new Date()
    const days = []
    // Show 3 days before today and 3 days after (7 days total, today in middle)
    for (let i = -3; i <= 3; i++) {
      days.push(addDays(today, i))
    }
    return days
  }

  useEffect(() => {
    // Scroll to center today's date when component mounts
    const scrollToToday = () => {
      if (dateSelectorRef.current) {
        const scrollContainer = dateSelectorRef.current
        const todayButton = scrollContainer.querySelector('[data-today="true"]')
        if (todayButton) {
          const containerWidth = scrollContainer.offsetWidth
          const buttonLeft = todayButton.offsetLeft
          const buttonWidth = todayButton.offsetWidth
          const scrollPosition = buttonLeft - (containerWidth / 2) + (buttonWidth / 2)
          scrollContainer.scrollTo({ left: scrollPosition, behavior: 'smooth' })
        }
      }
    }
    
    // Use setTimeout to ensure DOM is fully rendered
    const timer = setTimeout(scrollToToday, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleToggleHabit = async (e, habitId) => {
    e.stopPropagation()
    await toggleHabitCompletion(habitId, selectedDate)
    await fetchHabits()
  }

  const scrollDateSelector = (direction) => {
    if (dateSelectorRef.current) {
      const scrollContainer = dateSelectorRef.current
      const scrollAmount = 120 // Approximate width of one date button + gap
      const currentScroll = scrollContainer.scrollLeft
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount
      
      scrollContainer.scrollTo({ 
        left: newScroll, 
        behavior: 'smooth' 
      })
    }
  }

  const days = getDays()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-20 transition-colors">
      {/* Welcome Modal */}
      <WelcomeModal isOpen={showWelcome} onSave={handleSaveName} />
      
      <div className="max-w-7xl mx-auto px-4 pt-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{getGreeting()},</p>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{userName || 'User'}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-gray-900 dark:text-white"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-900 dark:text-white"
                    aria-label="Settings menu"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {canInstall && (
                    <>
                      <DropdownMenuItem onClick={handleInstallClick}>
                        <Download className="h-4 w-4 mr-2" />
                        Install App
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={() => navigate('/tracker')}>
                    <User className="h-4 w-4 mr-2" />
                    Habit Tracker
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.div>

        {/* Date Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2">
            {/* Left Arrow */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scrollDateSelector('left')}
              className="flex-shrink-0 h-10 w-10 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Scroll dates left"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Date Scroll Container */}
            <div 
              ref={dateSelectorRef}
              className="flex-1 flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {days.map((day, index) => {
                const isSelected = isSameDay(day, selectedDate)
                const isToday = isSameDay(day, new Date())
                const dayNumber = format(day, 'd')
                const dayName = format(day, 'EEE')
                
                return (
                  <button
                    key={`${day.getTime()}-${index}`}
                    data-today={isToday}
                    onClick={() => handleDateSelect(day)}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl font-semibold transition-all snap-center ${
                      isSelected
                        ? 'text-white shadow-md'
                        : isToday
                        ? 'bg-black dark:bg-white text-white dark:text-black'
                        : 'bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700'
                    }`}
                    style={isSelected ? { backgroundColor: 'hsl(var(--habit-green))' } : {}}
                  >
                    <div className="text-xs mb-1">{dayNumber}</div>
                    <div className="text-xs">{dayName}</div>
                  </button>
                )
              })}
            </div>

            {/* Right Arrow */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scrollDateSelector('right')}
              className="flex-shrink-0 h-10 w-10 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Scroll dates right"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Habits Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {habits.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {habits.map((habit, index) => {
                const IconComponent = iconMap[habit.icon] || iconMap.circle
                const isCompleted = habit.completedDates?.some(dateStr => 
                  isSameDay(new Date(dateStr), selectedDate)
                )
                const colorClass = getHabitColor(index)
                const isWhiteCard = colorClass === 'habit-white'

                return (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                  >
                    <div
                      className={`cursor-pointer transition-all hover:shadow-lg rounded-lg ${
                        isWhiteCard 
                          ? 'bg-white border-2 border-gray-300' 
                          : 'border-0'
                      }`}
                      onClick={() => handleHabitClick(habit.id)}
                      style={!isWhiteCard ? getHabitColorStyle(colorClass) : {}}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-2 rounded-lg ${
                            isWhiteCard ? 'bg-gray-100' : 'bg-white/30'
                          }`}>
                            <IconComponent className={`h-5 w-5 ${
                              isWhiteCard ? 'text-gray-900' : 'text-white'
                            }`} />
                          </div>
                          <button
                            onClick={(e) => handleToggleHabit(e, habit.id)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                              isCompleted
                                ? 'bg-white'
                                : isWhiteCard
                                ? 'border-2 border-gray-400'
                                : 'border-2 border-white'
                            }`}
                            aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                          >
                            {isCompleted && <Check className={`h-4 w-4 ${
                              isWhiteCard ? 'text-gray-900' : 'text-gray-900'
                            }`} />}
                          </button>
                        </div>
                        <h3 className={`font-semibold mb-1 ${
                          isWhiteCard ? 'text-gray-900 dark:text-white' : 'text-white'
                        }`}>
                          {habit.name}
                        </h3>
                        <p className={`text-xs ${
                          isWhiteCard ? 'text-gray-600 dark:text-gray-300' : 'text-white/90'
                        }`}>
                          {habit.description || 'Daily habit'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center py-12 text-gray-600 dark:text-gray-400"
            >
              <p>No habits yet. Create your first habit!</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3 safe-area-inset-bottom transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-900 dark:text-white"
            onClick={() => navigate('/')}
          >
            <Home className="h-6 w-6" />
          </Button>
          <Button
            size="icon"
            className="h-14 w-14 rounded-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-lg"
            onClick={() => navigate('/new-habit')}
            aria-label="Add new habit"
          >
            <Plus className="h-7 w-7 text-white stroke-2" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-900 dark:text-white"
            onClick={() => navigate('/tracker')}
          >
            <User className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

