import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, MoreVertical, Check, Edit, Bell, Flame, BookOpen, Brain, Dumbbell, Droplet, Circle, Trash2,
  Coffee, Apple, Moon, Music, Heart, Sun, Target, Zap, Smile, Star, Trophy, Leaf, Pill, Utensils, Gamepad2, Laptop, PenTool,
  Activity, Bike, Footprints, Stethoscope, HeartPulse, Carrot, Fish, Cookie, IceCream, Pizza, Sandwich, Soup, Wine, Milk,
  CheckCircle2, Calendar as CalendarIcon, Clock, GraduationCap, Lightbulb, Notebook, BookMarked, FileText, Clipboard, Briefcase, TrendingUp, BarChart3,
  Flower, Cloud, Rainbow, Wind, Paintbrush, Camera, Film, Headphones, Radio, Palette,
  Users, UserPlus, MessageCircle, Phone, Mail, Gift, PartyPopper, Award, Medal, Crown, Compass, Map, Navigation, Rocket, Plane,
  DollarSign, CreditCard, Wallet, PiggyBank, TrendingDown, Receipt, Home, ShoppingCart, Wrench, Hammer, Brush, ShoppingBag,
  Recycle, Mountain, Bug, Bird,
  Smartphone, Tablet, Monitor, Tv, Wifi, Battery, Cpu, Lock, Key, Shield, Eye, Ear, Hand, Fingerprint, Scan,
  Gem, Diamond, Coins, Banknote, Square, Triangle, Hexagon, Octagon, Pentagon, Timer, Clock as ClockIcon,
  Send, Video, Mic, Volume2, Scissors, Settings, Cog,
  Car, Bus, Train, Ship, Snowflake, Infinity, Crosshair, Focus, Layers, Grid, List, Layout, Columns
} from 'lucide-react'
import { Calendar } from './ui/calendar'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { getHabit, toggleHabitCompletion, deleteHabit } from '../db'
import { format, isSameDay } from 'date-fns'

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

const HabitDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [habit, setHabit] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isCompletedToday, setIsCompletedToday] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    fetchHabit()
  }, [id])

  useEffect(() => {
    if (habit) {
      const todayCompleted = habit.completedDates?.some(dateStr =>
        isSameDay(new Date(dateStr), new Date())
      )
      setIsCompletedToday(todayCompleted)
    }
  }, [habit])

  const fetchHabit = async () => {
    const habitData = await getHabit(parseInt(id))
    setHabit(habitData)
  }

  const handleToggleComplete = async () => {
    await toggleHabitCompletion(habit.id, new Date())
    await fetchHabit()
  }

  const handleDateSelect = async (date) => {
    setSelectedDate(date)
    await toggleHabitCompletion(habit.id, date)
    await fetchHabit()
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${habit.name}"? This action cannot be undone.`)) {
      await deleteHabit(habit.id)
      navigate('/')
    }
  }

  const handleSetReminder = () => {
    // Navigate to edit page with reminder section focused
    navigate(`/habit/${id}/edit`)
  }

  if (!habit) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  const IconComponent = iconMap[habit.icon] || iconMap.circle

  return (
    <div className="min-h-screen bg-background p-4 pb-20" onClick={() => showMenu && setShowMenu(false)}>
      <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">{habit.name}</h1>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-10 overflow-hidden"
              >
                <button
                  onClick={() => {
                    setShowMenu(false)
                    navigate(`/habit/${id}/edit`)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Habit</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false)
                    handleDelete()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-destructive/20 text-destructive transition-colors text-left"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Habit</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.1 }}
        className="flex flex-col items-center mb-8"
      >
        <button
          onClick={handleToggleComplete}
          className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all ${
            isCompletedToday
              ? 'bg-primary shadow-lg shadow-primary/50'
              : 'bg-muted border-2 border-dashed border-muted-foreground/30'
          }`}
          aria-label={isCompletedToday ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {isCompletedToday ? (
            <Check className="h-10 w-10 md:h-12 md:w-12 text-primary-foreground" />
          ) : (
            <IconComponent className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground" />
          )}
        </button>
        <div className="flex items-center gap-2 mt-4">
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="text-xl font-semibold">{habit.currentStreak || 0} days</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {isCompletedToday ? 'Completed for today' : 'Tap to complete'}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          completedDates={habit.completedDates || []}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-3 mt-6"
      >
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
            <p className="text-2xl font-bold">{habit.currentStreak || 0} Days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Best Streak</p>
            <p className="text-2xl font-bold">{habit.bestStreak || 0} Days</p>
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
            <p className="text-2xl font-bold">{habit.completionRate || 0}%</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3 mt-6"
      >
        <Button
          variant="outline"
          className="w-full justify-between h-10"
          onClick={() => navigate(`/habit/${id}/edit`)}
        >
          <div className="flex items-center gap-3">
            <Edit className="h-5 w-5 text-primary" />
            <span>Edit Habit</span>
          </div>
          <ArrowLeft className="h-4 w-4 rotate-180" />
        </Button>
        <Button
          variant="outline"
          className="w-full justify-between h-10"
          onClick={handleSetReminder}
        >
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary" />
            <span>Set Reminder</span>
          </div>
          <ArrowLeft className="h-4 w-4 rotate-180" />
        </Button>
      </motion.div>
      </div>
    </div>
  )
}

export default HabitDetail

