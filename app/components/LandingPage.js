'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  TrendingUp, 
  Zap,
  FileText,
  Mail,
  Video,
  Share2,
  BarChart3,
  Shield,
  Clock,
  Globe,
  Award,
  MessageSquare,
  Target,
  Sparkles
} from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isYearly, setIsYearly] = useState(false);

  const features = [
    {
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      title: "AI-Powered Listing Copy",
      description: "Generate compelling property descriptions automatically using advanced AI technology to boost exposure and conversion rates",
      details: "Supports multiple property types, styles, and selling points to create professional, engaging listing copy"
    },
    {
      icon: <Mail className="w-8 h-8 text-green-600" />,
      title: "Email Marketing Automation",
      description: "Smart email template generation with bulk sending and real-time tracking of open and click rates",
      details: "Personalized email content to improve client engagement and conversion effectiveness"
    },
    {
      icon: <Video className="w-8 h-8 text-purple-600" />,
      title: "Video Script Creation",
      description: "Create professional scripts for real estate videos, optimized for multiple platforms and target audiences",
      details: "Supports content creation for YouTube, TikTok, Instagram, and other video platforms"
    },
    {
      icon: <Share2 className="w-8 h-8 text-orange-600" />,
      title: "Social Media Content",
      description: "Generate real estate marketing content optimized for all major social media platforms with one click",
      details: "Covers Facebook, Instagram, Twitter, LinkedIn, and other mainstream social media platforms"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Senior Real Estate Agent",
      company: "Coldwell Banker",
      content: "After using ListingWriter AI, my listing copy quality improved significantly. Client inquiries increased by 40%, and my work efficiency has greatly improved.",
      rating: 5,
      avatar: "👩‍💼"
    },
    {
      name: "Michael Chen",
      role: "Brokerage Director",
      company: "RE/MAX",
      content: "This tool helped our team standardize marketing content. New agents can get up to speed quickly, and overall performance has improved noticeably.",
      rating: 5,
      avatar: "👨‍💼"
    },
    {
      name: "David Rodriguez",
      role: "Independent Agent",
      company: "Self-Employed",
      content: "As an independent agent, this AI tool is like having a professional copywriter assistant, saving me tons of time to focus on client service.",
      rating: 5,
      avatar: "👨‍🏢"
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: { monthly: 0, yearly: 0 },
      description: "Perfect for getting started",
      features: [
        "3 AI generations per feature per day",
        "Basic listing templates",
        "Standard email templates",
        "Community support"
      ],
      limitations: [
        "Limited features",
        "No premium templates",
        "No analytics"
      ],
      popular: false,
      buttonText: "Get Started Free",
      buttonStyle: "border border-gray-300 text-gray-700 hover:bg-gray-50"
    },
    {
      name: "Professional",
      price: { monthly: 29, yearly: 290 },
      description: "Perfect for professional agents",
      features: [
        "100 AI generations per day",
        "All content templates",
        "Bulk email sending",
        "Email tracking & analytics",
        "Video script generation",
        "Priority customer support"
      ],
      limitations: [],
      popular: true,
      buttonText: "Upgrade Now",
      buttonStyle: "bg-blue-600 text-white hover:bg-blue-700"
    },
    {
      name: "Team",
      price: { monthly: 69, yearly: 690 },
      description: "Ideal for real estate teams",
      features: [
        "500 AI generations per day",
        "Team collaboration features",
        "Advanced analytics dashboard",
        "Custom templates",
        "API access",
        "Dedicated account manager"
      ],
      limitations: [],
      popular: false,
      buttonText: "Contact Sales",
      buttonStyle: "border border-blue-600 text-blue-600 hover:bg-blue-50"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Users", icon: <Users className="w-6 h-6" /> },
    { number: "500,000+", label: "Generated Listings", icon: <FileText className="w-6 h-6" /> },
    { number: "95%", label: "Satisfaction Rate", icon: <Star className="w-6 h-6" /> },
    { number: "40%", label: "Efficiency Boost", icon: <TrendingUp className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Real Estate Marketing Solutions
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Supercharge Your Real Estate Marketing
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                with AI
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              ListingWriter AI is the intelligent marketing tool designed specifically for real estate professionals. 
              Using advanced AI technology, we help you quickly generate professional property descriptions, 
              email templates, video scripts, and social media content to double your marketing effectiveness 
              and drive continuous growth in your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={onGetStarted}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center group"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors">
                Watch Demo Video
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4 text-blue-600">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Marketing Success
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI technology covers every aspect of real estate marketing, from content creation to client engagement, 
              comprehensively enhancing your marketing effectiveness
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`p-6 rounded-xl cursor-pointer transition-all ${
                    activeFeature === index 
                      ? 'bg-white shadow-lg border-l-4 border-blue-600' 
                      : 'bg-white/50 hover:bg-white hover:shadow-md'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {feature.description}
                      </p>
                      {activeFeature === index && (
                        <p className="text-sm text-blue-600 font-medium">
                          {feature.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="lg:pl-8">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-center">
                    {features[activeFeature].icon}
                    <p className="mt-4 text-lg font-semibold text-gray-700">
                      {features[activeFeature].title}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span>Intelligent Content Generation</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span>Multi-Platform Optimization</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span>Real-Time Performance Tracking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get Started in Three Simple Steps
            </h2>
            <p className="text-xl text-gray-600">
              Easy-to-use workflow that gets you up and running quickly to boost your marketing results immediately
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Enter Property Details</h3>
              <p className="text-gray-600">
                Simply fill in basic property information including location, layout, features, and key selling points
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Content Generation</h3>
              <p className="text-gray-600">
                AI analyzes property characteristics and automatically generates professional marketing copy and multimedia content
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Publish & Promote</h3>
              <p className="text-gray-600">
                One-click publishing of generated content across all major platforms to start your high-impact marketing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Real User Testimonials
            </h2>
            <p className="text-xl text-gray-600">
              See how other real estate professionals boost their performance with our AI tools
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="text-3xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                    <div className="text-sm text-blue-600">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Plan
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Flexible pricing plans to meet the needs of users at different scales
            </p>
            
            <div className="flex items-center justify-center mb-8">
              <span className={`mr-3 ${!isYearly ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isYearly ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isYearly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`ml-3 ${isYearly ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                Yearly
              </span>
              {isYearly && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Save 20%
                </span>
              )}
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`relative rounded-2xl p-8 ${
                  plan.popular 
                    ? 'bg-blue-50 border-2 border-blue-200 shadow-xl' 
                    : 'bg-white border border-gray-200 shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${isYearly ? plan.price.yearly : plan.price.monthly}
                    </span>
                    <span className="text-gray-500">
                      /{isYearly ? 'year' : 'month'}
                    </span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={onGetStarted}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Real Estate Marketing?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of real estate professionals who are already using AI to boost their marketing success
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onGetStarted}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ListingWriter AI</h3>
              <p className="text-gray-400">
                Empowering real estate professionals with AI-driven marketing solutions
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ListingWriter AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;