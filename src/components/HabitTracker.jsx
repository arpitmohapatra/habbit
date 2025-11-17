import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Plus, BookOpen, Brain, Dumbbell, Droplet, Flame, Check, X,
  Coffee, Apple, Moon, Music, Heart, Sun, Target, Zap, Smile, Star, Trophy, Leaf, Pill, Utensils, Gamepad2, Laptop, PenTool, Circle,
  Activity, Bike, Footprints, Stethoscope, HeartPulse, Carrot, Fish, Cookie, IceCream, Pizza, Sandwich, Soup, Wine, Milk,
  CheckCircle2, Calendar, Clock, GraduationCap, Lightbulb, Notebook, BookMarked, FileText, Clipboard, Briefcase, TrendingUp, BarChart3,
  Flower, Cloud, Rainbow, Wind, Paintbrush, Camera, Film, Headphones, Radio, Palette,
  Users, UserPlus, MessageCircle, Phone, Mail, Gift, PartyPopper, Award, Medal, Crown, Compass, Map, Navigation, Rocket, Plane,
  DollarSign, CreditCard, Wallet, PiggyBank, TrendingDown, Receipt, Home, ShoppingCart, Wrench, Hammer, Brush, ShoppingBag,
  Recycle, Mountain, Bug, Bird,
  Smartphone, Tablet, Monitor, Tv, Wifi, Battery, Cpu, Lock, Key, Shield, Eye, Ear, Hand, Fingerprint, Scan,
  Gem, Diamond, Coins, Banknote, Square, Triangle, Hexagon, Octagon, Pentagon, Timer, Clock as ClockIcon,
  Send, Video, Mic, Volume2, Scissors, Settings, Cog,
  Car, Bus, Train, Ship, Snowflake, Infinity, Crosshair, Focus, Layers, Grid, List, Layout, Columns, Bell
} from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { getAllHabits, toggleHabitCompletion, deleteHabit, getUserName, saveUserName } from '../db'
import { format, isSameDay } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { User as UserIcon, Edit2 } from 'lucide-react'

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
  calendar: Calendar,
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

const HabitTracker = () => {
  const [habits, setHabits] = useState([])
  const [userName, setUserName] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchHabits()
    loadUserName()
  }, [])

  const loadUserName = async () => {
    const name = await getUserName()
    setUserName(name || 'User')
  }

  const handleEditName = () => {
    setTempName(userName)
    setIsEditingName(true)
  }

  const handleSaveName = async () => {
    const trimmedName = tempName.trim()
    if (trimmedName && trimmedName.length >= 2) {
      await saveUserName(trimmedName)
      setUserName(trimmedName)
      setIsEditingName(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditingName(false)
    setTempName('')
  }

  const fetchHabits = async () => {
    const allHabits = await getAllHabits()
    setHabits(allHabits)
  }

  const handleHabitClick = (habitId) => {
    navigate(`/habit/${habitId}`)
  }

  const handleToggleComplete = async (e, habitId) => {
    e.stopPropagation()
    await toggleHabitCompletion(habitId, new Date())
    await fetchHabits()
  }

  const handleDelete = async (e, habitId) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this habit?')) {
      await deleteHabit(habitId)
      await fetchHabits()
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Habit Tracker</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/new-habit')}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </motion.div>

      {/* User Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <UserIcon className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                {isEditingName ? (
                  <div className="space-y-3">
                    <Input
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="Enter your name"
                      className="max-w-xs"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveName()
                        if (e.key === 'Escape') handleCancelEdit()
                      }}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSaveName}
                        disabled={!tempName.trim() || tempName.trim().length < 2}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{userName}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {habits.length} {habits.length === 1 ? 'habit' : 'habits'} tracked
                    </p>
                  </div>
                )}
              </div>
              {!isEditingName && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleEditName}
                  className="flex-shrink-0"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="space-y-3">
        {habits.map((habit, index) => {
          const IconComponent = iconMap[habit.icon] || iconMap.circle
          const isCompletedToday = habit.completedDates?.some(dateStr => 
            isSameDay(new Date(dateStr), new Date())
          )

          return (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => handleHabitClick(habit.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1">{habit.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          <span>{habit.currentStreak || 0} days</span>
                        </div>
                        <span>•</span>
                        <span>{habit.completionRate || 0}% complete</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => handleToggleComplete(e, habit.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                          isCompletedToday
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted border-2 border-dashed border-muted-foreground/30'
                        }`}
                        aria-label={isCompletedToday ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {isCompletedToday ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <IconComponent className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, habit.id)}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors flex-shrink-0"
                        aria-label="Delete habit"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {habits.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center py-12 text-muted-foreground"
        >
          <p>No habits yet. Create your first habit!</p>
          <Button
            className="mt-4 h-10"
            onClick={() => navigate('/new-habit')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Habit
          </Button>
        </motion.div>
      )}
      </div>
    </div>
  )
}

export default HabitTracker

