import { useState, useEffect } from 'react'
import { Button } from './components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from './components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, VisuallyHidden } from './components/ui/dialog'
import MembershipDashboard from './components/MembershipDashboard'
import MembershipPlans from './components/MembershipPlans'
import PaymentGateway from './components/PaymentGateway'
import PaymentSuccess from './components/PaymentSuccess'
import LoginModal from './components/LoginModal'
import UserProfile from './components/UserProfile'
import ChatRoomList from './components/ChatRoomList'
import RealTimeChat from './components/RealTimeChat'
import CreatePrivateRoomModal from './components/CreatePrivateRoomModal'
import AIMatchingSystem from './components/AIMatchingSystem'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider, useToast } from './components/ui/toast'
import { 
  Heart, 
  Search, 
  MessageCircle, 
  User, 
  Settings, 
  LogIn, 
  ChevronRight, 
  Filter, 
  MapPin, 
  Calendar, 
  Coffee, 
  Utensils, 
  Music, 
  Film, 
  BookOpen, 
  Mountain,
  Star,
  Sparkles,
  Zap,
  Camera,
  Shield,
  Gift,
  TrendingUp,
  MessageSquare,
  Video,
  Gift as GiftIcon,
  Clock,
  CheckCircle,
  X,
  ArrowLeft,
  Users,
  Crown,
  RefreshCw,
  Briefcase,
  Ruler,
  Languages,
  GraduationCap,
  Building,
  PawPrint,
  Dumbbell,
  Wine
} from 'lucide-react'

// Expanded interfaces to include all used properties
interface PublicUser {
  _id?: string;
  id?: string | number;
  nickname?: string;
  firstName?: string;
  lastName?: string;
  age?: number | string;
  isVerified?: boolean;
  isOnline?: boolean;
  profileImage?: string;
  profileImages?: string[];
  username?: string;
  location?: string;
  bio?: string;
  interests?: any[];
  membership?: { tier?: string };
}

interface FeaturedProfile extends PublicUser {
  name?: string;
  distance?: string;
  images?: string[];
  voteCount?: number;
  online?: boolean;
  verified?: boolean;
  lastActive?: string;
  job?: string;
  height?: string;
  languages?: string[];
  education?: string;
  personality?: string;
  lookingFor?: string;
  lifestyle?: string;
}

// Sample profile data
const profiles: FeaturedProfile[] = [
  {
    id: 1,
    name: 'Sophie',
    age: 28,
    location: 'Bangkok',
    distance: '3 km',
    bio: 'Coffee enthusiast, book lover, and adventure seeker. Looking for someone who enjoys meaningful conversations and creating lasting memories together.',
    interests: ['Reading', 'Coffee', 'Travel', 'Hiking', 'Photography'],
    images: [
      'https://placehold.co/500x600/6366f1/ffffff?text=Sophie',
      'https://placehold.co/500x600/8b5cf6/ffffff?text=Sophie+Travel',
      'https://placehold.co/500x600/06b6d4/ffffff?text=Sophie+Coffee',
      'https://placehold.co/500x600/10b981/ffffff?text=Sophie+Books'
    ],
    verified: true,
    online: true,
    lastActive: 'Online now',
    height: "5'6\"",
    education: 'Master\'s Degree',
    job: 'Graphic Designer',
    lifestyle: 'Non-smoker, occasional drinker',
    lookingFor: 'Long-term relationship',
    languages: ['English', 'Thai'],
    personality: 'Introverted but social when comfortable',
    membership: { tier: 'vip' }
  },
  {
    id: 2,
    name: 'Alex',
    age: 31,
    location: 'Bangkok',
    distance: '5 km',
    bio: 'Photographer and foodie. Let\'s explore new restaurants and capture beautiful moments together. Passionate about art, music, and creating authentic experiences.',
    interests: ['Photography', 'Food', 'Art', 'Music', 'Concerts'],
    images: [
      'https://placehold.co/500x600/8b5cf6/ffffff?text=Alex',
      'https://placehold.co/500x600/6366f1/ffffff?text=Alex+Photos',
      'https://placehold.co/500x600/06b6d4/ffffff?text=Alex+Food',
      'https://placehold.co/500x600/10b981/ffffff?text=Alex+Concert'
    ],
    verified: true,
    online: false,
    lastActive: '2 hours ago',
    height: "5'11\"",
    education: 'Bachelor\'s Degree',
    job: 'Professional Photographer',
    lifestyle: 'Non-smoker, enjoys wine',
    lookingFor: 'Serious relationship',
    languages: ['English', 'Spanish'],
    personality: 'Extroverted and adventurous',
    membership: { tier: 'gold' }
  },
  {
    id: 3,
    name: 'Emma',
    age: 26,
    location: 'Bangkok',
    distance: '7 km',
    bio: 'Yoga instructor and plant mom. Seeking someone with positive energy and an open mind. Let\'s grow together, both literally and figuratively.',
    interests: ['Yoga', 'Plants', 'Meditation', 'Cooking', 'Nature'],
    images: [
      'https://placehold.co/500x600/06b6d4/ffffff?text=Emma',
      'https://placehold.co/500x600/8b5cf6/ffffff?text=Emma+Yoga',
      'https://placehold.co/500x600/6366f1/ffffff?text=Emma+Plants',
      'https://placehold.co/500x600/10b981/ffffff?text=Emma+Cooking'
    ],
    verified: true,
    online: true,
    lastActive: 'Online now',
    height: "5'4\"",
    education: 'Certified Yoga Instructor',
    job: 'Wellness Coach',
    lifestyle: 'Vegetarian, non-smoker',
    lookingFor: 'Meaningful connection',
    languages: ['English', 'Mandarin'],
    personality: 'Calm and empathetic',
    membership: { tier: 'silver' }
  },
  {
    id: 4,
    name: 'Daniel',
    age: 30,
    location: 'Bangkok',
    distance: '4 km',
    bio: 'Software engineer by day, musician by night. Looking for someone to share both quiet evenings and concert adventures. Let\'s create our own soundtrack.',
    interests: ['Music', 'Technology', 'Concerts', 'Gaming', 'Coding'],
    images: [
      'https://placehold.co/500x600/10b981/ffffff?text=Daniel',
      'https://placehold.co/500x600/6366f1/ffffff?text=Daniel+Music',
      'https://placehold.co/500x600/8b5cf6/ffffff?text=Daniel+Tech',
      'https://placehold.co/500x600/06b6d4/ffffff?text=Daniel+Gaming'
    ],
    verified: true,
    online: false,
    lastActive: '5 hours ago',
    height: "6'0\"",
    education: 'Computer Science Degree',
    job: 'Senior Developer',
    lifestyle: 'Occasional drinker, non-smoker',
    lookingFor: 'Relationship with growth potential',
    languages: ['English', 'Japanese'],
    personality: 'Thoughtful and analytical',
    membership: { tier: 'vip1' }
  },
  {
    id: 5,
    name: 'Lily',
    age: 27,
    location: 'Bangkok',
    distance: '6 km',
    bio: 'Art lover and coffee connoisseur. Let\'s create beautiful memories together. I believe every day is an opportunity for inspiration and connection.',
    interests: ['Art', 'Coffee', 'Music', 'Travel', 'Painting'],
    images: [
      'https://placehold.co/500x600/f59e0b/ffffff?text=Lily',
      'https://placehold.co/500x600/6366f1/ffffff?text=Lily+Art',
      'https://placehold.co/500x600/8b5cf6/ffffff?text=Lily+Coffee',
      'https://placehold.co/500x600/06b6d4/ffffff?text=Lily+Travel'
    ],
    verified: true,
    online: true,
    lastActive: 'Online now',
    height: "5'5\"",
    education: 'Fine Arts Degree',
    job: 'Gallery Curator',
    lifestyle: 'Non-smoker, enjoys craft coffee',
    lookingFor: 'Creative partnership',
    languages: ['English', 'French'],
    personality: 'Expressive and intuitive',
    membership: { tier: 'diamond' }
  },
  {
    id: 6,
    name: 'James',
    age: 32,
    location: 'Bangkok',
    distance: '8 km',
    bio: 'Adventure seeker and food explorer. Looking for someone to share life\'s journeys with. Let\'s make every meal an adventure and every weekend a discovery.',
    interests: ['Adventure', 'Food', 'Travel', 'Photography', 'Scuba Diving'],
    images: [
      'https://placehold.co/500x600/ef4444/ffffff?text=James',
      'https://placehold.co/500x600/6366f1/ffffff?text=James+Adventure',
      'https://placehold.co/500x600/8b5cf6/ffffff?text=James+Food',
      'https://placehold.co/500x600/06b6d4/ffffff?text=James+Diving'
    ],
    verified: true,
    online: false,
    lastActive: '1 day ago',
    height: "6'2\"",
    education: 'Tourism Management',
    job: 'Travel Blogger',
    lifestyle: 'Non-smoker, occasional drinker',
    lookingFor: 'Adventure partner for life',
    languages: ['English', 'German'],
    personality: 'Bold and spontaneous',
    membership: { tier: 'platinum' }
  }
]

