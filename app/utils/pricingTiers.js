// 定价层级管理工具
class PricingTiers {
  constructor() {
    this.tiers = {
      free: {
        id: 'free',
        name: '免费版',
        dailyLimit: 3,
        features: {
          basicListing: true,
          emailTemplates: true,
          videoScript: true,
          socialMedia: true,
          export: false,
          customerManagement: false,
          teamCollaboration: false,
          customBranding: false,
          prioritySupport: false,
          analytics: false,
          apiAccess: false,
          bulkGeneration: false
        },
        restrictions: {
          maxTemplates: 5,
          maxExports: 0,
          maxTeamMembers: 1,
          storageGB: 0.1
        }
      },
      starter: {
        id: 'starter',
        name: 'Starter',
        dailyLimit: 50,
        features: {
          basicListing: true,
          emailTemplates: true,
          videoScript: true,
          socialMedia: true,
          export: true,
          customerManagement: true,
          teamCollaboration: false,
          customBranding: false,
          prioritySupport: false,
          analytics: true,
          apiAccess: false,
          bulkGeneration: false
        },
        restrictions: {
          maxTemplates: 20,
          maxExports: 100,
          maxTeamMembers: 1,
          storageGB: 1
        }
      },
      pro: {
        id: 'pro',
        name: 'Pro',
        dailyLimit: 200,
        features: {
          basicListing: true,
          emailTemplates: true,
          videoScript: true,
          socialMedia: true,
          export: true,
          customerManagement: true,
          teamCollaboration: true,
          customBranding: true,
          prioritySupport: true,
          analytics: true,
          apiAccess: true,
          bulkGeneration: true
        },
        restrictions: {
          maxTemplates: -1, // unlimited
          maxExports: 1000,
          maxTeamMembers: 5,
          storageGB: 10
        }
      },
      agency: {
        id: 'agency',
        name: 'Agency',
        dailyLimit: -1, // unlimited
        features: {
          basicListing: true,
          emailTemplates: true,
          videoScript: true,
          socialMedia: true,
          export: true,
          customerManagement: true,
          teamCollaboration: true,
          customBranding: true,
          prioritySupport: true,
          analytics: true,
          apiAccess: true,
          bulkGeneration: true,
          whiteLabel: true,
          dedicatedSupport: true
        },
        restrictions: {
          maxTemplates: -1, // unlimited
          maxExports: -1, // unlimited
          maxTeamMembers: -1, // unlimited
          storageGB: -1 // unlimited
        }
      }
    }
    
    // 从localStorage获取当前用户层级，默认为免费版
    this.currentTier = this.getCurrentTier()
  }

  // 获取当前用户层级
  getCurrentTier() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userTier')
      return saved || 'free'
    }
    return 'free'
  }

  // 设置用户层级
  setUserTier(tierId) {
    if (this.tiers[tierId]) {
      this.currentTier = tierId
      if (typeof window !== 'undefined') {
        localStorage.setItem('userTier', tierId)
      }
      return true
    }
    return false
  }

  // 获取当前层级信息
  getCurrentTierInfo() {
    return this.tiers[this.currentTier]
  }

  // 检查是否有某个功能权限
  hasFeature(featureName) {
    const tierInfo = this.getCurrentTierInfo()
    return tierInfo.features[featureName] || false
  }

  // 获取每日使用限制
  getDailyLimit() {
    const tierInfo = this.getCurrentTierInfo()
    return tierInfo.dailyLimit
  }

  // 检查是否达到每日限制
  isAtDailyLimit(currentUsage) {
    const limit = this.getDailyLimit()
    if (limit === -1) return false // unlimited
    return currentUsage >= limit
  }

  // 获取剩余使用次数
  getRemainingUsage(currentUsage) {
    const limit = this.getDailyLimit()
    if (limit === -1) return -1 // unlimited
    return Math.max(0, limit - currentUsage)
  }

  // 检查是否可以使用某个功能
  canUseFeature(featureName, currentUsage = 0) {
    // 首先检查功能权限
    if (!this.hasFeature(featureName)) {
      return {
        allowed: false,
        reason: 'feature_not_available',
        message: '此功能在您当前的方案中不可用'
      }
    }

    // 检查使用限制
    if (this.isAtDailyLimit(currentUsage)) {
      return {
        allowed: false,
        reason: 'daily_limit_reached',
        message: '已达到每日使用限制'
      }
    }

    return {
      allowed: true,
      reason: 'ok',
      message: '可以使用'
    }
  }

  // 获取升级建议
  getUpgradeRecommendation(featureName) {
    const currentTierInfo = this.getCurrentTierInfo()
    
    // 找到包含该功能的最低层级
    for (const [tierId, tierInfo] of Object.entries(this.tiers)) {
      if (tierInfo.features[featureName] && tierId !== this.currentTier) {
        return {
          recommendedTier: tierId,
          tierName: tierInfo.name,
          message: `升级到 ${tierInfo.name} 以使用此功能`
        }
      }
    }
    
    return null
  }

  // 获取所有层级信息（用于定价页面）
  getAllTiers() {
    return this.tiers
  }

  // 比较两个层级
  compareTiers(tierA, tierB) {
    const tierOrder = ['free', 'starter', 'pro', 'agency']
    const indexA = tierOrder.indexOf(tierA)
    const indexB = tierOrder.indexOf(tierB)
    return indexA - indexB
  }

  // 检查是否可以降级
  canDowngrade(targetTier) {
    return this.compareTiers(targetTier, this.currentTier) < 0
  }

  // 检查是否可以升级
  canUpgrade(targetTier) {
    return this.compareTiers(targetTier, this.currentTier) > 0
  }

  // 获取功能限制信息
  getRestriction(restrictionName) {
    const tierInfo = this.getCurrentTierInfo()
    return tierInfo.restrictions[restrictionName]
  }

  // 检查是否超过限制
  isOverRestriction(restrictionName, currentValue) {
    const limit = this.getRestriction(restrictionName)
    if (limit === -1) return false // unlimited
    return currentValue >= limit
  }
}

// 创建全局实例
const pricingTiers = new PricingTiers()

export default pricingTiers