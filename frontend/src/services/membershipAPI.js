import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const membershipAPI = {
  async getPremiumTiers() {
    try {
      const response = await axios.get(`${baseURL}/membership/tiers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching premium tiers:', error);
      throw error;
    }
  },

  async getCurrentUserMembership() {
    try {
      const response = await axios.get(`${baseURL}/membership/current`);
      return response.data;
    } catch (error) {
      console.error('Error fetching current user membership:', error);
      throw error;
    }
  },

  async upgradeMembership(tierId) {
    try {
      const response = await axios.post(`${baseURL}/membership/upgrade`, { tierId });
      return response.data;
    } catch (error) {
      console.error('Error upgrading membership:', error);
      throw error;
    }
  }
};

export const membershipHelpers = {
  // Tier name translations
  getTierName: (tier) => {
    const names = {
      member: 'สมาชิก',
      test: 'Test Member',
      silver: 'Silver Member',
      gold: 'Gold Member',
      vip: 'VIP Member',
      vip1: 'VIP 1',
      vip2: 'VIP 2',
      diamond: 'Diamond Member',
      platinum: 'Platinum Member'
    };
    return names[tier] || tier;
  },

  // Tier color classes
  getTierColor: (tier) => {
    const colors = {
      member: 'text-slate-600',
      test: 'text-emerald-500',
      silver: 'text-slate-500',
      gold: 'text-yellow-500',
      vip: 'text-purple-500',
      vip1: 'text-pink-500',
      vip2: 'text-amber-500',
      diamond: 'text-cyan-500',
      platinum: 'text-indigo-500'
    };
    return colors[tier] || 'text-gray-500';
  }
};
