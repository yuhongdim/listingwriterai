'use client';

import { useState } from 'react';
import { useSettings } from '../hooks/useStorage';
import { Settings as SettingsIcon, User, Bell, Palette, Globe, Save, Shield } from 'lucide-react';

const Settings = () => {
  const { settings, updateSettings, loading } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSettingChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await updateSettings(localSettings);
      if (success) {
        setSaveMessage('Settings saved successfully');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Failed to save, please try again');
      }
    } catch (error) {
      setSaveMessage('Failed to save, please try again');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <SettingsIcon className="h-8 w-8 mr-3 text-blue-600" />
          Settings
        </h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-6">
        {/* 个人资料设置 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-gray-600" />
            Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your display name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
          </div>
        </div>

        {/* 外观设置 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Palette className="h-5 w-5 mr-2 text-gray-600" />
            Appearance
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <div className="flex space-x-4">
                {['light', 'dark', 'auto'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => handleSettingChange('theme', theme)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      localSettings.theme === theme
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'Auto'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Globe className="h-5 w-5 mr-2 text-gray-600" />
            Language & Region
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interface Language
            </label>
            <select
              value={localSettings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="zh-CN">Simplified Chinese</option>
              <option value="en-US">English</option>
              <option value="ja-JP">Japanese</option>
            </select>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-gray-600" />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Desktop Notifications</h3>
                <p className="text-sm text-gray-500">Receive important updates and reminders</p>
              </div>
              <button
                onClick={() => handleSettingChange('notifications', !localSettings.notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.notifications ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Auto Save</h3>
                <p className="text-sm text-gray-500">Automatically save your work content</p>
              </div>
              <button
                onClick={() => handleSettingChange('autoSave', !localSettings.autoSave)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.autoSave ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.autoSave ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 隐私和安全 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-gray-600" />
            Privacy & Security
          </h2>
          <div className="space-y-4">
            <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Change Password</div>
              <div className="text-sm text-gray-500">Update your account password</div>
            </button>
            <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Data Export</div>
              <div className="text-sm text-gray-500">Download all your data</div>
            </button>
            <button className="w-full text-left px-4 py-3 border border-red-200 rounded-xl hover:bg-red-50 transition-colors text-red-600">
              <div className="font-medium">Delete Account</div>
              <div className="text-sm text-red-500">Permanently delete your account and all data</div>
            </button>
          </div>
        </div>

        {/* 保存按钮 */}
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-6">
          <div>
            {saveMessage && (
              <p className={`text-sm ${saveMessage.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                {saveMessage}
              </p>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;