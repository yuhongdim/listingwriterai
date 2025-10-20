'use client';

import React, { useState } from 'react';

export default function ListingWriterAI() {
  const [step, setStep] = useState('home');
  const [formData, setFormData] = useState({
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    location: '',
    features: '',
    style: 'professional'
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDescription = async () => {
    setIsGenerating(true);
    
    try {
      // Mock data generation
      const mockDescriptions = {
        professional: `This well-maintained ${formData.propertyType} is located in the heart of ${formData.location}, featuring ${formData.bedrooms} bedrooms and ${formData.bathrooms} bathrooms. The ${formData.sqft} square feet of living space has been thoughtfully designed to meet the needs of modern families.\n\nProperty features include premium finishes, spacious layouts, and excellent natural light throughout. The location offers convenient access to shopping, dining, and transportation.\n\nThis is an exceptional opportunity for both investors and homeowners. Contact us today to schedule a private showing.`,
        
        luxury: `✨ Luxury Living Redefined ✨\n\nSituated in the most coveted area of ${formData.location}, this exceptional ${formData.propertyType} redefines the standard of luxury living. ${formData.bedrooms} elegant bedroom suites, ${formData.bathrooms} beautifully designed bathrooms, and ${formData.sqft} square feet of sophisticated living space.\n\n${formData.features || 'Premium amenities include gourmet kitchen, spa-like bathrooms, and high-end finishes throughout.'}\n\nExperience unparalleled luxury in this stunning property. Schedule your exclusive viewing today.`,
        
        modern: `🏡 Modern Minimalist Living 🏡\n\nThis ${formData.propertyType} in ${formData.location} perfectly combines modern design with practical functionality. ${formData.bedrooms} bedrooms and ${formData.bathrooms} bathrooms with smart layout, ${formData.sqft} square feet of open space.\n\n${formData.features || 'Clean lines, open floor plan, and contemporary finishes create the perfect modern living environment.'}\n\nDon't miss this opportunity to own a piece of modern architecture. Contact us for more information.`
      };

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const description = mockDescriptions[formData.style] || mockDescriptions.professional;
      setGeneratedContent(description);
      setStep('result');
    } catch (error) {
      console.error('Generation failed:', error);
      const fallbackDescription = `This ${formData.bedrooms}-bedroom, ${formData.bathrooms}-bathroom ${formData.propertyType} is located in ${formData.location}, with ${formData.sqft} square feet. ${formData.features ? 'Features include: ' + formData.features : ''}Don't miss this great opportunity!`;
      setGeneratedContent(fallbackDescription);
      setStep('result');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = () => {
    if (!formData.propertyType || !formData.bedrooms || !formData.bathrooms || !formData.sqft || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }
    generateDescription();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    alert('Copied to clipboard!');
  };

  // 首页
  if (step === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ListingWriterAI
              </span>
            </div>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all">
              Sign In
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              Trusted by 10,000+ Real Estate Agents
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Generate Perfect Listings<br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                in 60 Seconds
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              AI-powered property descriptions that attract buyers and close deals faster. No writing experience needed.
            </p>
            <button
              onClick={() => setStep('generator')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all"
            >
              Try Free Now 
            </button>
            <p className="text-sm text-gray-500 mt-4">No credit card required • 3 free listings</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">60s</div>
              <div className="text-gray-600">Average Generation Time</div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">10,000+</div>
              <div className="text-gray-600">Active Real Estate Agents</div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">35%</div>
              <div className="text-gray-600">Faster Sales Average</div>
            </div>
          </div>

          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-10">Simple, Transparent Pricing</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
                <div className="text-lg font-semibold text-gray-900 mb-2">Free Trial</div>
                <div className="text-4xl font-bold text-gray-900 mb-4">$0</div>
                <div className="text-gray-600 mb-6">3 listings to try</div>
                <button className="w-full px-6 py-3 bg-gray-100 text-gray-900 rounded-full hover:bg-gray-200 transition-all">
                  Start Free
                </button>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl transform scale-105 border-4 border-blue-400">
                <div className="text-lg font-semibold text-white mb-2">Unlimited</div>
                <div className="text-4xl font-bold text-white mb-4">$29<span className="text-lg">/mo</span></div>
                <div className="text-blue-100 mb-6">Unlimited listings</div>
                <button className="w-full px-6 py-3 bg-white text-blue-600 font-semibold rounded-full hover:shadow-lg transition-all">
                  Most Popular
                </button>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
                <div className="text-lg font-semibold text-gray-900 mb-2">Pay-As-You-Go</div>
                <div className="text-4xl font-bold text-gray-900 mb-4">$1<span className="text-lg">/each</span></div>
                <div className="text-gray-600 mb-6">No subscription needed</div>
                <button className="w-full px-6 py-3 bg-gray-100 text-gray-900 rounded-full hover:bg-gray-200 transition-all">
                  Buy Credits
                </button>
              </div>
            </div>
          </div>
        </div>

        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-xl font-bold">ListingWriterAI</span>
            </div>
            <p className="text-gray-400">© 2025 ListingWriterAI. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }

  // 生成器页面
  if (step === 'generator') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <button onClick={() => setStep('home')} className="flex items-center gap-2 cursor-pointer">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ListingWriterAI
              </span>
            </button>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Create Your Listing</h1>
            <p className="text-gray-600">Fill in the details below</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type *</label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select type...</option>
                  <option value="Single Family Home">Single Family Home</option>
                  <option value="Condo">Condo</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Multi-Family">Multi-Family</option>
                </select>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrooms *</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bathrooms *</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Square Feet *</label>
                  <input
                    type="number"
                    value={formData.sqft}
                    onChange={(e) => setFormData({...formData, sqft: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="2000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., Austin, TX"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Special Features</label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({...formData, features: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none h-32 resize-none"
                  placeholder="e.g., renovated kitchen, pool, hardwood floors..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Writing Style</label>
                <div className="grid grid-cols-3 gap-3">
                  {['professional', 'luxury', 'modern'].map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setFormData({...formData, style})}
                      className={`px-4 py-3 rounded-xl font-medium transition-all ${
                        formData.style === style
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-full hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Listing Description
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 结果页面
  if (step === 'result') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <button onClick={() => setStep('home')} className="flex items-center gap-2 cursor-pointer">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ListingWriterAI
              </span>
            </button>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              Generated Successfully
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Listing is Ready!</h1>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Generated Description</h2>
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
              >
                Copy to Clipboard
              </button>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{generatedContent}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setStep('generator');
                setGeneratedContent('');
              }}
              className="flex-1 px-6 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-full hover:border-blue-600 transition-all font-semibold"
            >
              Generate Another
            </button>
            <button
              onClick={() => setStep('home')}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-xl transition-all font-semibold"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }
}