import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import MediaPreview from './MediaPreview';
import { detectLinks, getMediaType } from '../utils/linkUtils';
import {
  Heart,
  Send,
  MoreVertical,
  Reply,
  Mic,
  Link,
  X,
  ArrowLeft,
  ThumbsUp,
  Laugh,
  Angry,
  Frown
} from 'lucide-react';

const RealTimeChat = ({ roomId, currentUser, onBack }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [roomInfo, setRoomInfo] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);


  
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // เชื่อมต่อ Socket.IO
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      withCredentials: true
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      
      // เข้าร่วมห้องแชท
      newSocket.emit('join-room', {
        roomId,
        userId: currentUser._id
      });
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    // รับข้อความใหม่
    newSocket.on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    // อัปเดต reaction
    newSocket.on('message-reaction-updated', (data) => {
      setMessages(prev => prev.map(msg => 
        msg._id === data.messageId 
          ? { ...msg, stats: data.stats, reactions: msg.reactions || [] }
          : msg
      ));
    });

    // Typing indicators
    newSocket.on('user-typing', (data) => {
      setTypingUsers(prev => {
        if (!prev.find(user => user.userId === data.userId)) {
          return [...prev, data];
        }
        return prev;
      });
    });

    newSocket.on('user-stop-typing', (data) => {
      setTypingUsers(prev => prev.filter(user => user.userId !== data.userId));
    });

    // Online count updates
    newSocket.on('online-count-updated', (data) => {
      setOnlineCount(data.onlineCount);
      setOnlineUsers(data.onlineUsers);
    });

    // Error handling
    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      alert(error.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [roomId, currentUser._id]);

  // โหลดข้อความเก่า
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/messages/${roomId}?userId=${currentUser._id}`,
          {
            credentials: 'include'
          }
        );
        const data = await response.json();
        
        if (data.success) {
          setMessages(data.data.messages);
          scrollToBottom();
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [roomId, currentUser._id]);

  // โหลดข้อมูลห้องแชท
  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chatroom/${roomId}?userId=${currentUser._id}`,
          {
            credentials: 'include'
          }
        );
        const data = await response.json();
        
        if (data.success) {
          setRoomInfo(data.data);
          // เริ่มต้นด้วยสมาชิกที่ออนไลน์จาก API
          const initialOnlineUsers = data.data.members.filter(member => member.isOnline);
          setOnlineUsers(initialOnlineUsers.map(member => member.id));
          setOnlineCount(initialOnlineUsers.length);
        }
      } catch (error) {
        console.error('Error fetching room info:', error);
      }
    };

    fetchRoomInfo();
  }, [roomId, currentUser._id]);



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    // ตรวจสอบระดับสมาชิกก่อนส่งข้อความ
    const userLimits = getUserMembershipLimits(currentUser.membership?.tier || 'member');
    
    if (editingMessage) {
      // แก้ไขข้อความ
      handleEditMessage(editingMessage._id, newMessage);
    } else {
      // ตรวจสอบจำนวนข้อความที่ส่งได้ตามระดับสมาชิก
      if (!canSendMessage(currentUser.membership?.tier || 'member')) {
        alert(`คุณส่งข้อความครบตามระดับสมาชิกแล้ว (${userLimits.dailyChats} ข้อความต่อวัน)`);
        return;
      }

      // ส่งข้อความใหม่
      socket.emit('send-message', {
        content: newMessage,
        senderId: currentUser._id,
        chatRoomId: roomId,
        messageType: 'text',
        replyToId: replyTo?._id
      });
    }

    setNewMessage('');
    setReplyTo(null);
    setEditingMessage(null);
    messageInputRef.current?.focus();
  };

  const getUserMembershipLimits = (tier) => {
    const limits = {
      member: { dailyChats: 5 },
      silver: { dailyChats: 15 },
      gold: { dailyChats: 50 },
      vip: { dailyChats: 100 },
      vip1: { dailyChats: 200 },
      vip2: { dailyChats: 500 },
      diamond: { dailyChats: -1 }, // unlimited
      platinum: { dailyChats: -1 } // unlimited
    };
    return limits[tier] || limits.member;
  };

  const canSendMessage = (tier) => {
    const limits = getUserMembershipLimits(tier);
    // สำหรับ demo ให้ส่งได้เสมอ (ในระบบจริงต้องเช็คจาก backend)
    return limits.dailyChats === -1 || true;
  };

  const handleReactToMessage = (messageId, reactionType = 'heart') => {
    if (!socket) return;

    // ตรวจสอบว่าผู้ใช้เคยกด reaction นี้แล้วหรือไม่
    const message = messages.find(msg => msg._id === messageId);
    if (message && message.reactions) {
      const existingReaction = message.reactions.find(
        reaction => reaction.user === currentUser._id && reaction.type === reactionType
      );
      
      if (existingReaction) {
        // ถ้ากดซ้ำ ให้ยกเลิก reaction
        socket.emit('react-message', {
          messageId,
          userId: currentUser._id,
          reactionType,
          action: 'remove'
        });
        return;
      }
    }

    // กด reaction ใหม่
    socket.emit('react-message', {
      messageId,
      userId: currentUser._id,
      reactionType,
      action: 'add'
    });
  };



  const handleEditMessage = async (messageId, newContent) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/messages/${messageId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            content: newContent,
            userId: currentUser._id
          })
        }
      );

      const data = await response.json();
      if (data.success) {
        setMessages(prev => prev.map(msg => 
          msg._id === messageId 
            ? { ...msg, content: newContent, isEdited: true, editedAt: new Date() }
            : msg
        ));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm('คุณต้องการลบข้อความนี้หรือไม่?')) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/messages/${messageId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            userId: currentUser._id
          })
        }
      );

      const data = await response.json();
      if (data.success) {
        setMessages(prev => prev.filter(msg => msg._id !== messageId));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };



  const handleTyping = () => {
    if (!socket) return;

    socket.emit('typing-start', {
      roomId,
      userId: currentUser._id,
      username: currentUser.displayName || currentUser.username
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing-stop', {
        roomId,
        userId: currentUser._id
      });
    }, 1000);
  };

  const getMembershipBadgeColor = (tier) => {
    const colors = {
      member: 'bg-gray-100 text-gray-800',
      silver: 'bg-gray-200 text-gray-900',
      gold: 'bg-yellow-100 text-yellow-800',
      vip: 'bg-purple-100 text-purple-800',
      vip1: 'bg-purple-200 text-purple-900',
      vip2: 'bg-purple-300 text-purple-900',
      diamond: 'bg-blue-100 text-blue-800',
      platinum: 'bg-indigo-100 text-indigo-800'
    };
    return colors[tier] || colors.member;
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };



  const detectLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
      if (urlRegex.test(part)) {
        // ตรวจสอบ YouTube URL
        const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
        const youtubeMatch = part.match(youtubeRegex);
        
        if (youtubeMatch) {
          const videoId = youtubeMatch[1];
          return (
            <div key={index} className="mt-2">
              <a
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 underline"
              >
                {part}
              </a>
              <div className="mt-2">
                <iframe
                  width="280"
                  height="157"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          );
        }
        
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const renderMessageContent = (message) => {
    // Text only message
    return detectLinks(message.content);
  };

  const getReactionIcon = (type) => {
    switch (type) {
      case 'heart':
        return <Heart className="h-3 w-3 text-black" />;
      case 'thumbsup':
        return <ThumbsUp className="h-3 w-3 text-black" />;
      case 'laugh':
        return <Laugh className="h-3 w-3 text-black" />;
      case 'angry':
        return <Angry className="h-3 w-3 text-black" />;
      case 'sad':
        return <Frown className="h-3 w-3 text-black" />;
      default:
        return <Heart className="h-3 w-3 text-black" />;
    }
  };

  if (!roomInfo) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดห้องแชท...</p>
        </div>
      </div>
    );
  }

    return (
    <>
      <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-violet-500 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h3 className="font-semibold text-lg">{roomInfo.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-white/90">
                  <span>{roomInfo.memberCount} สมาชิก</span>
                  <span>•</span>
                  <span className={`flex items-center ${isConnected ? 'text-green-200' : 'text-red-200'}`}>
                    <div className={`w-2 h-2 rounded-full mr-1 ${isConnected ? 'bg-green-200' : 'bg-red-200'}`}></div>
                    {isConnected ? 'เชื่อมต่อแล้ว' : 'ไม่ได้เชื่อมต่อ'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">{onlineUsers.length} ออนไลน์</span>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

                    {/* Messages Area */}
       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
         {messages.map((message, index) => (
           <div
             key={message._id}
             className={`flex ${message.sender._id === currentUser._id ? 'justify-end' : 'justify-start'} ${
               index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
             } p-2 rounded-lg`}
           >
            <div className={`flex max-w-[70%] ${message.sender._id === currentUser._id ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              <Avatar className="w-8 h-8 mx-2">
                <AvatarImage 
                  src={message.sender.profileImages?.[0]} 
                  alt={message.sender.displayName || message.sender.username} 
                />
                <AvatarFallback className="bg-gradient-to-r from-pink-400 to-violet-400 text-white text-xs">
                  {(message.sender.displayName || message.sender.username).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Message Content */}
              <div className={`flex flex-col ${message.sender._id === currentUser._id ? 'items-end' : 'items-start'}`}>
                {/* Sender Info */}
                <div className={`flex items-center space-x-2 mb-1 ${message.sender._id === currentUser._id ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <span className="text-sm font-medium text-gray-700">
                    {message.sender.displayName || message.sender.username}
                  </span>
                  <Badge className={`text-xs ${getMembershipBadgeColor(message.sender.membershipTier)}`}>
                    {message.sender.membershipTier?.toUpperCase() || 'MEMBER'}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {formatTime(message.createdAt)}
                  </span>
                </div>

                {/* Reply To */}
                {message.replyTo && (
                  <div className="bg-gray-200 rounded-lg p-2 mb-2 text-sm max-w-full">
                    <div className="text-gray-600 text-xs mb-1">
                      ตอบกลับ {message.replyTo.sender?.displayName || message.replyTo.sender?.username}
                    </div>
                    <div className="text-gray-800 truncate">
                      {message.replyTo.content}
                    </div>
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`relative rounded-2xl px-4 py-2 max-w-full break-words group ${
                    message.sender._id === currentUser._id
                      ? 'bg-gray-100 text-black'
                      : 'bg-white text-black shadow-sm border'
                  }`}
                >
                                     {renderMessageContent(message)}
                   
                   {message.isEdited && (
                     <div className="text-xs opacity-70 mt-1">
                       แก้ไขแล้ว
                     </div>
                   )}

                   {/* Message Actions - ปุ่ม Like และ Reply ใต้ข้อความ */}
                   <div className="flex items-center space-x-4 mt-2 pt-2 border-t border-gray-200">
                     {/* Like Button */}
                                           <button
                        onClick={() => handleReactToMessage(message._id, 'heart')}
                        className="flex items-center space-x-1 text-xs text-black hover:text-gray-600 transition-colors"
                      >
                       <Heart className="h-4 w-4" />
                       <span>Like</span>
                     </button>
                     
                     {/* Reply Button */}
                     <button
                       onClick={() => setReplyTo(message)}
                       className="flex items-center space-x-1 text-xs text-black hover:text-blue-500 transition-colors"
                     >
                       <Reply className="h-4 w-4" />
                       <span>Reply</span>
                     </button>
                   </div>

                                      {/* Reactions */}
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="flex items-center flex-wrap gap-1 mt-2">
                        {Object.entries(
                          message.reactions.reduce((acc, reaction) => {
                            acc[reaction.type] = (acc[reaction.type] || 0) + 1;
                            return acc;
                          }, {})
                        ).map(([type, count]) => {
                          const hasUserReacted = message.reactions.some(
                            reaction => reaction.user === currentUser._id && reaction.type === type
                          );
                          return (
                            <button
                              key={type}
                              onClick={() => handleReactToMessage(message._id, type)}
                              className={`flex items-center space-x-1 rounded-full px-2 py-1 text-xs transition-colors ${
                                hasUserReacted 
                                  ? 'bg-white/40 hover:bg-white/50' 
                                  : 'bg-white/20 hover:bg-white/30'
                              }`}
                            >
                              {getReactionIcon(type)}
                              <span>{count}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}


                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span>
              {typingUsers.map(user => user.username).join(', ')} กำลังพิมพ์...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Reply/Edit Bar */}
      {(replyTo || editingMessage) && (
        <div className="bg-blue-50 border-t border-blue-200 p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-sm font-medium text-blue-800">
                {editingMessage ? 'แก้ไขข้อความ' : `ตอบกลับ ${replyTo?.sender?.displayName || replyTo?.sender?.username}`}
              </div>
              <div className="text-sm text-blue-600 truncate">
                {editingMessage ? editingMessage.content : replyTo?.content}
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setReplyTo(null);
                setEditingMessage(null);
                setNewMessage('');
              }}
              className="text-blue-600 hover:bg-blue-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

                     {/* Input Area */}
        <div className="border-t bg-white p-4">
          <div className="flex items-center space-x-2">
            <Button size="icon" variant="ghost" className="text-gray-500 hover:text-gray-700">
              <Mic className="h-5 w-5" />
            </Button>
          
          <div className="flex-1 relative">
            <input
              ref={messageInputRef}
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={editingMessage ? 'แก้ไขข้อความ...' : 'พิมพ์ข้อความ...'}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              disabled={!isConnected}
            />
          </div>

          
          
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </Button>
                 </div>
       </div>

       </div>
     </>
   );
 };

export default RealTimeChat;