// Sample messages
const messages = [
  {
    id: 1,
    name: 'Sophie',
    avatar: 'https://placehold.co/200x200/6366f1/ffffff?text=S',
    lastMessage: 'Would you like to meet for coffee this weekend?',
    time: '15m',
    unread: true,
    online: true
  },
  {
    id: 2,
    name: 'Alex',
    avatar: 'https://placehold.co/200x200/8b5cf6/ffffff?text=A',
    lastMessage: 'That restaurant sounds amazing! I\'d love to try it.',
    time: '2h',
    unread: false,
    online: false
  },
  {
    id: 3,
    name: 'Emma',
    avatar: 'https://placehold.co/200x200/06b6d4/ffffff?text=E',
    lastMessage: 'Thanks for the yoga class recommendation!',
    time: '1d',
    unread: false,
    online: true
  },
  {
    id: 4,
    name: 'Daniel',
    avatar: 'https://placehold.co/200x200/10b981/ffffff?text=D',
    lastMessage: 'Let\'s plan our next adventure!',
    time: '3h',
    unread: false,
    online: false
  }
]

// Error handling type guard
function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' && 
    error !== null && 
    'message' in error && 
    typeof (error as { message: unknown }).message === 'string'
  )
}

// Image error handling type guard
function isImageElement(target: EventTarget | null): target is HTMLImageElement {
  return target instanceof HTMLImageElement;
}

// In image error handling functions
const handleProfileImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target;
  if (isImageElement(target)) {
    target.src = 'https://placehold.co/500x600/6366f1/ffffff?text=No+Image';
  }
}

function App() {
  const { user, login, logout, loading } = useAuth()
  const { ToastContainer } = useToast()
  const [activeTab, setActiveTab] = useState<'discover' | 'matches' | 'messages' | 'membership' | 'profile'>('discover')
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<FeaturedProfile | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [premiumUsers, setPremiumUsers] = useState<PublicUser[]>([])
  const [isLoadingPremium, setIsLoadingPremium] = useState(false)
  const premiumTierOrder = ['platinum', 'diamond', 'vip2', 'vip1', 'vip', 'gold', 'silver']
  
  // Payment flow states
  const [currentView, setCurrentView] = useState<'main' | 'payment' | 'success'>('main') // 'main', 'payment', 'success'
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [transactionData, setTransactionData] = useState<any>(null)
  
  // Chat states
  const [chatView, setChatView] = useState<'list' | 'chat'>('list') // 'list', 'chat'
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false)
  
  // Top voted profiles - ใช้ profiles ที่มี voteCount สูงสุด
  const [topVotedProfiles] = useState(() => {
    return profiles
      .map(profile => ({
        ...profile,
        voteCount: Math.floor(Math.random() * 1000) + 100 // สุ่ม vote count สำหรับ demo
      }))
      .sort((a, b) => b.voteCount - a.voteCount)
      .slice(0, 5) // เก็บ top 5
  })
  
  // Check authentication on mount
  useEffect(() => {
    if (user) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  }, [user])

  // Load Premium Members for Discover tab (from backend only)
  useEffect(() => {
    let isCancelled = false
    const loadPremium = async () => {
      try {
        setIsLoadingPremium(true)
        const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
        const token = sessionStorage.getItem('token');
        console.log('🔑 Frontend - Sending token:', token ? 'Present' : 'Not present');
        console.log('👤 Frontend - Current user:', user);
        
        const res = await fetch(`${base}/api/profile/premium?limit=50`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        })
        if (!res.ok) return
        const data = await res.json()
        const users: PublicUser[] = data?.data?.users || []
        // Ensure final ordering and cap
        const sorted = users
          .sort((a: PublicUser, b: PublicUser) => {
            const ai = premiumTierOrder.indexOf((a?.membership?.tier || '') as string)
            const bi = premiumTierOrder.indexOf((b?.membership?.tier || '') as string)
            return ai - bi
          })
          .slice(0, 50)
        if (!isCancelled) setPremiumUsers(sorted)
      } catch (_) {
        // ignore errors for this section
      } finally {
        if (!isCancelled) setIsLoadingPremium(false)
      }
    }
    loadPremium()
    return () => { isCancelled = true }
  }, [])

  // Load all users for Discover Amazing People section
  const [allUsers, setAllUsers] = useState<PublicUser[]>([])
  const [isLoadingAllUsers, setIsLoadingAllUsers] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMoreUsers, setHasMoreUsers] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [visibleCount, setVisibleCount] = useState(8)
  const [filters, setFilters] = useState({
    gender: '',
    ageMin: 18,
    ageMax: 100,
    province: '',
    lookingFor: '',
    relationship: '',
    otherRelationship: '',
    distanceKm: '',
    lat: '',
    lng: ''
  })
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    let isCancelled = false
    const loadAllUsers = async () => {
      try {
        setIsLoadingAllUsers(true)
        const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
        const res = await fetch(`${base}/api/profile/all?limit=20&page=1`, {
          headers: {
            'Content-Type': 'application/json',
            ...(sessionStorage.getItem('token') ? { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } : {})
          }
        })
        if (!res.ok) return
        const data = await res.json()
        const users: PublicUser[] = data?.data?.users || []
        const pagination = data?.data?.pagination || {}
        
        if (!isCancelled) {
          setAllUsers(users)
          setHasMoreUsers(pagination.page < pagination.pages)
          setCurrentPage(1)
          const allowed = ['member','silver','gold','vip','vip1','vip2']
          const allowedLen = users.filter(u => allowed.includes((u?.membership?.tier || 'member') as string)).length
          setVisibleCount(Math.min(8, allowedLen))
        }
      } catch (_) {
        // ignore errors for this section
      } finally {
        if (!isCancelled) setIsLoadingAllUsers(false)
      }
    }
    loadAllUsers()
    return () => { isCancelled = true }
  }, [])

  // Load more users function
  const loadMoreUsers = async () => {
    if (isLoadingMore || !hasMoreUsers) return
    
    try {
      setIsLoadingMore(true)
      const nextPage = currentPage + 1
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
      const res = await fetch(`${base}/api/profile/all?limit=20&page=${nextPage}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(sessionStorage.getItem('token') ? { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } : {})
        }
      })
      if (!res.ok) return
      const data = await res.json()
      const newUsers: PublicUser[] = data?.data?.users || []
      const pagination = data?.data?.pagination || {}
      
      setAllUsers(prev => [...prev, ...newUsers])
      setHasMoreUsers(pagination.page < pagination.pages)
      setCurrentPage(nextPage)
    } catch (_) {
      // ignore errors for this section
    } finally {
      setIsLoadingMore(false)
    }
  }
  
  // Load user profile image for header avatar
  useEffect(() => {
    const loadAvatar = async () => {
      try {
        if (user?._id) {
          const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
          const res = await fetch(`${base}/api/profile/${user._id}`, {
            headers: {
              'Content-Type': 'application/json',
              ...(sessionStorage.getItem('token') ? { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } : {})
            }
          })
          if (res.ok) {
            const data = await res.json()
            const img = (data?.data?.profile?.profileImages?.[0] as string | undefined) || ''
            const assetsBase = base.replace(/\/api$/, '')
            setAvatarUrl(img ? `${assetsBase}/uploads/profiles/${img}` : null)
            if (img) return
          }
        }
      } catch (_) {
        // ignore
      }
      setAvatarUrl(null)
    }
    if (isAuthenticated) {
      loadAvatar()
    } else {
      setAvatarUrl(null)
    }
  }, [isAuthenticated, user])
  
  // ฟัง event เมื่อมีการตั้งรูปโปรไฟล์ใหม่ เพื่อรีโหลด avatar ใน header
  useEffect(() => {
    const handler = () => {
      // Trigger a reload of avatar
      if (user?._id) {
        // reuse loader without duplicating code by toggling state
        (async () => {
          try {
            const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
            const res = await fetch(`${base}/api/profile/${user._id}`, {
              headers: {
                'Content-Type': 'application/json',
                ...(sessionStorage.getItem('token') ? { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } : {})
              }
            })
            if (res.ok) {
              const data = await res.json()
              const img = data?.data?.profile?.profileImages?.[0]
              if (img) {
                const assetsBase = base.replace(/\/api$/, '')
                setAvatarUrl(`${assetsBase}/uploads/profiles/${img}`)
                return
              }
            }
          } catch (_) {}
          setAvatarUrl(null)
        })()
      }
    }
    window.addEventListener('profile-avatar-updated', handler)
    return () => window.removeEventListener('profile-avatar-updated', handler)
  }, [user])
  
  const handleLoginSuccess = (data: any) => {
    // data includes { user, token }; pass through so token is preserved
    login(data)
    setIsAuthenticated(true)
    setShowLoginDialog(false)
  }
  
  const handleLogout = () => {
    logout()
    setIsAuthenticated(false)
  }
  
  const openProfileModal = (profile: FeaturedProfile) => {
    setSelectedProfile(profile)
    setActiveImageIndex(0)
    setShowProfileModal(true)
  }
  
  // Payment flow handlers
  const handleNavigateToPayment = (plan: any) => {
    setSelectedPlan(plan)
    setCurrentView('payment')
  }
  
  const handlePaymentSuccess = async (transactionData: any) => {
    setTransactionData(transactionData)
    setCurrentView('success')
    // Call actual upgrade API
    try {
      const { membershipAPI } = await import('./services/membershipAPI')
      await membershipAPI.upgradeMembership({
        userId: user._id,
        tier: transactionData.tier,
        paymentMethod: transactionData.paymentMethod,
        transactionId: transactionData.transactionId,
        amount: transactionData.amount,
        currency: transactionData.currency
      })
    } catch (error) {
      console.error('Error upgrading membership:', error)
    }
  }
  
  const handleBackToMain = () => {
    setCurrentView('main')
    setSelectedPlan(null)
    setTransactionData(null)
    setActiveTab('membership') // กลับไปที่ membership tab
  }
  
  // Set up global payment navigation
  useEffect(() => {
    ;(window as any).navigateToPayment = handleNavigateToPayment
    const handlePaymentEvent = (event: any) => {
      handleNavigateToPayment(event.detail.plan)
    }
    window.addEventListener('navigateToPayment', handlePaymentEvent)
    return () => {
      window.removeEventListener('navigateToPayment', handlePaymentEvent)
      delete (window as any).navigateToPayment
    }
  }, [])
  
  // Chat handlers
  const handleSelectRoom = (roomId: string) => {
    setSelectedRoomId(roomId)
    setChatView('chat')
  }
  
  const handleBackToRoomList = () => {
    setChatView('list')
    setSelectedRoomId(null)
  }
  
  const handleCreatePrivateRoom = (newRoom: any) => {
    // รีเฟรชรายการห้องแชทหลังจากสร้างห้องใหม่
    setChatView('list')
    setSelectedRoomId(null)
    // อาจจะต้องรีเฟรชข้อมูลห้องแชทที่นี่
  }
  
  // Render different views based on current state
  if (currentView === 'payment' && selectedPlan) {
    return (
      <PaymentGateway
        plan={selectedPlan}
        onBack={handleBackToMain}
        onSuccess={handlePaymentSuccess}
        onCancel={handleBackToMain}
      />
    )
  }
  
  if (currentView === 'success' && transactionData && selectedPlan) {
    return (
      <PaymentSuccess
        transactionData={transactionData}
        plan={selectedPlan}
        onContinue={handleBackToMain}
      />
    )
  }
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Modern Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-pink-300/20 to-violet-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-80 h-80 bg-gradient-to-br from-blue-300/15 to-cyan-300/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-72 h-72 bg-gradient-to-br from-orange-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-60 right-1/3 w-64 h-64 bg-gradient-to-br from-purple-300/25 to-indigo-300/25 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>
      {/* Modern Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 text-4xl opacity-20 animate-float">✨</div>
        <div className="absolute top-1/3 right-1/4 text-5xl opacity-15 animate-float delay-1000">💫</div>
        <div className="absolute bottom-1/3 left-1/3 text-6xl opacity-10 animate-float delay-2000">🌟</div>
        <div className="absolute bottom-1/4 right-1/3 text-3xl opacity-25 animate-float delay-3000">💖</div>
        <div className="absolute top-1/2 left-1/6 text-4xl opacity-20 animate-float delay-4000">🎉</div>
        <div className="absolute top-3/4 right-1/6 text-5xl opacity-15 animate-float delay-5000">🌈</div>
      </div>
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 border-b border-white/30 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-rose-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg heart-beat">
                <Heart className="h-6 w-6 text-white" fill="white" />
              </div>
              <div>
                <span className="text-2xl font-bold gradient-text">sodeclick</span>
                <div className="text-xs text-gray-600 -mt-1">Find Your Love ✨</div>
              </div>
            </div>
            <div className="hidden md:flex space-x-1">
              {!isAuthenticated ? (
                <>
                  <Button
                    onClick={() => setShowLoginDialog(true)}
                    className="modern-button"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    เข้าสู่ระบบ
                  </Button>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={avatarUrl || undefined} alt="profile" />
                      <AvatarFallback>{user?.firstName?.[0] || user?.username?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700">สวัสดี, {user?.displayName || user?.firstName}</span>
                  </div>
                  {(user?.role === 'admin' || user?.role === 'superadmin') && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.location.href = '/admin'}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Admin
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout} 
                    className="border-pink-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300 transition-colors"
                  >
                    ออกจากระบบ
                  </Button>
                </div>
              )}
            </div>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => !isAuthenticated ? setShowLoginDialog(true) : handleLogout()}>
              <LogIn className="h-5 w-5 text-slate-600" />
            </Button>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-6 py-3 rounded-full glass-effect border border-white/30 text-pink-600 text-sm font-semibold shadow-lg">
                <Sparkles className="h-4 w-4 mr-2" />
                <span>Thailand's #1 Dating Platform 🇹🇭</span>
              </div>
              <div>
                <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8 gradient-text">
                  Find Your<br />
                  Perfect Match ✨
                </h1>
                <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
                  Join thousands of verified singles creating meaningful connections. Your love story starts here.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6">
                <Button 
                  size="lg" 
                  onClick={() => setShowLoginDialog(true)}
                  className="modern-button text-lg px-10 py-6 rounded-2xl font-bold shadow-2xl hover:shadow-pink-300/50 hover:scale-105 transform transition-all duration-300"
                >
                  <Heart className="h-6 w-6 mr-3" fill="white" />
                  Start Dating Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-pink-300/50 text-pink-600 hover:bg-pink-50/80 px-10 py-6 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 glass-effect"
                >
                  <MessageCircle className="h-6 w-6 mr-3" />
                  Learn More
                </Button>
              </div>
            </div>
            {/* 
              สลับรูป user ที่ถูกโหวตเยอะที่สุดแบบเรียลไทม์ 
              - แสดง 2 อันดับแรก (top 2 voted)
              - ถ้ามีการเปลี่ยนแปลงอันดับ เรียลไทม์จะอัปเดตทันที
            */}
            <div className="relative hidden md:flex justify-end items-center">
              <div className="relative w-[340px] h-[340px]">
                {topVotedProfiles.slice(0, 2).map((profile, idx) => (
                  <div
                    key={profile.id}
                    className={
                      "absolute " +
                      (idx === 0
                        ? "top-0 right-0 z-20 rotate-3"
                        : "bottom-0 left-8 z-10 -rotate-3 border-4 border-white") +
                      " w-64 h-80 rounded-3xl overflow-hidden shadow-2xl transition-all duration-700"
                    }
                    style={{
                      // เพิ่ม transition effect เวลาสลับ
                      transition: "all 0.7s cubic-bezier(.4,2,.6,1)",
                    }}
                  >
                    <img
                      src={profile.images?.[0] || "https://placehold.co/500x600?text=Profile"}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Badge โหวต */}
                    <div className="absolute bottom-3 right-3 bg-white/80 px-3 py-1 rounded-full text-xs font-medium text-pink-600 shadow">
                      ❤️ {profile.voteCount ?? 0} votes
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* App Interface */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
        <div className="modern-card rounded-3xl shadow-2xl overflow-hidden">
          <Tabs defaultValue="discover" value={activeTab} onValueChange={setActiveTab}>
            <div className="glass-effect border-b border-white/30">
              <TabsList className="w-full justify-between bg-transparent h-20 p-0">
                <TabsTrigger 
                  value="discover" 
                  className="flex-1 h-full data-[state=active]:bg-white/90 data-[state=active]:shadow-lg data-[state=active]:border-b-4 data-[state=active]:border-pink-500 rounded-none text-gray-600 data-[state=active]:text-pink-600 transition-all duration-300 font-semibold hover:bg-white/50"
                >
                  <Search className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">Discover</span> ✨
                </TabsTrigger>
                <TabsTrigger 
                  value="matches" 
                  className="flex-1 h-full data-[state=active]:bg-white/90 data-[state=active]:shadow-lg data-[state=active]:border-b-4 data-[state=active]:border-pink-500 rounded-none text-gray-600 data-[state=active]:text-pink-600 transition-all duration-300 font-semibold hover:bg-white/50"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">Matches</span> 💕
                </TabsTrigger>
                <TabsTrigger 
                  value="messages" 
                  className="flex-1 h-full data-[state=active]:bg-white/90 data-[state=active]:shadow-lg data-[state=active]:border-b-4 data-[state=active]:border-pink-500 rounded-none text-gray-600 data-[state=active]:text-pink-600 transition-all duration-300 font-semibold hover:bg-white/50"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">Messages</span> 💬
                </TabsTrigger>
                <TabsTrigger 
                  value="membership" 
                  className="flex-1 h-full data-[state=active]:bg-white/90 data-[state=active]:shadow-lg data-[state=active]:border-b-4 data-[state=active]:border-pink-500 rounded-none text-gray-600 data-[state=active]:text-pink-600 transition-all duration-300 font-semibold hover:bg-white/50"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">Premium</span> ⭐
                </TabsTrigger>
                <TabsTrigger 
                  value="profile" 
                  className="flex-1 h-full data-[state=active]:bg-white/90 data-[state=active]:shadow-lg data-[state=active]:border-b-4 data-[state=active]:border-pink-500 rounded-none text-gray-600 data-[state=active]:text-pink-600 transition-all duration-300 font-semibold hover:bg-white/50"
                >
                  <User className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">Profile</span> 👤
                </TabsTrigger>
              </TabsList>
            </div>
            {/* Discover Tab */}
            <TabsContent value="discover" className="p-8">
              {/* Advanced Filters Section */}
              <div className="mb-8 modern-card rounded-3xl shadow-2xl border border-white/30 overflow-hidden backdrop-blur-lg">
                {/* Filter Header */}
                <div className="bg-gradient-to-br from-pink-50/90 via-violet-50/90 to-blue-50/90 backdrop-blur-xl p-8 border-b border-white/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-pink-500 via-rose-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-6 transition-all duration-300">
                          <Filter className="h-7 w-7 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-violet-600 bg-clip-text text-transparent">
                          ตัวกรองขั้นสูง ✨
                        </h3>
                        <p className="text-base text-gray-600 mt-1 font-medium">ค้นหาคู่แท้ของคุณด้วยฟิลเตอร์ที่ตรงใจ 💕</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => setFiltersOpen(v => !v)}
                      className="flex items-center gap-3 hover:bg-white/60 transition-all duration-300 rounded-2xl px-8 py-4 text-gray-700 font-semibold border-2 border-transparent hover:border-pink-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <span className="text-lg">{filtersOpen ? '🔼 ซ่อนตัวกรอง' : '🔽 เปิดตัวกรอง'}</span>
                      <ChevronRight className={`h-6 w-6 transition-all duration-500 ${filtersOpen ? 'rotate-90 text-pink-600' : 'text-gray-500'}`} />
                    </Button>
                  </div>
                </div>
                {filtersOpen && (
                  <div className="p-8 bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-sm border-t border-white/50">
                    <div className="space-y-10">
                      {/* Basic Filters */}
                      <div className="relative">
                        <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-pink-500 to-violet-500 rounded-full"></div>
                        <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3 pl-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          ข้อมูลพื้นฐาน
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pl-4">
                          <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                              <span className="text-pink-500 text-lg">👥</span>
                              เพศ
                            </label>
                            <select
                              value={filters.gender}
                              onChange={e => setFilters(f => ({...f, gender: e.target.value}))}
                              className="w-full p-4 border-2 border-gray-200 rounded-2xl bg-white/90 backdrop-blur-sm focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl text-gray-700 font-medium"
                            >
                              <option value="">✨ ทั้งหมด</option>
                              <option value="male">👨 ชาย</option>
                              <option value="female">👩 หญิง</option>
                              <option value="other">🌈 อื่นๆ</option>
                            </select>
                          </div>
                          <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                              <span className="text-violet-500 text-lg">🔍</span>
                              กำลังมองหา
                            </label>
                            <select
                              value={filters.lookingFor}
                              onChange={e => setFilters(f => ({...f, lookingFor: e.target.value}))}
                              className="w-full p-4 border-2 border-gray-200 rounded-2xl bg-white/90 backdrop-blur-sm focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 shadow-lg hover:shadow-xl text-gray-700 font-medium"
                            >
                              <option value="">✨ ทั้งหมด</option>
                              <option value="male">👨 ชาย</option>
                              <option value="female">👩 หญิง</option>
                              <option value="both">💕 ทั้งคู่</option>
                            </select>
                          </div>
                          <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                              <span className="text-green-500 text-lg">📍</span>
                              จังหวัด
                            </label>
                            <select
                              value={filters.province}
                              onChange={e => setFilters(f => ({...f, province: e.target.value}))}
                              className="w-full p-4 border-2 border-gray-200 rounded-2xl bg-white/90 backdrop-blur-sm focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 shadow-lg hover:shadow-xl text-gray-700 font-medium"
                            >
                              <option value="">🗺️ ทุกจังหวัด</option>
                              {[
                                'กระบี่','กรุงเทพมหานคร','กาญจนบุรี','กาฬสินธุ์','กำแพงเพชร','ขอนแก่น','จันทบุรี','ฉะเชิงเทรา','ชลบุรี','ชัยนาท','ชัยภูมิ','ชุมพร','เชียงราย','เชียงใหม่','ตรัง','ตราด','ตาก','นครนายก','นครปฐม','นครพนม','นครราชสีมา','นครศรีธรรมราช','นครสวรรค์','นนทบุรี','นราธิวาส','น่าน','บึงกาฬ','บุรีรัมย์','ปทุมธานี','ประจวบคีรีขันธ์','ปราจีนบุรี','ปัตตานี','พระนครศรีอยุธยา','พะเยา','พังงา','พัทลุง','พิจิตร','พิษณุโลก','เพชรบุรี','เพชรบูรณ์','แพร่','ภูเก็ต','มหาสารคาม','มุกดาหาร','แม่ฮ่องสอน','ยโสธร','ยะลา','ร้อยเอ็ด','ระนอง','ระยอง','ราชบุรี','ลพบุรี','ลำปาง','ลำพูน','ศรีสะเกษ','สกลนคร','สงขลา','สตูล','สมุทรปราการ','สมุทรสงคราม','สมุทรสาคร','สระแก้ว','สระบุรี','สิงห์บุรี','สุโขทัย','สุพรรณบุรี','สุราษฎร์ธานี','สุรินทร์','หนองคาย','หนองบัวลำภู','อ่างทอง','อำนาจเจริญ','อุดรธานี','อุตรดิตถ์','อุทัยธานี','อุบลราชธานี'
                              ].sort((a,b)=>a.localeCompare(b,'th')).map(p => (
                                <option key={p} value={p}>📍 {p}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Age Range */}
                      <div className="relative">
                        <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                        <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3 pl-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-white" />
                          </div>
                          ช่วงอายุ
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pl-4">
                          <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                              <span className="text-orange-500 text-lg">🎂</span>
                              อายุต่ำสุด
                            </label>
                            <input
                              type="number"
                              min={18}
                              max={100}
                              value={filters.ageMin}
                              onChange={e => setFilters(f => ({...f, ageMin: Number(e.target.value)}))}
                              className="w-full p-4 border-2 border-gray-200 rounded-2xl bg-white/90 backdrop-blur-sm focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 shadow-lg hover:shadow-xl text-gray-700 font-medium"
                              placeholder="18 ปี"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                              <span className="text-red-500 text-lg">🎉</span>
                              อายุมากสุด
                            </label>
                            <input
                              type="number"
                              min={18}
                              max={100}
                              value={filters.ageMax}
                              onChange={e => setFilters(f => ({...f, ageMax: Number(e.target.value)}))}
                              className="w-full p-4 border-2 border-gray-200 rounded-2xl bg-white/90 backdrop-blur-sm focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 shadow-lg hover:shadow-xl text-gray-700 font-medium"
                              placeholder="100 ปี"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Relationship & Distance */}
                      <div className="relative">
                        <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></div>
                        <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3 pl-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                            <Heart className="h-5 w-5 text-white" />
                          </div>
                          ความสัมพันธ์ & ระยะทาง
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pl-4">
                          <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                              <span className="text-pink-500 text-lg">💕</span>
                              ความสัมพันธ์ที่ต้องการ
                            </label>
                            <select
                              value={filters.relationship}
                              onChange={e => setFilters(f => ({...f, relationship: e.target.value}))}
                              className="w-full p-4 border-2 border-gray-200 rounded-2xl bg-white/90 backdrop-blur-sm focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl text-gray-700 font-medium"
                            >
                              <option value="">💫 เลือกประเภทความสัมพันธ์</option>
                              <option value="fwd">🎯 FWD</option>
                              <option value="overnight">🌙 ค้างคืน</option>
                              <option value="temporary">⏰ ชั่วคราว</option>
                              <option value="other">✨ อื่นๆ</option>
                            </select>
                          </div>
                          {filters.relationship === 'other' && (
                            <div className="space-y-3">
                              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <span className="text-purple-500 text-lg">💭</span>
                                ระบุความสัมพันธ์ที่ต้องการ
                              </label>
                              <input
                                value={filters.otherRelationship || ''}
                                onChange={e => setFilters(f => ({...f, otherRelationship: e.target.value}))}
                                className="w-full p-4 border-2 border-gray-200 rounded-2xl bg-white/90 backdrop-blur-sm focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl text-gray-700 font-medium"
                                placeholder="💬 ระบุความสัมพันธ์ที่ต้องการ..."
                              />
                            </div>
                          )}
                          <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                              <span className="text-blue-500 text-lg">📏</span>
                              ระยะทาง (กิโลเมตร)
                            </label>
                            <input
                              type="number"
                              value={filters.distanceKm}
                              onChange={e => setFilters(f => ({...f, distanceKm: e.target.value}))}
                              className="w-full p-4 border-2 border-gray-200 rounded-2xl bg-white/90 backdrop-blur-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl text-gray-700 font-medium"
                              placeholder="🎯 เช่น 50 กม."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Location Coordinates */}
                      <div className="relative">
                        <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-teal-500 rounded-full"></div>
                        <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3 pl-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-white" />
                          </div>
                          พิกัดตำแหน่ง
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pl-4">
                          <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                              <span className="text-cyan-500 text-lg">🌐</span>
                              ละติจูด (Latitude)
                            </label>
                            <input
                              value={filters.lat}
                              onChange={e => setFilters(f => ({...f, lat: e.target.value}))}
                              className="w-full p-4 border-2 border-gray-200 rounded-2xl bg-white/90 backdrop-blur-sm focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-300 shadow-lg hover:shadow-xl text-gray-700 font-medium"
                              placeholder="🗺️ เช่น 13.7563"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                              <span className="text-teal-500 text-lg">🗺️</span>
                              ลองจิจูด (Longitude)
                            </label>
                            <input
                              value={filters.lng}
                              onChange={e => setFilters(f => ({...f, lng: e.target.value}))}
                              className="w-full p-4 border-2 border-gray-200 rounded-2xl bg-white/90 backdrop-blur-sm focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 shadow-lg hover:shadow-xl text-gray-700 font-medium"
                              placeholder="📍 เช่น 100.5018"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-6 justify-center pt-8 border-t-2 border-gradient-to-r from-pink-200 to-violet-200">
                        <Button
                          variant="outline"
                          onClick={() => {
                            // Use browser location
                            if (navigator.geolocation) {
                              alert('📍 กำลังขอตำแหน่งปัจจุบัน...')
                              navigator.geolocation.getCurrentPosition(
                                (pos) => {
                                  setFilters(f => ({
                                    ...f, 
                                    lat: String(pos.coords.latitude), 
                                    lng: String(pos.coords.longitude)
                                  }))
                                  alert(`✅ ได้ตำแหน่งแล้ว!\nละติจูด: ${pos.coords.latitude.toFixed(6)}\nลองจิจูด: ${pos.coords.longitude.toFixed(6)}`)
                                },
                                (error) => {
                                  console.error('❌ Geolocation error:', error)
                                  switch(error.code) {
                                    case error.PERMISSION_DENIED:
                                      alert('❌ ถูกปฏิเสธการเข้าถึงตำแหน่ง กรุณาอนุญาตการเข้าถึงตำแหน่งในเบราว์เซอร์')
                                      break
                                    case error.POSITION_UNAVAILABLE:
                                      alert('❌ ไม่สามารถระบุตำแหน่งได้ กรุณาลองใหม่อีกครั้ง')
                                      break
                                    case error.TIMEOUT:
                                      alert('❌ การขอตำแหน่งหมดเวลา กรุณาลองใหม่อีกครั้ง')
                                      break
                                    default:
                                      alert('❌ เกิดข้อผิดพลาดในการขอตำแหน่ง')
                                  }
                                },
                                {
                                  enableHighAccuracy: true,
                                  timeout: 10000,
                                  maximumAge: 60000
                                }
                              )
                            } else {
                              alert('❌ เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง')
                            }
                          }}
                          className="flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl font-bold text-base transform hover:scale-105"
                        >
                          <MapPin className="h-6 w-6" />
                          📍 ใช้ตำแหน่งปัจจุบัน
                        </Button>
                        <Button
                          onClick={async () => {
                            // Show loading state
                            setIsLoadingAllUsers(true)
                            
                            const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
                            const params = new URLSearchParams()
                            
                            // Add filters to params
                            if (filters.gender) params.set('gender', filters.gender)
                            if (filters.lookingFor) params.set('lookingFor', filters.lookingFor)
                            if (filters.province) params.set('province', filters.province)
                            if (filters.ageMin && filters.ageMin > 0) params.set('ageMin', String(filters.ageMin))
                            if (filters.ageMax && filters.ageMax > 0) params.set('ageMax', String(filters.ageMax))
                            
                            // Handle relationship filter
                            if (filters.relationship) {
                              if (filters.relationship === 'other' && filters.otherRelationship) {
                                params.set('relationship', filters.otherRelationship)
                              } else {
                                params.set('relationship', filters.relationship)
                              }
                            }
                            
                            // Handle distance filter
                            if (filters.distanceKm && filters.lat && filters.lng) {
                              params.set('distanceKm', String(filters.distanceKm))
                              params.set('lat', String(filters.lat))
                              params.set('lng', String(filters.lng))
                            }
                            
                            params.set('page', '1')
                            params.set('limit', '50') // เพิ่มจำนวนผลลัพธ์
                            
                            try {
                              console.log('🔍 Searching with filters:', Object.fromEntries(params))
                              
                              const res = await fetch(`${base}/api/profile/search?${params.toString()}`, {
                                headers: { 
                                  'Content-Type': 'application/json', 
                                  ...(sessionStorage.getItem('token') ? { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } : {}) 
                                }
                              })
                              
                              if (!res.ok) {
                                throw new Error(`HTTP error! status: ${res.status}`)
                              }
                              
                              const data = await res.json()
                              console.log('📊 Search results:', data)
                              
                              if (data.success) {
                                const users: PublicUser[] = data?.data?.users || []
                                console.log(`✅ Found ${users.length} users`)
                                
                                setAllUsers(users)
                                setCurrentPage(1)
                                
                                // Filter for allowed tiers
                                const allowed = ['member','silver','gold','vip','vip1','vip2']
                                const allowedUsers = users.filter(u => allowed.includes((u?.membership?.tier || 'member') as string))
                                const allowedLen = allowedUsers.length
                                
                                setVisibleCount(Math.min(8, allowedLen))
                                setHasMoreUsers(allowedLen > 8)
                                
                                // Show success message
                                if (allowedLen > 0) {
                                  alert(`✅ พบผู้ใช้ ${allowedLen} คนที่ตรงกับเงื่อนไขของคุณ!`)
                                } else {
                                  alert('❌ ไม่พบผู้ใช้ที่ตรงกับเงื่อนไข กรุณาลองปรับตัวกรองใหม่')
                                }
                              } else {
                                console.error('❌ Search failed:', data.message)
                                alert(`❌ การค้นหาล้มเหลว: ${data.message}`)
                              }
                            } catch (error) {
                              console.error('❌ Search error:', error)
                              alert(`❌ เกิดข้อผิดพลาดในการค้นหา: ${isErrorWithMessage(error) ? error.message : 'Unknown error'}`)
                            } finally {
                              setIsLoadingAllUsers(false)
                            }
                          }}
                          className={`flex items-center gap-4 px-10 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-violet-600 text-white hover:from-pink-600 hover:via-rose-600 hover:to-violet-700 transition-all duration-300 shadow-2xl hover:shadow-pink-500/50 font-bold text-lg transform hover:scale-110 hover:-translate-y-1 ${isLoadingAllUsers ? 'opacity-75 cursor-not-allowed' : ''}`}
                          disabled={isLoadingAllUsers}
                        >
                          {isLoadingAllUsers ? (
                            <>
                              <RefreshCw className="h-6 w-6 animate-spin" />
                              🔄 กำลังค้นหา...
                            </>
                          ) : (
                            <>
                              <Search className="h-6 w-6" />
                              🔍 ค้นหาด้วยตัวกรอง
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={async () => {
                            // Reset filters
                            setFilters({ 
                              gender: '', 
                              ageMin: 18, 
                              ageMax: 100, 
                              province: '', 
                              lookingFor: '', 
                              relationship: '', 
                              otherRelationship: '', 
                              distanceKm: '', 
                              lat: '', 
                              lng: '' 
                            })
                            
                            // Show loading state
                            setIsLoadingAllUsers(true)
                            
                            const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
                            
                            try {
                              console.log('🔄 Resetting filters and reloading users...')
                              
                              const res = await fetch(`${base}/api/profile/all?limit=50&page=1`, {
                                headers: { 
                                  'Content-Type': 'application/json', 
                                  ...(sessionStorage.getItem('token') ? { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } : {}) 
                                }
                              })
                              
                              if (!res.ok) {
                                throw new Error(`HTTP error! status: ${res.status}`)
                              }
                              
                              const data = await res.json()
                              console.log('📊 Reset results:', data)
                              
                              if (data.success) {
                                const users: PublicUser[] = data?.data?.users || []
                                console.log(`✅ Reset: Found ${users.length} users`)
                                
                                setAllUsers(users)
                                setCurrentPage(1)
                                
                                // Filter for allowed tiers
                                const allowed = ['member','silver','gold','vip','vip1','vip2']
                                const allowedUsers = users.filter(u => allowed.includes((u?.membership?.tier || 'member') as string))
                                const allowedLen = allowedUsers.length
                                
                                setVisibleCount(Math.min(8, allowedLen))
                                setHasMoreUsers(allowedLen > 8)
                                
                                alert(`✅ รีเซ็ตตัวกรองเรียบร้อย! แสดงผู้ใช้ ${allowedLen} คน`)
                              } else {
                                console.error('❌ Reset failed:', data.message)
                                alert(`❌ การรีเซ็ตล้มเหลว: ${data.message}`)
                              }
                            } catch (error) {
                              console.error('❌ Reset error:', error)
                              alert(`❌ เกิดข้อผิดพลาดในการรีเซ็ต: ${isErrorWithMessage(error) ? error.message : 'Unknown error'}`)
                            } finally {
                              setIsLoadingAllUsers(false)
                            }
                          }}
                          className={`flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl font-bold text-base transform hover:scale-105 ${isLoadingAllUsers ? 'opacity-75 cursor-not-allowed' : ''}`}
                          disabled={isLoadingAllUsers}
                        >
                          {isLoadingAllUsers ? (
                            <>
                              <RefreshCw className="h-6 w-6 animate-spin" />
                              🔄 กำลังรีเซ็ต...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-6 w-6" />
                              🗑️ ล้างตัวกรองทั้งหมด
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Premium Member Exclusive */}
              <div className="mb-10">
                <div className="mb-6">
                  <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 via-pink-500 to-violet-600 bg-clip-text text-transparent flex items-center">
                    Premium Member Exclusive
                    <Crown className="h-7 w-7 md:h-8 md:w-8 ml-3 text-amber-500" />
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 mt-2">สมาชิกระดับพรีเมียมคัดสรร • เรียงตามระดับสมาชิก</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                  {premiumUsers.map((u: PublicUser, idx: number) => {
                    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
                    const assetsBase = apiBase.replace(/\/api$/, '')
                    const firstImage = u?.profileImages?.[0]
                    const imageUrl = firstImage ? `${assetsBase}/uploads/profiles/${firstImage}` : 'https://placehold.co/500x600/ffd166/1f2937?text=Premium+Member'
                    const displayName = u?.nickname || u?.firstName || u?.lastName || 'Premium User'
                    const tier: string = (u?.membership?.tier || 'member') as string
                    const tierColors: Record<string, string> = {
                      platinum: 'from-purple-500 to-pink-500',
                      diamond: 'from-blue-500 to-cyan-500',
                      vip2: 'from-red-500 to-orange-500',
                      vip1: 'from-orange-500 to-yellow-500',
                      vip: 'from-purple-400 to-pink-400',
                      gold: 'from-yellow-500 to-amber-500',
                      silver: 'from-gray-400 to-slate-400'
                    }
                    const badgeGradient = tierColors[tier] || 'from-gray-300 to-gray-400'
                    return (
                      <div
                        key={u._id || idx}
                        className="modern-card rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-pink-100/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer group"
                        onClick={() => {
                          const modalProfile: FeaturedProfile = {
                            id: u._id,
                            name: displayName,
                            age: u?.age,
                            location: u?.location || 'Thailand',
                            distance: 'Premium',
                            bio: u?.bio || '',
                            interests: Array.isArray(u?.interests)
                              ? u.interests.map((it: any) => it?.category || it?.name || `${it}`).filter(Boolean)
                              : [],
                            images: (u?.profileImages || []).map((img: string) => `${assetsBase}/uploads/profiles/${img}`),
                            verified: false,
                            online: false,
                            lastActive: ''
                          }
                          openProfileModal(modalProfile)
                        }}
                      >
                        <div className="h-72 overflow-hidden relative">
                          <img
                            src={imageUrl}
                            alt={displayName}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                          <div className="absolute top-4 left-4">
                            <div className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${badgeGradient} shadow-xl border border-white/10`}>{tier.toUpperCase()}</div>
                          </div>
                          <div className="absolute bottom-4 left-4 right-4 text-white">
                            <div className="flex justify-between items-end">
                              <div>
                                <h3 className="text-xl font-bold">{displayName}{u?.age ? `, ${u.age}` : ''}</h3>
                                {u?.location && (
                                  <div className="flex items-center text-white/90 text-sm">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span>{u.location}</span>
                                  </div>
                                )}
                              </div>
                              <Button size="icon" variant="ghost" className="rounded-full text-white hover:text-pink-300 hover:bg-white/20 transition-all duration-300">
                                <Heart className="h-5 w-5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              {/* Discover Amazing People */}
              <div className="flex justify-between items-center mb-6 mt-12">
                <div>
                  <h2 className="text-3xl font-bold gradient-text mb-2">Discover Amazing People ✨</h2>
                  <p className="text-gray-600">
                    Find your perfect match from verified singles 
                    {!isLoadingAllUsers && allUsers.length > 0 && (
                      <span className="ml-2 text-pink-600 font-semibold">
                        (สุ่มแสดง {allUsers.length} คนจากทั้งหมดในระบบ)
                      </span>
                    )}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setIsLoadingAllUsers(true)
                    setCurrentPage(1)
                    setHasMoreUsers(true)
                    // Trigger reload
                    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
                    fetch(`${base}/api/profile/all?limit=20&page=1`, {
                      headers: {
                        'Content-Type': 'application/json',
                        ...(sessionStorage.getItem('token') ? { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } : {})
                      }
                    })
                    .then(res => res.json())
                    .then(data => {
                      if (data.success) {
                        setAllUsers(data.data.users)
                        setHasMoreUsers(data.data.pagination.page < data.data.pagination.pages)
                        setCurrentPage(1)
                      }
                    })
                    .catch(() => {})
                    .finally(() => setIsLoadingAllUsers(false))
                  }}
                  disabled={isLoadingAllUsers}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingAllUsers ? 'animate-spin' : ''}`} />
                  รีเฟรช
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {isLoadingAllUsers ? (
                  // Loading skeleton
                  Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="modern-card rounded-2xl overflow-hidden shadow-xl animate-pulse">
                      <div className="h-72 bg-gray-200"></div>
                      <div className="p-6">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-4"></div>
                        <div className="flex gap-2">
                          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                          <div className="h-6 bg-gray-200 rounded-full w-14"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : allUsers.length > 0 ? (
                  allUsers
                    .filter(user => {
                      const tier = (user?.membership?.tier || 'member') as string
                      const allowed = ['member','silver','gold','vip','vip1','vip2']
                      return allowed.includes(tier)
                    })
                    .slice(0, visibleCount)
                    .map(user => {
                    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
                    const profileImage = user.profileImages && user.profileImages.length > 0 
                      ? `${baseUrl}/uploads/profiles/${user.profileImages[0]}`
                      : 'https://placehold.co/500x600/6366f1/ffffff?text=No+Image'
                    
                    const displayName = user.nickname || user.firstName || user.username || 'Unknown'
                    const age = user.age || 'N/A'
                    const location = user.location || 'Unknown'
                    const bio = user.bio || 'No bio available'
                    const interests = user.interests?.map(i => i.category || i) || []
                    
                    return (
                      <div key={user._id} className="modern-card rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-pink-100/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer group floating-hearts" onClick={() => openProfileModal({
                        id: user._id,
                        name: displayName,
                        age: age,
                        location: location,
                        bio: bio,
                        interests: interests,
                        images: [profileImage],
                        verified: user.isVerified,
                        online: user.isOnline
                      })}>
                        <div className="h-72 overflow-hidden relative">
                          <img 
                            src={profileImage} 
                            onError={handleProfileImageError}
                            alt={displayName} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                          {user.isVerified && (
                            <div className="absolute top-4 left-4">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-xl">
                                <CheckCircle className="h-5 w-5 text-white" fill="white" />
                              </div>
                            </div>
                          )}
                          {user.isOnline && (
                            <div className="absolute top-4 right-4">
                              <div className="w-4 h-4 bg-green-500 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
                            </div>
                          )}
                          <div className="absolute bottom-4 left-4 right-4 text-white">
                            <div className="flex justify-between items-end">
                              <div>
                                <h3 className="text-xl font-bold">{displayName}, {age}</h3>
                                <div className="flex items-center text-white/90 text-sm">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  <span>{location}</span>
                                </div>
                              </div>
                              <Button size="icon" variant="ghost" className="rounded-full text-white hover:text-pink-300 hover:bg-white/20 transition-all duration-300 heart-beat hover:scale-110">
                                <Heart className="h-5 w-5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">{bio}</p>
                          <div className="flex flex-wrap gap-2">
                            {interests.slice(0, 3).map((interest, i) => (
                              <span key={i} className="px-3 py-1.5 bg-gradient-to-r from-pink-100 to-violet-100 text-pink-700 rounded-full text-xs font-semibold hover:from-pink-200 hover:to-violet-200 transition-all duration-300 shadow-sm">
                                {interest}
                              </span>
                            ))}
                            {interests.length > 3 && (
                              <span className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-xs font-semibold">
                                +{interests.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">ไม่พบผู้ใช้ในระบบ</p>
                    <p className="text-gray-400 text-sm">อาจเป็นเพราะยังไม่มีผู้ใช้อื่นในระบบ หรือเกิดข้อผิดพลาดในการโหลดข้อมูล</p>
                    <Button 
                      onClick={() => {
                        setIsLoadingAllUsers(true)
                        setCurrentPage(1)
                        setHasMoreUsers(true)
                        // Trigger reload
                        const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
                        fetch(`${base}/api/profile/all?limit=20&page=1`, {
                          headers: {
                            'Content-Type': 'application/json',
                            ...(sessionStorage.getItem('token') ? { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } : {})
                          }
                        })
                        .then(res => res.json())
                        .then(data => {
                          if (data.success) {
                            setAllUsers(data.data.users)
                            setHasMoreUsers(data.data.pagination.page < data.data.pagination.pages)
                            setCurrentPage(1)
                          }
                        })
                        .catch(() => {})
                        .finally(() => setIsLoadingAllUsers(false))
                      }}
                      disabled={isLoadingAllUsers}
                      className="mt-4 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingAllUsers ? 'animate-spin' : ''}`} />
                      ลองใหม่
                    </Button>
                  </div>
                )}
                
                {/* Load More Button */}
                {!isLoadingAllUsers && allUsers.length > 0 && (
                  <div className="col-span-full text-center py-8">
                    <Button
                      onClick={async () => {
                        const allowed = ['member','silver','gold','vip','vip1','vip2']
                        const filteredLen = allUsers.filter(u => allowed.includes((u?.membership?.tier || 'member') as string)).length
                        const nextCount = Math.min(visibleCount + 8, filteredLen)
                        if (visibleCount < filteredLen) {
                          setVisibleCount(nextCount)
                        } else if (hasMoreUsers && !isLoadingMore) {
                          await loadMoreUsers()
                          setVisibleCount(prev => prev + 8)
                        }
                      }}
                      disabled={isLoadingMore}
                      variant="outline"
                      size="lg"
                      className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isLoadingMore ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          กำลังโหลด...
                        </>
                      ) : (
                        <>
                          <Users className="w-5 h-5 mr-2" />
                          โหลดต่อ
                        </>
                      )}
                    </Button>
                    {(() => {
                      const allowed = ['member','silver','gold','vip','vip1','vip2']
                      const filteredLen = allUsers.filter(u => allowed.includes((u?.membership?.tier || 'member') as string)).length
                      return hasMoreUsers || visibleCount < filteredLen
                    })() && (
                      <p className="text-gray-500 text-sm mt-2">
                        หน้า {currentPage} • โหลดเพิ่ม 20 คนต่อครั้ง
                      </p>
                    )}
                  </div>
                )}
                
                {/* No More Users */}
                {!isLoadingAllUsers && allUsers.length > 0 && !hasMoreUsers && (
                  <div className="col-span-full text-center py-8">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <p className="text-green-700 font-semibold">แสดงครบทุกคนแล้ว!</p>
                      <p className="text-green-600 text-sm">คุณได้ดูผู้ใช้ทั้งหมดที่สุ่มแสดงแล้ว - กดปุ่มรีเฟรชเพื่อสุ่มใหม่</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            {/* Matches Tab */}
            <TabsContent value="matches" className="p-6">
              {!isAuthenticated ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">กรุณาเข้าสู่ระบบเพื่อใช้งาน AI Matching</p>
                  <Button onClick={() => setShowLoginDialog(true)}>
                    เข้าสู่ระบบ
                  </Button>
                </div>
              ) : (
                <AIMatchingSystem currentUser={user} />
              )}
            </TabsContent>
            {/* Messages Tab */}
            <TabsContent value="messages" className="p-0">
              {!isAuthenticated ? (
                <div className="text-center py-12">
                  <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">กรุณาเข้าสู่ระบบเพื่อใช้งานแชท</p>
                  <Button onClick={() => setShowLoginDialog(true)}>
                    เข้าสู่ระบบ
                  </Button>
                </div>
              ) : chatView === 'list' ? (
                <ChatRoomList
                  currentUser={user}
                  onSelectRoom={handleSelectRoom}
                  onCreatePrivateRoom={() => setShowCreateRoomModal(true)}
                />
              ) : (
                <RealTimeChat
                  roomId={selectedRoomId}
                  currentUser={user}
                  onBack={handleBackToRoomList}
                />
              )}
            </TabsContent>
            {/* Membership Tab */}
            <TabsContent value="membership" className="p-6">
              <div className="space-y-8">
                <MembershipDashboard userId={user?._id} />
                <div className="border-t border-slate-200 pt-8">
                  <MembershipPlans currentUserId={user?._id} currentTier="member" />
                </div>
              </div>
            </TabsContent>
            {/* Profile Tab */}
            <TabsContent value="profile" className="p-6">
              {isAuthenticated && user ? (
                <UserProfile
                  userId={user._id || user.id}
                  isOwnProfile={true}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">กรุณาเข้าสู่ระบบเพื่อดูโปรไฟล์</p>
                  <Button onClick={() => setShowLoginDialog(true)}>
                    เข้าสู่ระบบ
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-pink-100 to-violet-100 text-pink-700 text-sm font-medium mb-6">
              <Zap className="h-4 w-4 mr-2" />
              <span>Why Choose Us</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-light text-slate-800 mb-4">
              Find your perfect match with <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">sodeclick</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Experience dating with a beautifully designed platform that prioritizes meaningful connections and user experience.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Heart className="h-6 w-6 text-white" fill="white" />
              </div>
              <h3 className="text-xl font-medium text-slate-800 mb-3">Meaningful Connections</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our intelligent algorithm matches you with people who share your interests and values, creating authentic relationships that matter.
              </p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-medium text-slate-800 mb-3">Verified Profiles</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                All profiles are verified for authenticity, ensuring a safe and trustworthy environment for genuine connections.
              </p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-medium text-slate-800 mb-3">Date Planning</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Suggest and plan dates easily with our integrated tools and personalized local recommendations for memorable experiences.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-white/40 backdrop-blur-md border-t border-white/20 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-7 h-7 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 text-white" fill="white" />
              </div>
              <span className="text-xl font-light bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">sodeclick</span>
            </div>
            <div className="flex space-x-8">
              <a href="#" className="text-slate-500 hover:text-pink-500 transition-colors duration-200">About</a>
              <a href="#" className="text-slate-500 hover:text-pink-500 transition-colors duration-200">Privacy</a>
              <a href="#" className="text-slate-500 hover:text-pink-500 transition-colors duration-200">Terms</a>
              <a href="#" className="text-slate-500 hover:text-pink-500 transition-colors duration-200">Contact</a>
            </div>
          </div>
          <div className="mt-8 text-center md:text-left text-slate-400 text-sm">
            © {new Date().getFullYear()} sodeclick. All rights reserved.
          </div>
        </div>
      </footer>
      {/* Profile Modal */}
      {selectedProfile && (
        <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
          <DialogContent className="max-w-none bg-white/90 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-0 overflow-hidden" style={{ width: '1400px', height: '900px', minWidth: '1400px', minHeight: '900px' }}>
            <VisuallyHidden>
              <DialogTitle>Profile of {selectedProfile.name}</DialogTitle>
              <DialogDescription>
                View detailed profile information for {selectedProfile.name}, age {selectedProfile.age} from {selectedProfile.location}
              </DialogDescription>
            </VisuallyHidden>
            <div className="flex h-full">
              {/* Image Gallery */}
              <div className="w-1/2 relative">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="relative w-full h-full">
                  <img
                    src={selectedProfile.images[activeImageIndex]}
                    alt={selectedProfile.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  {/* Profile Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <h3 className="text-lg font-medium">{selectedProfile.name}, {selectedProfile.age}</h3>
                        <div className="flex items-center text-white/90 text-sm">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{selectedProfile.location}</span>
                          <span className="mx-2">•</span>
                          <span>{selectedProfile.distance}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-full text-white hover:text-pink-300 hover:bg-white/10 h-8 w-8"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-full text-white hover:text-pink-300 hover:bg-white/10 h-8 w-8"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {/* Image Indicators */}
                  {selectedProfile.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {selectedProfile.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === activeImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Profile Details */}
              <div className="w-1/2 p-6 overflow-y-auto bg-white flex flex-col">

                
                <div className="flex items-center mb-8">
                  <h4 className="text-4xl font-semibold text-slate-800">{selectedProfile.name}</h4>
                  {selectedProfile.verified && (
                    <div className="ml-4 flex items-center text-blue-500 text-lg">
                      <CheckCircle className="h-7 w-7 mr-2" fill="currentColor" />
                      <span>Verified</span>
                    </div>
                  )}
                  {selectedProfile.online && (
                    <div className="ml-4 flex items-center text-green-500 text-lg">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                      <span>Online</span>
                    </div>
                  )}
                </div>
                <p className="text-slate-600 mb-10 leading-relaxed text-xl">{selectedProfile.bio}</p>
                {/* Personal Information - ข้อมูลส่วนตัว */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-4">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    <h5 className="text-lg font-semibold text-slate-800">ข้อมูลส่วนตัว</h5>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Briefcase className="h-5 w-5 mr-3 mt-0.5 text-slate-600" />
                        <div>
                          <div className="text-sm text-slate-500">อาชีพ</div>
                          <div className="font-medium text-slate-800">{selectedProfile.job || 'ไม่ระบุ'}</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Ruler className="h-5 w-5 mr-3 mt-0.5 text-slate-600" />
                        <div>
                          <div className="text-sm text-slate-500">ร่างกาย</div>
                          <div className="font-medium text-slate-800">{selectedProfile.height || 'ไม่ระบุ'}</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Languages className="h-5 w-5 mr-3 mt-0.5 text-slate-600" />
                        <div>
                          <div className="text-sm text-slate-500">ภาษา</div>
                          <div className="font-medium text-slate-800">
                            {selectedProfile.languages && selectedProfile.languages.length > 0 ? selectedProfile.languages.join(', ') : 'ไม่ระบุ'}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <GraduationCap className="h-5 w-5 mr-3 mt-0.5 text-slate-600" />
                        <div>
                          <div className="text-sm text-slate-500">จบสถาบันศึกษา</div>
                          <div className="font-medium text-slate-800">{selectedProfile.education || 'ไม่ระบุ'}</div>
                          <div className="text-xs text-slate-500">ระดับ: ปริญญาตรี</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Building className="h-5 w-5 mr-3 mt-0.5 text-slate-600" />
                        <div>
                          <div className="text-sm text-slate-500">ศาสนา</div>
                          <div className="font-medium text-slate-800">พุทธ</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <PawPrint className="h-5 w-5 mr-3 mt-0.5 text-slate-600" />
                        <div>
                          <div className="text-sm text-slate-500">สัตว์เลี้ยง</div>
                          <div className="font-medium text-slate-800">แมว 2 ตัว</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Interests - แสดงเฉพาะเมื่อมีข้อมูล */}
                {selectedProfile.interests && selectedProfile.interests.length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-pink-500" />
                      Interests
                    </h5>
                    <div className="flex flex-wrap gap-3">
                      {selectedProfile.interests.map((interest, i) => (
                        <span key={i} className="px-3 py-2 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-full text-base font-medium">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {/* Lifestyle - ไลฟ์สไตล์ */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-4">
                    <Heart className="h-5 w-5 mr-2 text-green-600" />
                    <h5 className="text-lg font-semibold text-slate-800">ไลฟ์สไตล์</h5>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <X className="h-5 w-5 mr-3 mt-0.5 text-slate-600" />
                        <div>
                          <div className="text-sm text-slate-500">การสูบบุหรี่</div>
                          <div className="font-medium text-slate-800">ไม่สูบบุหรี่</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Dumbbell className="h-5 w-5 mr-3 mt-0.5 text-slate-600" />
                        <div>
                          <div className="text-sm text-slate-500">การออกกำลังกาย</div>
                          <div className="font-medium text-slate-800">ออกกำลังกายทุกวัน</div>
                        </div>
                      </div>
                    </div>
                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Wine className="h-5 w-5 mr-3 mt-0.5 text-slate-600" />
                        <div>
                          <div className="text-sm text-slate-500">การดื่มสุรา</div>
                          <div className="font-medium text-slate-800">ไม่ดื่มสุรา</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Utensils className="h-5 w-5 mr-3 mt-0.5 text-slate-600" />
                        <div>
                          <div className="text-sm text-slate-500">อาหาร</div>
                          <div className="font-medium text-slate-800">ทานอาหารทั่วไป</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex space-x-4 mt-auto pt-6">
                  <Button className="flex-1 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12 text-lg font-medium">
                    <MessageSquare className="h-5 w-5 mr-3" />
                    Send Message
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12 border-slate-200 hover:bg-slate-50">
                    <Video className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      {/* Create Private Room Modal */}
      <CreatePrivateRoomModal
        isOpen={showCreateRoomModal}
        onClose={() => setShowCreateRoomModal(false)}
        onCreateRoom={handleCreatePrivateRoom}
        currentUser={user}
      />
      <ToastContainer />
    </div>
  )
}

const AppWrapper = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthProvider>
  );
};

export default AppWrapper