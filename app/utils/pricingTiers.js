// Pricing Tiers Management
const pricingTiers = {
  // Pricing plan configuration
  tiers: {
    free: {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'month',
      dailyLimit: 3, // 3 per feature per day
      features: {
        basicGeneration: true,
        emailCenter: false,
        videoScript: false,
        socialMedia: false,
        analytics: false,
        export: true,
        priority: 'low'
      },
      description: 'Perfect for trying out our platform',
      highlights: ['3 generations per feature daily', 'Basic content generation', 'Content export']
    },
    pro: {
      id: 'pro',
      name: 'Professional',
      price: 29,
      period: 'month',
      dailyLimit: 100, // Increased from 50
      features: {
        basicGeneration: true,
        emailCenter: true,
        videoScript: true,
        socialMedia: true,
        analytics: false,
        export: true,
        priority: 'normal'
      },
      description: 'Ideal for professionals and small teams',
      highlights: ['100 generations daily', 'All features included', 'Email marketing', 'Video scripts', 'Social media content']
    },
    team: {
      id: 'team',
      name: 'Team',
      price: 69,
      period: 'month',
      dailyLimit: 500, // New team tier with higher limits
      features: {
        basicGeneration: true,
        emailCenter: true,
        videoScript: true,
        socialMedia: true,
        analytics: true,
        export: true,
        priority: 'high',
        teamCollaboration: true,
        bulkGeneration: true
      },
      description: 'Perfect for growing teams and agencies',
      highlights: ['500 generations daily', 'Advanced analytics', 'Team collaboration', 'Bulk generation', 'Priority support']
    },
    enterprise: {
      id: 'enterprise',
      name: 'Enterprise',
      price: 199,
      period: 'month',
      dailyLimit: -1, // Unlimited
      features: {
        basicGeneration: true,
        emailCenter: true,
        videoScript: true,
        socialMedia: true,
        analytics: true,
        export: true,
        priority: 'highest',
        teamCollaboration: true,
        bulkGeneration: true,
        apiAccess: true,
        customBranding: true,
        dedicatedSupport: true
      },
      description: 'For large organizations with custom needs',
      highlights: ['Unlimited generations', 'API access', 'Custom branding', 'Dedicated support', 'White-label solution']
    }
  },

  // Get current user tier
  getCurrentTier() {
    if (typeof localStorage === 'undefined') {
      return this.tiers.free
    }
    
    try {
      const saved = localStorage.getItem('userTier')
      if (saved) {
        const tierId = JSON.parse(saved)
        return this.tiers[tierId] || this.tiers.free
      }
    } catch (error) {
      console.error('Failed to get current tier:', error)
    }
    
    return this.tiers.free
  },

  // Set user tier
  setUserTier(tierId) {
    if (!this.tiers[tierId]) {
      throw new Error('Invalid tier ID')
    }
    
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('userTier', JSON.stringify(tierId))
        return true
      } catch (error) {
        console.error('Failed to set user tier:', error)
        return false
      }
    }
    
    return false
  },

  // Get daily limit
  getDailyLimit() {
    return this.getCurrentTier().dailyLimit
  },

  // Check feature permission
  hasFeature(featureName) {
    const currentTier = this.getCurrentTier()
    return currentTier.features[featureName] || false
  },

  // Get all tiers
  getAllTiers() {
    return Object.values(this.tiers)
  },

  // Compare tiers
  compareTiers(currentTierId, targetTierId) {
    const tierOrder = ['free', 'pro', 'team', 'enterprise']
    const currentIndex = tierOrder.indexOf(currentTierId)
    const targetIndex = tierOrder.indexOf(targetTierId)
    
    return {
      isUpgrade: targetIndex > currentIndex,
      isDowngrade: targetIndex < currentIndex,
      isSame: targetIndex === currentIndex
    }
  },

  // Get upgrade recommendation
  getUpgradeRecommendation(currentUsage) {
    const currentTier = this.getCurrentTier()
    
    if (currentTier.id === 'free' && currentUsage >= currentTier.dailyLimit * 0.8) {
      return {
        recommended: this.tiers.pro,
        reason: 'You\'re approaching your free tier limit. Upgrade to Professional for more features and higher limits.'
      }
    }
    
    if (currentTier.id === 'pro' && currentUsage >= currentTier.dailyLimit * 0.8) {
      return {
        recommended: this.tiers.team,
        reason: 'Upgrade to Team plan for advanced analytics and team collaboration features.'
      }
    }

    if (currentTier.id === 'team' && currentUsage >= currentTier.dailyLimit * 0.8) {
      return {
        recommended: this.tiers.enterprise,
        reason: 'Upgrade to Enterprise for unlimited usage and premium support.'
      }
    }
    
    return null
  },

  // Calculate yearly savings
  calculateYearlySavings(tierId) {
    const tier = this.tiers[tierId]
    if (!tier || tier.price === 0) return 0
    
    const monthlyTotal = tier.price * 12
    const yearlyPrice = tier.price * 10 // 2 months free with annual billing
    return monthlyTotal - yearlyPrice
  },

  // Get feature usage limits per day for free tier
  getFeatureUsageLimits() {
    return {
      basicGeneration: 3,
      emailTemplate: 3,
      videoScript: 3,
      socialMedia: 3
    }
  }
}

export default pricingTiers