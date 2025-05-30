import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const categories = ['All', 'Orders', 'Investments', 'Settings'];

const NotificationsPage = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [notifications, setNotifications] = useState([])

  const fetchNotifications = async()=>{
    const response = await axiosInstance.get('/notifications?limit=10')
    setNotifications(response.data.data)
  }

  useEffect(()=>{
    fetchNotifications()
  },[])

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredNotifications(notifications);
    } else {
      const filtered = notifications.filter(
        not => not.category === selectedCategory.toLowerCase()
      );
      setFilteredNotifications(filtered);
    }
  }, [selectedCategory, notifications]);

  return (
    <div className="p-6 min-h-screen">
        <div className='flex items-start gap-4'>
            <svg onClick={()=>navigate('/home')} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="20" fill="#EEDDFF"/>
            <path d="M10 20H30M10 20L15.7143 26M10 20L15.7143 14" stroke="#8C55C1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h2 className="text-4xl text-[#323844] font-semibold mb-4">Notifications</h2>
        </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedCategory === cat
                ? 'bg-[#57661F] text-white'
                : 'bg-[#EBEBECCC] text-[#5B6069]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
            <div className='flex justify-center items-center'>
                <p className="text-[#D6D7DA]">No notifications available.</p>
            </div>
        ) : (
          filteredNotifications.map((noti, idx) => (
            <div
              key={idx}
              className="border-b border-[#333] pb-3 mb-3 text-sm"
            >
              <h4 className="text-lg text-[#323844] font-semibold">{noti.title}</h4>
              <p className="text-[#323844] truncate">{noti.content}</p>
              <p className="text-[#5B6069] text-xs mt-1">
                {new Date(noti.createdAt).toLocaleString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;