import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
// import { useToast } from './ui/toast'; // ลบการใช้ toast
import {
  Heart, 
  MessageCircle, 
  MapPin, 
  Star, 
  Loader2,
  Filter,
  RefreshCw,
  Users,
  Zap,
  X,
  Check,
  Sliders
} from 'lucide-react';

const AIMatchingSystem = ({ currentUser }) => {
  // const { success, error: showError, warning } = useToast(); // ลบการใช้ toast
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // Default filters
  const defaultFilters = {
    maxDistance: 50,
    minAge: 18,
    maxAge: 60,
    gender: 'all',
    lookingFor: 'all',
    onlineOnly: false,
    hasPhoto: false,
    membershipTier: 'all',
    interests: [],
    lifestyle: {
      smoking: 'all',
      drinking: 'all',
      exercise: 'all'
    }
  };

  const [tempFilters, setTempFilters] = useState(defaultFilters);
  const [filters, setFilters] = useState(defaultFilters);

  // Check authentication
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const user = sessionStorage.getItem('user');
    console.log('Token exists:', !!token);
    console.log('User exists:', !!user);
    if (!token || !user) {
      // showError('กรุณาเข้าสู่ระบบก่อน'); // ลบการแจ้งเตือน
      console.error('กรุณาเข้าสู่ระบบก่อน');
    }
  }, []);

  // ฟังก์ชันนับจำนวน filter ที่ใช้
  const countActiveFilters = () => {
    let count = 0;
    if (tempFilters.maxDistance !== 50) count++;
    if (tempFilters.minAge !== 18) count++;
    if (tempFilters.maxAge !== 60) count++;
    if (tempFilters.gender !== 'all') count++;
    if (tempFilters.lookingFor !== 'all') count++;
    if (tempFilters.onlineOnly) count++;
    if (tempFilters.hasPhoto) count++;
    if (tempFilters.membershipTier !== 'all') count++;
    if (tempFilters.interests.length > 0) count++;
    if (tempFilters.lifestyle.smoking !== 'all') count++;
    if (tempFilters.lifestyle.drinking !== 'all') count++;
    if (tempFilters.lifestyle.exercise !== 'all') count++;
    return count;
  };

  // ฟังก์ชันใช้ตัวกรอง
  const applyFilters = () => {
    console.log('🎯 Applying filters:', tempFilters);
    setFilters({ ...tempFilters });
    setFilterCount(countActiveFilters());
    setShowFilterModal(false);
    setPage(1);
    setMatches([]);
    // Will trigger useEffect to refetch
  };

  // ฟังก์ชันรีเซ็ตตัวกรอง
  const resetFilters = () => {
    console.log('🔄 Resetting filters');
    setTempFilters(defaultFilters);
  };

  // ฟังก์ชันเปิด Filter Modal
  const handleOpenFilterModal = () => {
    console.log('🎛️ Opening filter modal');
    setShowFilterModal(true);
  };

  // Watch for filter changes
  useEffect(() => {
    if (userLocation) {
      setPage(1);
      setMatches([]);
      fetchMatches(1, false);
    }
  }, [filters]);

  // ฟังก์ชันดึงข้อมูลผู้ใช้
  const fetchMatches = async (pageNum = 1, append = false) => {
    if (!userLocation) return;

    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      // showError('กรุณาเข้าสู่ระบบก่อน'); // ลบการแจ้งเตือน
      console.error('กรุณาเข้าสู่ระบบก่อน');
      return;
    }

    if (append) {
      setIsLoadingMore(true);
    } else {
      setLoading(true);
    }
    
    try {
      // สร้าง query parameters
      const queryParams = new URLSearchParams({
        page: pageNum,
        limit: 10,
        lat: userLocation.lat,
        lng: userLocation.lng,
        maxDistance: filters.maxDistance,
        minAge: filters.minAge,
        maxAge: filters.maxAge
      });

      // เพิ่มตัวกรองเพิ่มเติม
      if (filters.gender !== 'all') queryParams.append('gender', filters.gender);
      if (filters.lookingFor !== 'all') queryParams.append('lookingFor', filters.lookingFor);
      if (filters.onlineOnly) queryParams.append('onlineOnly', 'true');
      if (filters.hasPhoto) queryParams.append('hasPhoto', 'true');
      if (filters.membershipTier !== 'all') queryParams.append('membershipTier', filters.membershipTier);
      if (filters.interests.length > 0) queryParams.append('interests', filters.interests.join(','));
      if (filters.lifestyle.smoking !== 'all') queryParams.append('smoking', filters.lifestyle.smoking);
      if (filters.lifestyle.drinking !== 'all') queryParams.append('drinking', filters.lifestyle.drinking);
      if (filters.lifestyle.exercise !== 'all') queryParams.append('exercise', filters.lifestyle.exercise);

      const response = await fetch(`/api/matching/ai-matches?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          // showError('กรุณาเข้าสู่ระบบใหม่'); // ลบการแจ้งเตือน
          console.error('กรุณาเข้าสู่ระบบใหม่');
          return;
        }
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      console.log('API Response:', data);
      console.log('Matches:', data.data?.matches);
      
      if (append) {
        setMatches(prev => [...prev, ...(data.data?.matches || [])]);
      } else {
        setMatches(data.data?.matches || []);
      }
      
      setHasMore(data.data?.pagination?.hasMore !== false);
      setTotalUsers(data.data?.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching matches:', error);
      // showError('เกิดข้อผิดพลาดในการโหลดข้อมูล'); // ลบการแจ้งเตือน
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  // ฟังก์ชันรีเฟรช
  const refreshMatches = () => {
    setPage(1);
    setMatches([]);
    setHasMore(true);
    fetchMatches(1, false);
  };

  // ฟังก์ชันโหลดเพิ่มเติม
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMatches(nextPage, true);
  };

  // ฟังก์ชันส่งข้อความ
  const sendMessage = (userId) => {
    window.location.href = `/chat/${userId}`;
  };

  // ฟังก์ชันไลค์
  const likeMatch = async (userId) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      // showError('กรุณาเข้าสู่ระบบก่อน'); // ลบการแจ้งเตือน
      console.error('กรุณาเข้าสู่ระบบก่อน');
      return;
    }

    try {
      const response = await fetch('/api/matching/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ matchId: userId })
      });

      if (response.ok) {
        // success('ส่งไลค์เรียบร้อยแล้ว!'); // ลบการแจ้งเตือน
        console.log('ส่งไลค์เรียบร้อยแล้ว!');
      } else {
        const error = await response.json();
        // showError(error.message || 'เกิดข้อผิดพลาดในการส่งไลค์'); // ลบการแจ้งเตือน
        console.error(error.message || 'เกิดข้อผิดพลาดในการส่งไลค์');
      }
    } catch (error) {
      console.error('Error liking user:', error);
      // showError('เกิดข้อผิดพลาดในการส่งไลค์'); // ลบการแจ้งเตือน
    }
  };

  // Get user location on mount
  useEffect(() => {
    console.log('📍 กำลังขอ GPS location...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('✅ GPS location สำเร็จ:', location);
          setUserLocation(location);
          // success('ได้รับตำแหน่ง GPS แล้ว'); // ลบการแจ้งเตือน
          console.log('ได้รับตำแหน่ง GPS แล้ว');
        },
        (error) => {
          console.error('❌ GPS location ล้มเหลว:', error);
          const defaultLocation = { lat: 13.7563, lng: 100.5018 };
          setUserLocation(defaultLocation);
          // warning('ใช้ตำแหน่งเริ่มต้น: กรุงเทพฯ (GPS ไม่ทำงาน)'); // ลบการแจ้งเตือน
          console.log('ใช้ตำแหน่งเริ่มต้น: กรุงเทพฯ (GPS ไม่ทำงาน)');
        }
      );
    } else {
      console.log('⚠️ Browser ไม่รองรับ geolocation');
      const defaultLocation = { lat: 13.7563, lng: 100.5018 };
      setUserLocation(defaultLocation);
      // warning('เบราว์เซอร์ไม่รองรับ GPS - ใช้ตำแหน่งเริ่มต้น: กรุงเทพฯ'); // ลบการแจ้งเตือน
      console.log('เบราว์เซอร์ไม่รองรับ GPS - ใช้ตำแหน่งเริ่มต้น: กรุงเทพฯ');
    }
  }, []);

  // Fetch matches when location is available
  useEffect(() => {
    if (userLocation) {
      fetchMatches(1, false);
    }
  }, [userLocation]);

  // Check if user is authenticated
  const token = sessionStorage.getItem('token');
  const user = sessionStorage.getItem('user');

  if (!token || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">กรุณาเข้าสู่ระบบก่อน</p>
          <p className="text-gray-400 text-sm">คุณต้องเข้าสู่ระบบเพื่อดู AI Matches</p>
          <Button 
            className="mt-4 bg-pink-500 hover:bg-pink-600"
            onClick={() => {
              window.location.href = '/login';
            }}
          >
            เข้าสู่ระบบ
          </Button>
        </div>
      </div>
    );
  }

  if (!userLocation) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-pink-500 mx-auto mb-4" />
          <p className="text-gray-600">กำลังดึงตำแหน่งปัจจุบัน...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Custom CSS for slider */}
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
          border: 3px solid white;
          transition: all 0.2s ease;
        }
        
        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(236, 72, 153, 0.6);
        }
        
        .slider-thumb::-moz-range-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
          border: 3px solid white;
        }
        
        .filter-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(252,231,243,0.5));
          backdrop-filter: blur(10px);
          border: 1px solid rgba(236, 72, 153, 0.1);
        }
      `}</style>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-50 via-white to-violet-50 rounded-2xl p-6 shadow-sm border border-pink-100">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl text-white shadow-lg">
                <Zap className="h-7 w-7" />
              </div>
              AI Smart Matching
            </h2>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <span className="bg-white px-3 py-1 rounded-full text-sm border border-pink-200">
                👥 {totalUsers || matches.length} คนในระบบ
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                userLocation
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
              }`}>
                {userLocation ? '📍 GPS เชื่อมต่อแล้ว' : '📍 กำลังค้นหาตำแหน่ง...'}
              </span>
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={refreshMatches}
              disabled={loading}
              className="bg-white border-pink-200 hover:bg-pink-50 hover:border-pink-300 transition-all duration-200 shadow-sm"
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              รีเฟรช
            </Button>
            <Button
              size="lg"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎛️ Filter button clicked!');
                handleOpenFilterModal();
              }}
              type="button"
              className="relative bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              style={{
                pointerEvents: 'auto',
                zIndex: 50,
                position: 'relative'
              }}
            >
              <Sliders className="h-5 w-5 mr-2" />
              ตัวกรองขั้นสูง
              {filterCount > 0 && (
                <span className="absolute -top-2 -right-2 h-6 w-6 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  {filterCount}
                </span>
              )}
            </Button>
          </div>
        </div>
        
        {/* Quick Filter Bar */}
        {filterCount > 0 && (
          <div className="mt-4 pt-4 border-t border-pink-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-600">ตัวกรองที่ใช้:</span>
              {filters.maxDistance !== 50 && (
                <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  ≤ {filters.maxDistance} กม.
                </span>
              )}
              {(filters.minAge !== 18 || filters.maxAge !== 60) && (
                <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {filters.minAge}-{filters.maxAge} ปี
                </span>
              )}
              {filters.gender !== 'all' && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {filters.gender === 'male' ? '👨 ชาย' : filters.gender === 'female' ? '👩 หญิง' : '🌈 อื่นๆ'}
                </span>
              )}
              {filters.onlineOnly && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  ออนไลน์เท่านั้น
                </span>
              )}
              {filters.membershipTier !== 'all' && (
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {filters.membershipTier.toUpperCase()}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilters(defaultFilters);
                  setTempFilters(defaultFilters);
                  setFilterCount(0);
                }}
                className="text-gray-500 hover:text-gray-700 px-2 py-1 h-auto"
              >
                <X className="h-3 w-3 mr-1" />
                ล้างทั้งหมด
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ผู้ใช้ทั้งหมด</p>
                <p className="text-2xl font-bold text-pink-500">
                  {totalUsers || matches.length}
                </p>
              </div>
              <Users className="h-8 w-8 text-pink-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ออนไลน์</p>
                <p className="text-2xl font-bold text-green-500">
                  {matches.filter(match => match.isActive).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ระยะทางเฉลี่ย</p>
                <p className="text-2xl font-bold text-violet-500">
                  {(() => {
                    const validMatches = matches.filter(match =>
                      match.distance !== undefined && match.distance >= 0
                    );
                    return validMatches.length > 0
                      ? `${(validMatches.reduce((sum, match) => sum + match.distance, 0) / validMatches.length).toFixed(1)} กม.`
                      : '0 กม.';
                  })()}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-violet-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-5 gap-4">
        {matches.map((match, index) => (
          <div
            key={match.id || match._id}
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:scale-105 cursor-pointer group"
          >
            {/* Image */}
            <div className="h-48 overflow-hidden relative">
              <img 
                src={match.profileImages?.[0] || 'https://via.placeholder.com/300x400?text=No+Image'} 
                alt={match.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              
              {/* Compatibility Score */}
              <div className="absolute top-2 right-2">
                <Badge className="bg-pink-500 text-white text-xs font-bold">
                  {match.compatibilityScore || 0}%
                </Badge>
              </div>

              {/* Distance */}
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  {match.distanceText || 'ไม่ระบุ'}
                </Badge>
              </div>
              
              {/* Online Status */}
              <div className="absolute bottom-2 right-2">
                <div className={`w-3 h-3 rounded-full border-2 border-white ${
                  match.isActive ? 'bg-green-500' : 'bg-gray-400'
                }`} title={match.isActive ? 'ออนไลน์' : 'ออฟไลน์'}></div>
              </div>
              
              {/* Membership Tier */}
              <div className="absolute bottom-2 left-2">
                <Badge 
                  className={`text-xs ${
                    match.membershipTier === 'diamond' ? 'bg-blue-500' :
                    match.membershipTier === 'vip' ? 'bg-purple-500' :
                    match.membershipTier === 'gold' ? 'bg-yellow-500' :
                    match.membershipTier === 'silver' ? 'bg-gray-500' :
                    'bg-gray-400'
                  } text-white`}
                >
                  {match.membershipTier?.toUpperCase() || 'MEMBER'}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm text-gray-800">
                  {match.name || 'ไม่ระบุชื่อ'}, {match.age || 'N/A'}
                </h3>
                <div className="flex items-center text-yellow-500">
                  <Star className="h-3 w-3 fill-current" />
                  <span className="text-xs ml-1">{match.compatibilityScore || 0}</span>
                </div>
              </div>
              
              {/* Online Status Text */}
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs ${match.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                  {match.isActive ? '🟢 ออนไลน์' : '⚫ ออฟไลน์'}
                </span>
                <span className="text-xs text-gray-500">
                  {match.lastActive ? `ใช้งานล่าสุด: ${new Date(match.lastActive).toLocaleDateString('th-TH')}` : 'ไม่ระบุ'}
                </span>
              </div>

              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {match.bio}
              </p>

              {/* Interests */}
              <div className="flex flex-wrap gap-1 mb-3">
                {match.interests && match.interests.slice(0, 2).map((interest, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {typeof interest === 'string' ? interest : interest.category || interest.items || 'Interest'}
                  </Badge>
                ))}
                {match.interests && match.interests.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{match.interests.length - 2}
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 items-center">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-9 text-xs flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    sendMessage(match.id || match._id);
                  }}
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  แชท
                </Button>
                <Button
                  size="sm"
                  className="flex-1 h-9 text-xs bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    likeMatch(match.id || match._id);
                  }}
                >
                  <Heart className="h-3 w-3 mr-1" />
                  ไลค์
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading */}
      {loading && matches.length === 0 && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
        </div>
      )}

      {/* Load More Button */}
      {!loading && hasMore && matches.length > 0 && (
        <div className="flex justify-center py-8">
          <Button
            size="lg"
            onClick={loadMore}
            disabled={isLoadingMore}
            className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white px-8 py-3"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                กำลังโหลด...
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5 mr-2" />
                โหลดเพิ่มเติม ({matches.length}/{totalUsers})
              </>
            )}
          </Button>
        </div>
      )}

      {/* No More */}
      {!hasMore && matches.length > 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
            <Users className="h-5 w-5 text-gray-600" />
            <p className="text-gray-600 font-medium">แสดงครบ {matches.length} คนแล้ว</p>
          </div>
        </div>
      )}

      {/* No Matches */}
      {!loading && !isLoadingMore && matches.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">ไม่พบผู้ใช้ในระบบ</p>
          <p className="text-gray-400 text-sm">อาจเป็นเพราะยังไม่มีผู้ใช้อื่นในระบบ หรือเกิดข้อผิดพลาดในการโหลดข้อมูล</p>
        </div>
      )}

      {/* Filter Modal */}
      <Dialog
        open={showFilterModal}
        onOpenChange={(open) => {
          console.log('🎛️ Dialog state changing:', open);
          setShowFilterModal(open);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-white via-pink-50 to-violet-50">
          <DialogHeader className="pb-6 border-b border-pink-200">
            <DialogTitle className="flex items-center gap-3 text-xl font-semibold bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-transparent">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg text-white">
                <Sliders className="h-5 w-5" />
              </div>
              ตัวกรองการค้นหาคู่
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              ปรับแต่งตัวกรองเพื่อค้นหาคู่ที่เหมาะสมกับคุณมากที่สุด
            </DialogDescription>
            {/* แสดงจำนวนตัวกรองที่ใช้ */}
            {countActiveFilters() > 0 && (
              <div className="inline-flex items-center gap-2 bg-pink-100 border border-pink-300 rounded-full px-4 py-2 text-sm text-pink-700 font-medium">
                <Filter className="h-4 w-4" />
                กำลังใช้ตัวกรอง {countActiveFilters()} รายการ
              </div>
            )}
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            {/* คอลัมน์ซ้าย - ตัวกรองพื้นฐาน */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-pink-100">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                  <MapPin className="h-5 w-5 text-pink-500" />
                  ตำแหน่งและระยะทาง
                </h3>
                
                {/* ระยะทาง */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="distance" className="text-sm font-medium text-gray-700">
                      ระยะทางสูงสุด
                    </Label>
                    <div className="bg-gradient-to-r from-pink-500 to-violet-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {tempFilters.maxDistance} กม.
                    </div>
                  </div>
                  <input
                    id="distance"
                    type="range"
                    min="1"
                    max="100"
                    value={tempFilters.maxDistance}
                    onChange={(e) => setTempFilters({...tempFilters, maxDistance: parseInt(e.target.value)})}
                    className="w-full h-3 bg-pink-100 rounded-lg appearance-none cursor-pointer slider-thumb"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">1 กม.</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">100+ กม.</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-pink-100">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                  <Users className="h-5 w-5 text-violet-500" />
                  ข้อมูลพื้นฐาน
                </h3>
                
                {/* อายุ */}
                <div className="space-y-3 mb-6">
                  <Label className="text-sm font-medium text-gray-700">ช่วงอายุที่สนใจ</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minAge" className="text-xs text-gray-500">อายุต่ำสุด</Label>
                      <div className="relative">
                        <Input
                          id="minAge"
                          type="number"
                          min="18"
                          max="100"
                          value={tempFilters.minAge}
                          onChange={(e) => setTempFilters({...tempFilters, minAge: parseInt(e.target.value)})}
                          className="border-pink-200 focus:border-pink-400 focus:ring-pink-300"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">ปี</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxAge" className="text-xs text-gray-500">อายุสูงสุด</Label>
                      <div className="relative">
                        <Input
                          id="maxAge"
                          type="number"
                          min="18"
                          max="100"
                          value={tempFilters.maxAge}
                          onChange={(e) => setTempFilters({...tempFilters, maxAge: parseInt(e.target.value)})}
                          className="border-pink-200 focus:border-pink-400 focus:ring-pink-300"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">ปี</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* เพศ */}
                <div className="space-y-3 mb-6">
                  <Label className="text-sm font-medium text-gray-700">เพศที่ต้องการดู</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {['all', 'male', 'female', 'other'].map((gender) => (
                      <Button
                        key={gender}
                        variant={tempFilters.gender === gender ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTempFilters({...tempFilters, gender})}
                        className={`transition-all duration-200 ${
                          tempFilters.gender === gender
                            ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg scale-105'
                            : 'border-pink-200 hover:border-pink-300 hover:bg-pink-50'
                        }`}
                      >
                        {gender === 'all' ? '🌟 ทั้งหมด' :
                         gender === 'male' ? '👨 ชาย' :
                         gender === 'female' ? '👩 หญิง' : '🌈 อื่นๆ'}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* กำลังมองหา */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">กำลังมองหาเพศใด</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {['all', 'male', 'female', 'both'].map((looking) => (
                      <Button
                        key={looking}
                        variant={tempFilters.lookingFor === looking ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTempFilters({...tempFilters, lookingFor: looking})}
                        className={`transition-all duration-200 ${
                          tempFilters.lookingFor === looking
                            ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-lg scale-105'
                            : 'border-violet-200 hover:border-violet-300 hover:bg-violet-50'
                        }`}
                      >
                        {looking === 'all' ? '🌟 ทั้งหมด' :
                         looking === 'male' ? '👨 ชาย' :
                         looking === 'female' ? '👩 หญิง' : '💝 ทั้งสองเพศ'}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* คอลัมน์ขวา - ตัวกรองขั้นสูง */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-violet-100">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                  <Star className="h-5 w-5 text-yellow-500" />
                  ระดับสมาชิก
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {['all', 'member', 'silver', 'gold', 'vip', 'diamond'].map((tier) => (
                    <Button
                      key={tier}
                      variant={tempFilters.membershipTier === tier ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTempFilters({...tempFilters, membershipTier: tier})}
                      className={`transition-all duration-200 ${
                        tempFilters.membershipTier === tier
                          ? tier === 'diamond' ? 'bg-blue-500 text-white shadow-lg scale-105' :
                            tier === 'vip' ? 'bg-purple-500 text-white shadow-lg scale-105' :
                            tier === 'gold' ? 'bg-yellow-500 text-white shadow-lg scale-105' :
                            tier === 'silver' ? 'bg-gray-500 text-white shadow-lg scale-105' :
                            'bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg scale-105'
                          : `border-gray-200 hover:bg-gray-50 ${
                            tier === 'diamond' ? 'hover:border-blue-300 hover:bg-blue-50' :
                            tier === 'vip' ? 'hover:border-purple-300 hover:bg-purple-50' :
                            tier === 'gold' ? 'hover:border-yellow-300 hover:bg-yellow-50' :
                            tier === 'silver' ? 'hover:border-gray-300' : ''
                          }`
                      }`}
                    >
                      {tier === 'all' ? '🌟 ทั้งหมด' :
                       tier === 'member' ? '👤 สมาชิก' :
                       tier === 'silver' ? '🥈 Silver' :
                       tier === 'gold' ? '🥇 Gold' :
                       tier === 'vip' ? '👑 VIP' : '💎 Diamond'}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                  <Zap className="h-5 w-5 text-green-500" />
                  ตัวเลือกพิเศษ
                </h3>
                
                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-green-100 hover:bg-green-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={tempFilters.onlineOnly}
                      onChange={(e) => setTempFilters({...tempFilters, onlineOnly: e.target.checked})}
                      className="w-5 h-5 text-green-600 border-green-300 rounded focus:ring-green-500"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">แสดงเฉพาะผู้ใช้ออนไลน์</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-blue-100 hover:bg-blue-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={tempFilters.hasPhoto}
                      onChange={(e) => setTempFilters({...tempFilters, hasPhoto: e.target.checked})}
                      className="w-5 h-5 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📸</span>
                      <span className="text-sm font-medium text-gray-700">แสดงเฉพาะผู้ใช้ที่มีรูปภาพ</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                  <Heart className="h-5 w-5 text-purple-500" />
                  ไลฟ์สไตล์
                </h3>
                
                {/* สูบบุหรี่ */}
                <div className="space-y-3 mb-4">
                  <Label className="text-sm text-gray-600 flex items-center gap-2">
                    🚬 การสูบบุหรี่
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['all', 'no', 'yes', 'sometimes'].map((option) => (
                      <Button
                        key={option}
                        variant={tempFilters.lifestyle.smoking === option ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTempFilters({
                          ...tempFilters,
                          lifestyle: {...tempFilters.lifestyle, smoking: option}
                        })}
                        className={`text-xs transition-all duration-200 ${
                          tempFilters.lifestyle.smoking === option
                            ? 'bg-red-500 text-white shadow-lg scale-105'
                            : 'border-red-200 hover:border-red-300 hover:bg-red-50'
                        }`}
                      >
                        {option === 'all' ? 'ทั้งหมด' :
                         option === 'no' ? '🚭 ไม่สูบ' :
                         option === 'yes' ? '🚬 สูบ' : '💨 บางครั้ง'}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* ดื่มเหล้า */}
                <div className="space-y-3 mb-4">
                  <Label className="text-sm text-gray-600 flex items-center gap-2">
                    🍷 การดื่มเหล้า
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['all', 'no', 'yes', 'social'].map((option) => (
                      <Button
                        key={option}
                        variant={tempFilters.lifestyle.drinking === option ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTempFilters({
                          ...tempFilters,
                          lifestyle: {...tempFilters.lifestyle, drinking: option}
                        })}
                        className={`text-xs transition-all duration-200 ${
                          tempFilters.lifestyle.drinking === option
                            ? 'bg-amber-500 text-white shadow-lg scale-105'
                            : 'border-amber-200 hover:border-amber-300 hover:bg-amber-50'
                        }`}
                      >
                        {option === 'all' ? 'ทั้งหมด' :
                         option === 'no' ? '🚫 ไม่ดื่ม' :
                         option === 'yes' ? '🍷 ดื่ม' : '🎉 งานสังคม'}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* ออกกำลังกาย */}
                <div className="space-y-3">
                  <Label className="text-sm text-gray-600 flex items-center gap-2">
                    💪 การออกกำลังกาย
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['all', 'regularly', 'sometimes', 'never'].map((option) => (
                      <Button
                        key={option}
                        variant={tempFilters.lifestyle.exercise === option ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTempFilters({
                          ...tempFilters,
                          lifestyle: {...tempFilters.lifestyle, exercise: option}
                        })}
                        className={`text-xs transition-all duration-200 ${
                          tempFilters.lifestyle.exercise === option
                            ? 'bg-green-500 text-white shadow-lg scale-105'
                            : 'border-green-200 hover:border-green-300 hover:bg-green-50'
                        }`}
                      >
                        {option === 'all' ? 'ทั้งหมด' :
                         option === 'regularly' ? '🏃 สม่ำเสมอ' :
                         option === 'sometimes' ? '🚶 บางครั้ง' : '😴 ไม่ออก'}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ปุ่มด้านล่าง */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-pink-200">
            <Button
              variant="outline"
              onClick={resetFilters}
              className="flex-1 py-3 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              size="lg"
            >
              <X className="h-5 w-5 mr-2" />
              รีเซ็ตทั้งหมด
            </Button>
            <Button
              onClick={applyFilters}
              size="lg"
              className="flex-1 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 hover:from-pink-600 hover:via-purple-600 hover:to-violet-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Check className="h-5 w-5 mr-2" />
              ค้นหาเลย ({totalUsers || 0} คน)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIMatchingSystem;