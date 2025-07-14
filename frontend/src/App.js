import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { GradientBackground, FloatingElements, EnhancedResultDisplay } from './components/VisualEnhancements';
import './App.css';

// Register Chart.js components
Chart.register(...registerables);

const FITimelineCalculator = () => {
  const [inputs, setInputs] = useState({
    start: 44385,
    contrib: 2000,
    return: 6,
    infl: 3,
    target: 500000,
    custom: ''
  });
  
  const [theme, setTheme] = useState('light');
  const [panelOpen, setPanelOpen] = useState(false);
  const [result, setResult] = useState({ months: 0, years: 0, remainingMonths: 0 });
  const [scrubberValue, setScrubberValue] = useState(0);
  const [maxScrubber, setMaxScrubber] = useState(0);
  
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const fullBal = useRef([]);
  const fullTgt = useRef([]);
  const hasStaggered = useRef(false);

  // Simple animation function to replace anime.js initially
  const animateValue = (start, end, duration, callback) => {
    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out exponential function
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = start + (end - start) * easeOutExpo;
      
      callback(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  // Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Calculate FI timeline
  const calculateFI = () => {
    const P0 = inputs.start || 0;
    const C = inputs.contrib;
    const rA = inputs.return / 100;
    const iA = inputs.infl / 100;
    
    let tgt = inputs.target === 'custom' ? (inputs.custom || 0) : inputs.target;
    if (!tgt) return;
    
    if (P0 < 0 || C < 0 || rA < 0 || iA < 0 || tgt <= 0) return;
    
    const rM = rA / 12;
    const iM = iA / 12;
    let bal = P0;
    let n = 0;
    
    fullBal.current = [bal];
    fullTgt.current = [tgt];
    
    while (bal < fullTgt.current[n] && n < 6000) {
      n++;
      bal = bal * (1 + rM) + C;
      fullTgt.current.push(tgt * Math.pow(1 + iM, n));
      fullBal.current.push(bal);
    }
    
    const years = Math.floor(n / 12);
    const months = n % 12;
    
    // Animated counting
    animateValue(0, n, 900, (currentVal) => {
      const roundedVal = Math.round(currentVal);
      setResult({
        months: roundedVal,
        years: Math.floor(roundedVal / 12),
        remainingMonths: roundedVal % 12
      });
    });
    
    buildChart(n);
  };

  // Build enhanced chart
  const buildChart = (months) => {
    if (!chartRef.current) return;
    
    const ctx = chartRef.current.getContext('2d');
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: months + 1 }, (_, i) => i),
        datasets: [
          {
            label: 'Portfolio Balance',
            data: fullBal.current,
            borderColor: theme === 'dark' ? '#60a5fa' : '#2563eb',
            backgroundColor: theme === 'dark' ? 'rgba(96, 165, 250, 0.1)' : 'rgba(37, 99, 235, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBorderWidth: 3,
            pointHoverBorderColor: theme === 'dark' ? '#60a5fa' : '#2563eb',
            pointHoverBackgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff'
          },
          {
            label: 'Inflation-Adjusted Target',
            data: fullTgt.current,
            borderColor: theme === 'dark' ? '#94a3b8' : '#64748b',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [8, 4],
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeOutQuart'
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Months',
              font: { size: 14, weight: '600' },
              color: theme === 'dark' ? '#e5e7eb' : '#374151'
            },
            grid: {
              color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
            },
            ticks: {
              color: theme === 'dark' ? '#d1d5db' : '#6b7280'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Nominal Dollars',
              font: { size: 14, weight: '600' },
              color: theme === 'dark' ? '#e5e7eb' : '#374151'
            },
            beginAtZero: true,
            grid: {
              color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
            },
            ticks: {
              color: theme === 'dark' ? '#d1d5db' : '#6b7280',
              callback: (value) => {
                return value >= 1e6 ? `$${(value / 1e6).toFixed(1)}M` : `$${(value / 1e3).toFixed(0)}k`;
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: theme === 'dark' ? '#e5e7eb' : '#374151',
              font: { size: 12, weight: '500' },
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            titleColor: theme === 'dark' ? '#f9fafb' : '#111827',
            bodyColor: theme === 'dark' ? '#d1d5db' : '#374151',
            borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            titleFont: { size: 14, weight: '600' },
            bodyFont: { size: 13 }
          }
        }
      }
    });
    
    setMaxScrubber(months);
    setScrubberValue(months);
  };

  // Update scrubber
  const updateScrubber = (value) => {
    if (!chartInstance.current) return;
    
    setScrubberValue(value);
    const cut = parseInt(value);
    
    chartInstance.current.data.labels.length = cut + 1;
    chartInstance.current.data.datasets.forEach(dataset => {
      dataset.data.length = cut + 1;
    });
    
    chartInstance.current.update('none');
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Calculate on input change
  useEffect(() => {
    calculateFI();
  }, [inputs, theme]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900'
    }`}>
      {/* Enhanced animated background */}
      <GradientBackground theme={theme} />
      <FloatingElements theme={theme} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setPanelOpen(!panelOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FI Timeline Calculator
          </h1>
        </div>
        
        <button
          onClick={toggleTheme}
          className="p-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
        >
          <div className="theme-icon">
            {theme === 'dark' ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.64 13a1 1 0 00-1.05-.68 8.5 8.5 0 01-3.37.73A8.15 8.15 0 019.08 5.49a8.59 8.59 0 01.25-2A1 1 0 008 2.36a10.14 10.14 0 1014 11.69 1 1 0 00-.36-1.05z" />
              </svg>
            )}
          </div>
        </button>
      </header>

      <div className="flex flex-col md:flex-row h-[calc(100vh-5rem)]">
        {/* Control Panel */}
        <div className={`
          md:w-80 md:min-w-80 p-6 backdrop-blur-sm transition-all duration-300 overflow-y-auto
          ${theme === 'dark' 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-white/70 border-gray-200'
          }
          ${panelOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          fixed md:relative inset-y-0 left-0 z-20 md:z-auto border-r
        `}>
          <div className="space-y-6">
            {/* Starting Balance */}
            <div className="control-item">
              <label className="block text-sm font-semibold mb-2">Starting Balance</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={inputs.start}
                  onChange={(e) => handleInputChange('start', parseInt(e.target.value) || 0)}
                  className={`w-full pl-8 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}
                  min="0"
                  step="1000"
                />
              </div>
            </div>

            {/* Monthly Contribution */}
            <div className="control-item">
              <label className="block text-sm font-semibold mb-2 flex justify-between">
                Monthly Contribution
                <span className="text-blue-600 font-bold">${inputs.contrib.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="500"
                max="10000"
                step="100"
                value={inputs.contrib}
                onChange={(e) => handleInputChange('contrib', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$500</span>
                <span>$10,000</span>
              </div>
            </div>

            {/* Annual Return */}
            <div className="control-item">
              <label className="block text-sm font-semibold mb-2 flex justify-between">
                Annual Return
                <span className="text-green-600 font-bold">{inputs.return}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="15"
                step="0.1"
                value={inputs.return}
                onChange={(e) => handleInputChange('return', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>15%</span>
              </div>
            </div>

            {/* Inflation Rate */}
            <div className="control-item">
              <label className="block text-sm font-semibold mb-2 flex justify-between">
                Inflation Rate
                <span className="text-red-600 font-bold">{inputs.infl}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="6"
                step="0.1"
                value={inputs.infl}
                onChange={(e) => handleInputChange('infl', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>6%</span>
              </div>
            </div>

            {/* Target Amount */}
            <div className="control-item">
              <label className="block text-sm font-semibold mb-2">Target Amount</label>
              <select
                value={inputs.target}
                onChange={(e) => handleInputChange('target', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                <option value="250000">$250,000</option>
                <option value="500000">$500,000</option>
                <option value="750000">$750,000</option>
                <option value="1000000">$1,000,000</option>
                <option value="custom">Custom Amount</option>
              </select>
              
              {inputs.target === 'custom' && (
                <input
                  type="number"
                  value={inputs.custom}
                  onChange={(e) => handleInputChange('custom', parseInt(e.target.value) || 0)}
                  placeholder="Enter custom amount"
                  className={`w-full px-4 py-3 mt-2 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}
                  min="1"
                />
              )}
            </div>

            {/* Result Display */}
            <EnhancedResultDisplay result={result} theme={theme} />
          </div>
        </div>

        {/* Chart Area */}
        <div className="flex-1 p-6 relative">
          <div className={`h-full rounded-xl border-2 p-6 ${
            theme === 'dark' 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-white/70 border-gray-200'
          }`}>
            <div className="h-full flex flex-col">
              <div className="flex-1 relative">
                <canvas ref={chartRef} className="w-full h-full"></canvas>
              </div>
              
              {/* Scrubber */}
              {maxScrubber > 0 && (
                <div className="mt-4 flex items-center gap-3">
                  <label className="text-sm font-medium">Timeline:</label>
                  <input
                    type="range"
                    min="0"
                    max={maxScrubber}
                    value={scrubberValue}
                    onChange={(e) => updateScrubber(e.target.value)}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
                  />
                  <span className="text-sm font-medium w-16 text-right">
                    {scrubberValue}m
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {panelOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setPanelOpen(false)}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <FITimelineCalculator />
    </div>
  );
}

export default App;