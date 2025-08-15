import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import UserManagement from './UserManagement';
import PremiumManagement from './PremiumManagement';
import BannedUsers from './BannedUsers';
import HealthCheck from './HealthCheck';
import { 
  Users, 
  MessageCircle, 
  Crown, 
  Activity, 
  Settings,
  UserCheck,
  AlertCircle,
  TrendingUp,
  Database,
  Shield,
  Zap
} from 'lucide-react';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMessages: 0,
    onlineUsers: 0,
    premiumUsers: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard'); // เพิ่ม state สำหรับจัดการ view
  const [recentActivities, setRecentActivities] = useState([]); // เพิ่ม state สำหรับกิจกรรมล่าสุด
  const [lastActivityCount, setLastActivityCount] = useState(0); // เก็บจำนวนกิจกรรมครั้งล่าสุด

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, redirecting to home');
          window.location.href = '/';
          return;
        }

        // Verify token and get user info
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          console.log('Token invalid, redirecting to home');
          window.location.href = '/';
          return;
        }

        const response = await res.json();
        const userData = response.data?.user;
        setUser(userData);

        if (userData?.role !== 'admin' && userData?.role !== 'superadmin') {
          console.log('Not admin role, redirecting to home');
          window.location.href = '/';
          return;
        }

        console.log('Admin access granted');
        setIsLoading(false);
        fetchDashboardData();
      } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = '/';
      }
    };

    checkAuth();
  }, []);

  // Real-time polling สำหรับกิจกรรมล่าสุด
  useEffect(() => {
    // ตั้ง polling ทุก 10 วินาที
    const interval = setInterval(() => {
      if (!isLoading) {
        fetchRecentActivities();
      }
    }, 10000); // 10 วินาที

    // Cleanup interval เมื่อ component unmount
    return () => clearInterval(interval);
  }, [isLoading]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch dashboard statistics
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setStats({
          totalUsers: data.totalUsers || 0,
          totalMessages: data.totalMessages || 0,
          onlineUsers: data.onlineUsers || 0,
          premiumUsers: data.premiumUsers || 0
        });
      }
      
      // โหลดกิจกรรมล่าสุด
      await fetchRecentActivities();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // ฟังก์ชันดึงข้อมูลกิจกรรมล่าสุด
  const fetchRecentActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/activities`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        const data = await res.json();
        const newActivities = data.activities || [];
        
        // ตรวจสอบว่ามีกิจกรรมใหม่หรือไม่
        if (newActivities.length > lastActivityCount && lastActivityCount > 0) {
          // มีกิจกรรมใหม่
          const newCount = newActivities.length - lastActivityCount;
          
          // แสดง notification
          if (newCount > 0) {
            // เพิ่ม animation สำหรับกิจกรรมใหม่
            setTimeout(() => {
              const newActivityElements = document.querySelectorAll('[data-activity-id]');
              newActivityElements.forEach((element, index) => {
                if (index < newCount) {
                  element.classList.add('animate-pulse', 'bg-green-50', 'border-l-4', 'border-green-500');
                  setTimeout(() => {
                    element.classList.remove('animate-pulse', 'bg-green-50', 'border-l-4', 'border-green-500');
                  }, 3000);
                }
              });
            }, 100);
          }
        }
        
        setLastActivityCount(newActivities.length);
        
        setRecentActivities(newActivities);
      } else {
        // ใช้ข้อมูลจำลองถ้า API ยังไม่มี
        setRecentActivities(generateMockActivities());
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      // ใช้ข้อมูลจำลองถ้าเกิด error
      setRecentActivities(generateMockActivities());
    }
  };

  // ฟังก์ชันสร้างข้อมูลกิจกรรมจำลอง
  const generateMockActivities = () => {
    const activities = [
      {
        id: 1,
        type: 'account_created',
        message: 'ผู้ใช้ใหม่สมัครสมาชิก: นิดา สุขใส',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        status: 'success'
      },
      {
        id: 2,
        type: 'membership_upgrade',
        message: 'อัพเกรดเป็น Premium: อรรถพล จินดา',
        timestamp: new Date(Date.now() - 12 * 60 * 1000),
        status: 'premium'
      },
      {
        id: 3,
        type: 'chat_message',
        message: 'ข้อความใหม่ในแชทหลัก',
        timestamp: new Date(Date.now() - 18 * 60 * 1000),
        status: 'info'
      },
      {
        id: 4,
        type: 'user_login',
        message: 'ผู้ใช้เข้าสู่ระบบ: สมชาย ใจดี',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        status: 'success'
      },
      {
        id: 5,
        type: 'payment_deposit',
        message: 'เติมเงินเข้าบัญชี: ฿500 - กานดา รุ่งโรจน์',
        timestamp: new Date(Date.now() - 35 * 60 * 1000),
        status: 'premium'
      },
      {
        id: 6,
        type: 'account_banned',
        message: 'แบนบัญชี: วิชัย หยาบคาย (เหตุผล: พฤติกรรมไม่เหมาะสม)',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        status: 'warning'
      },
      {
        id: 7,
        type: 'user_logout',
        message: 'ผู้ใช้ออกจากระบบ: มนัส สมบูรณ์',
        timestamp: new Date(Date.now() - 55 * 60 * 1000),
        status: 'info'
      },
      {
        id: 8,
        type: 'chat_message',
        message: 'ข้อความใหม่จาก Premium user',
        timestamp: new Date(Date.now() - 65 * 60 * 1000),
        status: 'premium'
      },
      {
        id: 9,
        type: 'account_created',
        message: 'ผู้ใช้ใหม่สมัครสมาชิก: ปณิดา งามสง่า',
        timestamp: new Date(Date.now() - 75 * 60 * 1000),
        status: 'success'
      },
      {
        id: 10,
        type: 'user_login',
        message: 'ผู้ใช้เข้าสู่ระบบ: ธนาคาร เงินทอง',
        timestamp: new Date(Date.now() - 85 * 60 * 1000),
        status: 'success'
      }
    ];
    return activities;
  };

  

  // ฟังก์ชันแปลงเวลาเป็นรูปแบบที่อ่านง่าย
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes} นาทีที่แล้ว`;
    } else if (hours < 24) {
      return `${hours} ชั่วโมงที่แล้ว`;
    } else {
      return `${days} วันที่แล้ว`;
    }
  };

  // ฟังก์ชันกำหนดสีตามสถานะ
  const getActivityColor = (status) => {
    const colors = {
      success: 'bg-green-400',
      premium: 'bg-amber-400',
      warning: 'bg-red-400',
      info: 'bg-blue-400'
    };
    return colors[status] || 'bg-gray-400';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <h1 className="text-xl font-bold text-slate-800">กำลังโหลด Admin Dashboard...</h1>
        </div>
      </div>
    );
  }

  // Authorization check
  if (!user || (user?.role !== 'admin' && user?.role !== 'superadmin')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">ไม่มีสิทธิ์เข้าถึง</h1>
          <p className="text-slate-600 mb-4">คุณไม่มีสิทธิ์เข้าถึงหน้า Admin Dashboard</p>
          <Button 
            className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white"
            onClick={() => window.location.href = '/'}
          >
            กลับหน้าหลัก
          </Button>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'users':
        return <UserManagement />;
      case 'premium':
        return <PremiumManagement />;
      case 'banned':
        return <BannedUsers />;
      case 'health':
        return <HealthCheck />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <>
             {/* Stats Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-slate-700">ผู้ใช้ทั้งหมด</CardTitle>
             <Users className="h-4 w-4 text-blue-500" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-slate-800">{stats.totalUsers.toLocaleString()}</div>
             <p className="text-xs text-slate-500 mt-1">
               <TrendingUp className="inline h-3 w-3 mr-1" />
               +12% จากเดือนที่แล้ว
             </p>
           </CardContent>
         </Card>

         <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-slate-700">ข้อความทั้งหมด</CardTitle>
             <MessageCircle className="h-4 w-4 text-green-500" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-slate-800">{stats.totalMessages.toLocaleString()}</div>
             <p className="text-xs text-slate-500 mt-1">
               <TrendingUp className="inline h-3 w-3 mr-1" />
               +8% จากเดือนที่แล้ว
             </p>
           </CardContent>
         </Card>

         <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-slate-700">ผู้ใช้ออนไลน์</CardTitle>
             <Activity className="h-4 w-4 text-amber-500" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-slate-800">{stats.onlineUsers}</div>
             <p className="text-xs text-slate-500 mt-1">
               ณ ขณะนี้
             </p>
           </CardContent>
         </Card>

         <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-slate-700">สมาชิก Premium</CardTitle>
             <Crown className="h-4 w-4 text-purple-500" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-slate-800">{stats.premiumUsers}</div>
             <p className="text-xs text-slate-500 mt-1">
               <TrendingUp className="inline h-3 w-3 mr-1" />
               +25% จากเดือนที่แล้ว
             </p>
           </CardContent>
         </Card>
       </div>

             {/* Quick Actions */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* User Management */}
         <Card className="bg-white border border-slate-200 shadow-sm">
           <CardHeader>
             <CardTitle className="text-slate-800 flex items-center gap-2">
               <Users size={20} />
               จัดการผู้ใช้
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             <Button 
               variant="outline" 
               className="w-full justify-start border-slate-200 hover:bg-slate-50"
               onClick={() => setCurrentView('users')}
             >
               <UserCheck size={16} className="mr-2" />
               ดูรายชื่อผู้ใช้ทั้งหมด
             </Button>
             <Button 
               variant="outline" 
               className="w-full justify-start border-slate-200 hover:bg-slate-50"
               onClick={() => setCurrentView('premium')}
             >
               <Crown size={16} className="mr-2" />
               จัดการสมาชิก Premium
             </Button>
             <Button 
               variant="outline" 
               className="w-full justify-start border-slate-200 hover:bg-slate-50"
               onClick={() => setCurrentView('banned')}
             >
               <Shield size={16} className="mr-2" />
               ผู้ใช้ที่ถูกแบน
             </Button>
           </CardContent>
         </Card>

         {/* System Management */}
         <Card className="bg-white border border-slate-200 shadow-sm">
           <CardHeader>
             <CardTitle className="text-slate-800 flex items-center gap-2">
               <Database size={20} />
               จัดการระบบ
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             <Button 
               variant="outline" 
               className="w-full justify-start border-slate-200 hover:bg-slate-50"
               onClick={() => setCurrentView('health')}
             >
               <Zap size={16} className="mr-2" />
               API Status Monitor
             </Button>
             <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50">
               <MessageCircle size={16} className="mr-2" />
               ดูข้อความแชททั้งหมด
             </Button>
             <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50">
               <Activity size={16} className="mr-2" />
               สถิติการใช้งาน
             </Button>
             <Button variant="outline" className="w-full justify-start border-slate-200 hover:bg-slate-50">
               <Settings size={16} className="mr-2" />
               ตั้งค่าระบบ
             </Button>
           </CardContent>
         </Card>
       </div>

             {/* Recent Activity */}
       <Card className="bg-white border border-slate-200 shadow-sm">
         <CardHeader>
           <CardTitle className="text-slate-800 flex items-center gap-2">
             <Activity size={20} />
             กิจกรรมล่าสุด
             <span className="text-sm text-slate-500 ml-2">({recentActivities.length} รายการ)</span>
             <div className="flex items-center gap-1 ml-2">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <span className="text-xs text-green-600 font-medium">เรียลไทม์</span>
             </div>
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="space-y-3 max-h-[300px] overflow-y-auto">
             {recentActivities.length > 0 ? (
               recentActivities.map((activity, index) => (
                 <div 
                   key={activity.id} 
                   data-activity-id={activity.id}
                   className={`flex items-center gap-3 p-3 bg-slate-50 rounded-lg transition-all duration-200 hover:bg-slate-100 ${
                     index >= 5 ? 'opacity-80' : ''
                   }`}
                 >
                   <div className={`w-2 h-2 ${getActivityColor(activity.status)} rounded-full flex-shrink-0`}></div>
                   <div className="flex-1 min-w-0">
                     <p className="text-slate-800 text-sm leading-relaxed">{activity.message}</p>
                     <p className="text-xs text-slate-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                   </div>
                   <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                     activity.status === 'success' ? 'bg-green-100 text-green-700' :
                     activity.status === 'premium' ? 'bg-amber-100 text-amber-700' :
                     activity.status === 'warning' ? 'bg-red-100 text-red-700' :
                     'bg-blue-100 text-blue-700'
                   }`}>
                     {activity.type.replace('_', ' ')}
                   </div>
                 </div>
               ))
             ) : (
               <div className="text-center py-8 text-slate-500">
                 <Activity size={48} className="mx-auto mb-2 opacity-50" />
                 <p>ไม่มีกิจกรรมล่าสุด</p>
               </div>
             )}
           </div>
           {recentActivities.length > 5 && (
             <div className="mt-3 text-center">
               <p className="text-xs text-slate-500">เลื่อนลงเพื่อดูกิจกรรมเพิ่มเติม</p>
             </div>
           )}
         </CardContent>
       </Card>

       {/* Welcome Message */}
       <Card className="bg-white border border-slate-200 shadow-sm">
         <CardContent className="p-8 text-center">
           <Shield size={64} className="mx-auto mb-4 text-pink-500" />
           <h2 className="text-2xl font-bold text-slate-800 mb-2">ยินดีต้อนรับสู่ Admin Dashboard</h2>
           <p className="text-slate-600">คุณสามารถจัดการระบบและดูสถิติการใช้งานได้ที่นี่</p>
         </CardContent>
       </Card>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Admin Header */}
      <div className="bg-white border-b border-slate-200 p-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-800 flex items-center gap-3">
              <Shield size={32} />
              Admin Dashboard
            </h1>
            <p className="text-slate-600 mt-1">ยินดีต้อนรับ, {user?.username}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-200 hover:bg-slate-50" onClick={() => window.location.href = '/'}>
              กลับหน้าหลัก
            </Button>
    
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default AdminDashboard;
