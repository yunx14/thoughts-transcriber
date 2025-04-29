'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';

export default function UserProfile() {
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-blue-100 text-blue-500 p-2 rounded-full mr-3">
            <FaUser />
          </div>
          <div>
            <p className="font-medium">{user.email}</p>
            <p className="text-sm text-gray-500">Account ID: {user.id.substring(0, 6)}...</p>
          </div>
        </div>
        
        <button
          onClick={handleSignOut}
          className="flex items-center text-red-500 hover:text-red-700"
        >
          <FaSignOutAlt className="mr-1" /> Sign Out
        </button>
      </div>
    </div>
  );
} 