'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ChevronRight, Zap, GitBranch, TrendingUp, Check, ArrowRight, X, AlertCircle, LineChart, GitPullRequest, RefreshCw, AlertOctagon, GitCommit, BarChart, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Define proper TypeScript interfaces
interface DetectedIssue {
  id: string;
  type: string;
  confidence: number;
  commit: string;
  description: string;
}

interface SuggestedPR {
  id: string;
  title: string;
  status: 'pending' | 'ready';
  changes: string;
}

interface MetricData {
  time: string;
  responseTime: number;
  errorRate: number;
  throughput: number;
}

interface DemoData {
  metricsData: MetricData[];
  detectedIssues: DetectedIssue[];
  suggestedPRs: SuggestedPR[];
}

export default function Home() {
  const [serviceName, setServiceName] = useState('');
  const [metricsUrl, setMetricsUrl] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [enableCorrelation, setEnableCorrelation] = useState(true);
  const [allowPR, setAllowPR] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  
  // Properly typed demo data state
  const [demoData, setDemoData] = useState<DemoData>({
    metricsData: [],
    detectedIssues: [],
    suggestedPRs: []
  });

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleConnect = async () => {
    if (!serviceName || !metricsUrl || !githubRepo) {
      alert('Please fill in all required fields');
      return;
    }

    setIsConnecting(true);
    
    try {
      const payload = {
        name: serviceName,
        metricsUrl: metricsUrl,
        repoUrl: githubRepo
      };

      console.log('Sending payload:', payload);

      const response = await axios.post('http://localhost:5000/api/register-service', payload, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Service registered successfully:', response.data);
      
      // Store service info in localStorage for dashboard access
      localStorage.setItem('currentService', JSON.stringify({
        id: response.data.id || Date.now().toString(),
        name: serviceName,
        metricsUrl: metricsUrl,
        repoUrl: githubRepo,
        registeredAt: new Date().toISOString()
      }));

      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Error registering service:', error);
      
      // For development: simulate success and redirect even if API fails
      console.log('Simulating success for development...');
      
      // Store mock service data
      localStorage.setItem('currentService', JSON.stringify({
        id: Date.now().toString(),
        name: serviceName,
        metricsUrl: metricsUrl,
        repoUrl: githubRepo,
        registeredAt: new Date().toISOString()
      }));

      // Redirect to dashboard
      router.push('/dashboard');
      
    } finally {
      setIsConnecting(false);
    }
  };

  const handleGetStarted = () => {
    // Scroll to connect section
    document.getElementById('connect-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewDemo = () => {
    setShowDemo(true);
    // Generate demo data with proper typing
    const mockMetrics: MetricData[] = Array.from({ length: 30 }, (_, i) => ({
      time: `2024-01-${String(i + 1).padStart(2, '0')} 12:00`,
      responseTime: Math.random() * 200 + 50,
      errorRate: Math.random() * 5,
      throughput: Math.random() * 1000 + 500
    }));

    const mockIssues: DetectedIssue[] = [
      { 
        id: '1', 
        type: 'Performance Regression', 
        confidence: 95, 
        commit: 'a1b2c3d', 
        description: 'Response time increased by 200% after deployment' 
      },
      { 
        id: '2', 
        type: 'Error Spike', 
        confidence: 87, 
        commit: 'e4f5g6h', 
        description: 'Error rate jumped from 0.5% to 4.2%' 
      },
      { 
        id: '3', 
        type: 'Memory Leak', 
        confidence: 72, 
        commit: 'i7j8k9l', 
        description: 'Memory usage growing 2MB/hour' 
      }
    ];

    const mockPRs: SuggestedPR[] = [
      { id: '1', title: 'Fix: Optimize database query in UserService', status: 'pending', changes: '+12 -8' },
      { id: '2', title: 'Fix: Add null check in processPayment', status: 'ready', changes: '+4 -2' }
    ];

    setDemoData({
      metricsData: mockMetrics,
      detectedIssues: mockIssues,
      suggestedPRs: mockPRs
    });
  };

  const runDemoStep = () => {
    if (demoStep < 4) {
      setDemoStep(prev => prev + 1);
    }
  };

  const resetDemo = () => {
    setDemoStep(0);
  };

  const simulateIssueDetection = () => {
    setDemoStep(2);
    setTimeout(() => setDemoStep(3), 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
      {/* Demo Modal - Updated to match original UI */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-gray-900 to-black rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-yellow-500/20 shadow-2xl shadow-yellow-500/10"
          >
            {/* Demo Header - Matches landing page header style */}
            <div className="flex justify-between items-center p-6 border-b border-yellow-500/10 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                  <Zap className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    DEVHOPS Demo
                  </h2>
                  <p className="text-sm" style={{ color: '#e0e0e0' }}>Interactive product demonstration</p>
                </div>
              </div>
              <button
                onClick={() => setShowDemo(false)}
                className="p-2 hover:bg-yellow-500/10 rounded-xl transition-all duration-300 hover:scale-110"
                style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}
              >
                <X className="w-5 h-5" style={{ color: '#d4af37' }} />
              </button>
            </div>

            {/* Demo Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Panel - Steps */}
                <div className="lg:col-span-1 space-y-8">
                  <div 
                    className="rounded-2xl p-8"
                    style={{
                      backgroundColor: 'rgba(18, 18, 18, 0.6)',
                      border: '1px solid rgba(212, 175, 55, 0.15)',
                    }}
                  >
                    <h3 className="font-bold mb-6 text-lg" style={{ color: '#f4d03f' }}>Demo Steps</h3>
                    <div className="space-y-4">
                      {[
                        { step: 1, title: 'Monitor Metrics', description: 'Real-time metrics visualization', icon: LineChart },
                        { step: 2, title: 'Detect Issues', description: 'Automatic anomaly detection', icon: AlertCircle },
                        { step: 3, title: 'Correlate Commits', description: 'Link issues to code changes', icon: GitBranch },
                        { step: 4, title: 'Propose Fixes', description: 'Automated PR generation', icon: GitPullRequest },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={item.step}
                            className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer group ${
                              demoStep >= item.step 
                                ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-500/10 border border-yellow-500/30' 
                                : 'bg-gray-900/50 border border-gray-800 hover:border-yellow-500/20'
                            }`}
                            onClick={() => demoStep >= item.step && setDemoStep(item.step)}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                              demoStep >= item.step 
                                ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/30' 
                                : 'bg-gray-800 group-hover:bg-gray-700'
                            }`}>
                              <Icon className={`w-5 h-5 transition-all duration-300 ${
                                demoStep >= item.step ? 'text-black' : 'text-gray-400 group-hover:text-yellow-500'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className={`font-semibold transition-all duration-300 ${
                                demoStep >= item.step ? 'text-yellow-400' : 'text-gray-300 group-hover:text-white'
                              }`}>
                                {item.title}
                              </div>
                              <div className="text-sm transition-all duration-300" style={{ 
                                color: demoStep >= item.step ? '#e0e0e0' : '#a0a0a0' 
                              }}>
                                {item.description}
                              </div>
                            </div>
                            {demoStep >= item.step && (
                              <Check className="w-5 h-5 text-green-500" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div 
                    className="rounded-2xl p-8"
                    style={{
                      backgroundColor: 'rgba(18, 18, 18, 0.6)',
                      border: '1px solid rgba(212, 175, 55, 0.15)',
                    }}
                  >
                    <h3 className="font-bold mb-6 text-lg" style={{ color: '#f4d03f' }}>Controls</h3>
                    <div className="space-y-4">
                      <button
                        onClick={runDemoStep}
                        disabled={demoStep >= 4}
                        className="w-full py-4 px-6 rounded-xl font-bold text-black transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
                        style={{
                          background: demoStep >= 4 
                            ? 'linear-gradient(135deg, #333333 0%, #666666 100%)' 
                            : 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                          boxShadow: demoStep < 4 ? '0 10px 30px rgba(212, 175, 55, 0.3)' : 'none',
                        }}
                        onMouseEnter={(e) => {
                          if (demoStep < 4) {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 15px 40px rgba(212, 175, 55, 0.4)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (demoStep < 4) {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(212, 175, 55, 0.3)';
                          }
                        }}
                      >
                        {demoStep === 0 ? 'Start Demo' : demoStep < 4 ? 'Next Step' : 'Demo Complete'}
                        {demoStep < 4 && <ArrowRight className="w-5 h-5" />}
                      </button>
                      
                      <button
                        onClick={simulateIssueDetection}
                        disabled={demoStep < 1}
                        className="w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
                        style={{
                          backgroundColor: 'rgba(212, 175, 55, 0.1)',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                          color: '#f4d03f',
                        }}
                        onMouseEnter={(e) => {
                          if (demoStep >= 1) {
                            e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (demoStep >= 1) {
                            e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }
                        }}
                      >
                        <AlertCircle className="w-5 h-5" />
                        Simulate Issue Detection
                      </button>
                      
                      <button
                        onClick={resetDemo}
                        className="w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#e0e0e0',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <RefreshCw className="w-5 h-5" />
                        Reset Demo
                      </button>
                    </div>
                  </div>
                </div>

                {/* Middle Panel - Metrics Visualization */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Metrics Chart */}
                  <div 
                    className="rounded-2xl p-8"
                    style={{
                      backgroundColor: 'rgba(18, 18, 18, 0.6)',
                      border: '1px solid rgba(212, 175, 55, 0.15)',
                    }}
                  >
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="font-bold text-xl" style={{ color: '#f4d03f' }}>Live Metrics Dashboard</h3>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(0, 255, 0, 0.1)' }}>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-semibold" style={{ color: '#00ff00' }}>LIVE</span>
                      </div>
                    </div>
                    
                    {/* Simulated metrics chart */}
                    <div 
                      className="h-48 mb-8 p-6 rounded-xl"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(212, 175, 55, 0.1)',
                      }}
                    >
                      <div className="h-full flex items-end gap-1.5">
                        {demoData.metricsData.slice(0, 24).map((metric, idx) => {
                          const height = (metric.responseTime / 250) * 100;
                          const isAnomaly = demoStep >= 2 && idx > 18;
                          
                          return (
                            <div
                              key={idx}
                              className="flex-1 rounded-t transition-all duration-500 hover:opacity-80 relative group"
                              style={{ 
                                height: `${height}%`,
                                background: isAnomaly 
                                  ? 'linear-gradient(to top, rgba(239, 68, 68, 0.7), rgba(239, 68, 68, 0.3))'
                                  : 'linear-gradient(to top, rgba(212, 175, 55, 0.7), rgba(212, 175, 55, 0.3))',
                              }}
                            >
                              {isAnomaly && (
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="px-2 py-1 rounded text-xs font-bold text-white bg-red-500 whitespace-nowrap">
                                    ⚠️ Anomaly Detected
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Metrics Stats */}
                    <div className="grid grid-cols-3 gap-6">
                      <div 
                        className="p-6 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                        style={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.4)',
                          border: '1px solid rgba(212, 175, 55, 0.1)',
                        }}
                      >
                        <div className="text-sm mb-2" style={{ color: '#e0e0e0' }}>Avg Response Time</div>
                        <div className="text-2xl font-bold mb-1">142ms</div>
                        <div className={`text-sm font-semibold ${demoStep >= 2 ? 'text-red-400' : 'text-green-400'}`}>
                          {demoStep >= 2 ? '↑ 65% from baseline' : 'Stable'}
                        </div>
                      </div>
                      
                      <div 
                        className="p-6 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                        style={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.4)',
                          border: '1px solid rgba(212, 175, 55, 0.1)',
                        }}
                      >
                        <div className="text-sm mb-2" style={{ color: '#e0e0e0' }}>Error Rate</div>
                        <div className="text-2xl font-bold mb-1">3.2%</div>
                        <div className={`text-sm font-semibold ${demoStep >= 2 ? 'text-red-400' : 'text-green-400'}`}>
                          {demoStep >= 2 ? '↑ 280% from baseline' : 'Normal'}
                        </div>
                      </div>
                      
                      <div 
                        className="p-6 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                        style={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.4)',
                          border: '1px solid rgba(212, 175, 55, 0.1)',
                        }}
                      >
                        <div className="text-sm mb-2" style={{ color: '#e0e0e0' }}>Throughput</div>
                        <div className="text-2xl font-bold mb-1">872 req/s</div>
                        <div className="text-sm font-semibold text-green-400">Stable</div>
                      </div>
                    </div>
                  </div>

                  {/* Detected Issues */}
                  {demoStep >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl p-8"
                      style={{
                        backgroundColor: 'rgba(18, 18, 18, 0.6)',
                        border: '1px solid rgba(212, 175, 55, 0.15)',
                      }}
                    >
                      <h3 className="font-bold text-xl mb-6" style={{ color: '#f4d03f' }}>🚨 Detected Issues</h3>
                      <div className="space-y-4">
                        {demoData.detectedIssues.map((issue: DetectedIssue) => (
                          <div 
                            key={issue.id} 
                            className="p-6 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                            style={{
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                            }}
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="font-semibold text-lg">{issue.type}</div>
                              <div className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
                                {issue.confidence}% confidence
                              </div>
                            </div>
                            <p className="mb-4" style={{ color: '#e0e0e0' }}>{issue.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <GitCommit className="w-4 h-4" style={{ color: '#d4af37' }} />
                                <span style={{ color: '#a0a0a0' }}>Commit:</span>
                                <code className="text-yellow-400 font-bold">{issue.commit}</code>
                              </div>
                              {demoStep >= 3 && (
                                <button 
                                  className="text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all duration-300"
                                  style={{ color: '#f4d03f' }}
                                >
                                  View Details <ExternalLink className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Suggested PRs */}
                  {demoStep >= 4 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl p-8"
                      style={{
                        backgroundColor: 'rgba(18, 18, 18, 0.6)',
                        border: '1px solid rgba(212, 175, 55, 0.15)',
                      }}
                    >
                      <h3 className="font-bold text-xl mb-6" style={{ color: '#f4d03f' }}>✅ Suggested Fixes</h3>
                      <div className="space-y-4">
                        {demoData.suggestedPRs.map((pr: SuggestedPR) => (
                          <div 
                            key={pr.id} 
                            className="p-6 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                            style={{
                              backgroundColor: pr.status === 'ready' 
                                ? 'rgba(34, 197, 94, 0.1)' 
                                : 'rgba(245, 158, 11, 0.1)',
                              border: pr.status === 'ready' 
                                ? '1px solid rgba(34, 197, 94, 0.3)' 
                                : '1px solid rgba(245, 158, 11, 0.3)',
                            }}
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="font-semibold text-lg">{pr.title}</div>
                              <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                                pr.status === 'ready' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {pr.status === 'ready' ? 'Ready to Merge' : 'Pending Review'}
                              </div>
                            </div>
                            <div className="flex items-center gap-6 mb-4">
                              <div className="flex items-center gap-2">
                                <span className="text-green-400 font-bold">+{pr.changes.split(' ')[0]}</span>
                                <span className="text-red-400 font-bold">-{pr.changes.split(' ')[2]}</span>
                              </div>
                              <div style={{ color: '#a0a0a0' }}>•</div>
                              <div style={{ color: '#e0e0e0' }}>Estimated fix time: 15 minutes</div>
                            </div>
                            <div className="flex gap-3">
                              <button 
                                className="px-6 py-3 rounded-xl font-semibold text-black transition-all duration-300 hover:scale-105 active:scale-95 flex-1"
                                style={{
                                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                }}
                              >
                                Approve & Merge
                              </button>
                              <button 
                                className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 flex-1"
                                style={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                  color: '#e0e0e0',
                                }}
                              >
                                Review Changes
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Animated Background Gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #d4af37 0%, transparent 70%)',
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #f4d03f 0%, transparent 70%)',
            transform: `translateY(${scrollY * -0.3}px)`,
          }}
        />
      </div>

      {/* HEADER */}
      <header
        className="relative border-b transition-all duration-500"
        style={{
          borderColor: scrollY > 50 ? 'rgba(212, 175, 55, 0.12)' : 'rgba(212, 175, 55, 0.05)',
          backgroundColor: scrollY > 50 ? 'rgba(0, 0, 0, 0.7)' : 'transparent',
          backdropFilter: scrollY > 50 ? 'blur(10px)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer transition-transform hover:scale-105">
            <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <span className="text-lg font-bold tracking-tighter bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              DEVHOPS
            </span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm">
            {['How it works', 'Features', 'Pricing'].map((item, idx) => (
              <a
                key={idx}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="transition-colors duration-300 hover:text-yellow-500"
                style={{ color: '#e0e0e0' }}
              >
                {item}
              </a>
            ))}
          </nav>
          <button className="px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm text-black"
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Start Free Trial
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-6 py-28 text-center">
        <div className="space-y-6 animate-slide-up">
          <div className="inline-block">
            <div
              className="px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-300 cursor-pointer hover:border-yellow-500"
              style={{
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                borderColor: 'rgba(212, 175, 55, 0.3)',
                color: '#f4d03f',
              }}
            >
              ⚡ Production Regression Detection
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
            <span className="block mb-2">When production</span>
            <span className="block mb-2">breaks, DEVHOPS</span>
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              finds the commit.
            </span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: '#e0e0e0' }}>
            Connect your metrics and GitHub repository. DEVHOPS detects regressions, correlates them with code changes, and proposes fixes automatically.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 rounded-xl font-semibold text-black flex items-center justify-center gap-2 transition-all duration-300 text-base"
              style={{
                background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Get Started Now <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleViewDemo}
              className="px-8 py-4 rounded-xl font-semibold transition-all duration-300 text-base flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                borderColor: 'rgba(212, 175, 55, 0.3)',
                color: '#f4d03f',
                border: '1px solid rgba(212, 175, 55, 0.3)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)'}
            >
              View Demo <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Detection Speed', value: '<30s', icon: Zap },
            { label: 'Accuracy Rate', value: '99.2%', icon: Check },
            { label: 'Commits Analyzed', value: '1M+', icon: GitBranch },
            { label: 'Mean Time to Fix', value: '-67%', icon: TrendingUp },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="glass p-6 rounded-2xl transition-all duration-500 hover:scale-105 cursor-pointer group"
                style={{
                  backgroundColor: 'rgba(18, 18, 18, 0.4)',
                  borderColor: 'rgba(212, 175, 55, 0.12)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.25)';
                  e.currentTarget.style.backgroundColor = 'rgba(26, 26, 26, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.12)';
                  e.currentTarget.style.backgroundColor = 'rgba(18, 18, 18, 0.4)';
                }}
              >
                <Icon className="w-6 h-6 mb-3 group-hover:text-yellow-500 transition-colors" style={{ color: '#d4af37' }} />
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm" style={{ color: '#a0a0a0' }}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CONNECT SECTION */}
      <section id="connect-section" className="relative max-w-5xl mx-auto px-6 py-20">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">Start monitoring now</h2>
            <p style={{ color: '#cbd5e1' }}>Set up DEVHOPS in under 5 minutes</p>
          </div>

          <div
            className="glass p-10 rounded-3xl space-y-8"
            style={{
              backgroundColor: 'rgba(18, 18, 18, 0.5)',
              borderColor: 'rgba(212, 175, 55, 0.15)',
            }}
          >
            {/* Service Name */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gradient-accent flex items-center justify-center text-xs font-bold text-white">
                  1
                </span>
                Service Name
              </label>
              <input
                type="text"
                placeholder="payments, auth-service, user-api"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full px-5 py-4 rounded-xl text-sm transition-all duration-300 focus:outline-none"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  borderColor: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.15)',
                  color: '#ffffff',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.15)';
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                }}
              />
            </div>

            {/* Metrics URL */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gradient-accent flex items-center justify-center text-xs font-bold text-white">
                  2
                </span>
                Metrics endpoint URL
              </label>
              <input
                type="url"
                placeholder="https://your-service.com/metrics"
                value={metricsUrl}
                onChange={(e) => setMetricsUrl(e.target.value)}
                className="w-full px-5 py-4 rounded-xl text-sm transition-all duration-300 focus:outline-none"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  borderColor: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.15)',
                  color: '#ffffff',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.15)';
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                }}
              />
            </div>

            {/* GitHub Repo */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gradient-accent flex items-center justify-center text-xs font-bold text-white">
                  3
                </span>
                GitHub repository URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/org/repo"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                className="w-full px-5 py-4 rounded-xl text-sm transition-all duration-300 focus:outline-none"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  borderColor: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.15)',
                  color: '#ffffff',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.15)';
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                }}
              />
            </div>

            {/* Options */}
            <div className="space-y-4 pt-4">
              <label className="flex items-center gap-4 cursor-pointer group transition-all">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={enableCorrelation}
                    onChange={(e) => setEnableCorrelation(e.target.checked)}
                    className="w-5 h-5 rounded accent-yellow-500 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="font-medium text-sm group-hover:text-yellow-400 transition-colors">
                    Enable deployment correlation
                  </div>
                  <div className="text-xs" style={{ color: '#a0a0a0' }}>
                    Automatically correlate metric anomalies with deployments
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-4 cursor-pointer group transition-all">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={allowPR}
                    onChange={(e) => setAllowPR(e.target.checked)}
                    className="w-5 h-5 rounded accent-yellow-500 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="font-medium text-sm group-hover:text-yellow-400 transition-colors">
                    Allow pull request creation
                  </div>
                  <div className="text-xs" style={{ color: '#a0a0a0' }}>
                    DEVHOPS can create PRs with proposed fixes automatically
                  </div>
                </div>
              </label>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleConnect}
              disabled={isConnecting || !serviceName || !metricsUrl || !githubRepo}
              className="w-full py-4 px-6 rounded-xl font-semibold text-black transition-all duration-300 flex items-center justify-center gap-2"
              style={{
                background: isConnecting
                  ? 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)'
                  : 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                opacity: isConnecting || !serviceName || !metricsUrl || !githubRepo ? 0.7 : 1,
              }}
            >
              {isConnecting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  Connect & Start Analyzing <Zap className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">How it works</h2>
          <p style={{ color: '#e0e0e0' }}>Five simple steps to regression-free production</p>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {[
            { title: 'Monitor', desc: 'Continuously reads metrics', icon: TrendingUp },
            { title: 'Baseline', desc: 'Learns normal behavior', icon: Check },
            { title: 'Detect', desc: 'Identifies anomalies', icon: Zap },
            { title: 'Correlate', desc: 'Matches commits', icon: GitBranch },
            { title: 'Fix', desc: 'Proposes PR fixes', icon: ArrowRight },
          ].map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative group">
                <div
                  className="glass p-6 rounded-2xl text-center space-y-4 transition-all duration-500 hover:scale-105 h-full"
                  style={{
                    backgroundColor: 'rgba(18, 18, 18, 0.4)',
                    borderColor: 'rgba(212, 175, 55, 0.12)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.25)';
                    e.currentTarget.style.backgroundColor = 'rgba(26, 26, 26, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.12)';
                    e.currentTarget.style.backgroundColor = 'rgba(18, 18, 18, 0.4)';
                  }}
                >
                  <Icon className="w-8 h-8 mx-auto" style={{ color: '#d4af37' }} />
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm" style={{ color: '#a0a0a0' }}>
                    {step.desc}
                  </p>
                </div>
                {idx < 4 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">What you get</h2>
          <p style={{ color: '#e0e0e0' }}>Everything you need to fix regressions faster</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            { title: 'Ranked Suspects', desc: 'Commits ranked by confidence with detailed impact analysis' },
            { title: 'AI-Powered Insights', desc: 'Plain-English explanations of why changes are risky' },
            { title: 'Proposed Fixes', desc: 'Concrete code suggestions to address regressions' },
            { title: 'GitHub Integration', desc: 'Automated PR creation with ready-to-merge solutions' },
            { title: 'Real-Time Alerts', desc: 'Instant notifications when regressions are detected' },
            { title: 'Correlation Engine', desc: 'Advanced algorithms matching metrics to code changes' },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="glass p-8 rounded-2xl space-y-4 transition-all duration-500 hover:scale-105 group"
              style={{
                backgroundColor: 'rgba(18, 18, 18, 0.4)',
                borderColor: 'rgba(212, 175, 55, 0.12)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.25)';
                e.currentTarget.style.backgroundColor = 'rgba(26, 26, 26, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.12)';
                e.currentTarget.style.backgroundColor = 'rgba(18, 18, 18, 0.4)';
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                <Check className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p style={{ color: '#e0e0e0' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="relative border-t mt-20 py-16"
        style={{ borderColor: 'rgba(212, 175, 55, 0.08)' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-gradient-accent flex items-center justify-center">
                  <Zap className="w-4 h-4 text-black" />
                </div>
                <span className="font-bold">DEVHOPS</span>
              </div>
              <p style={{ color: '#a0a0a0' }}>Production regression detection made simple.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Security'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Contact'] },
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" style={{ color: '#94a3b8' }} className="hover:text-purple-400 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t" style={{ borderColor: 'rgba(139, 92, 246, 0.1)' }}>
            <div className="pt-8 text-center text-sm" style={{ color: '#94a3b8' }}>
              <p>© 2026 DEVHOPS. All rights reserved. Built for developers, by developers.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}