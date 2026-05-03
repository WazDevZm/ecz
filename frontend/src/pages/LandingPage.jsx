import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Map, Bell, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: TrendingUp,
      title: 'Real-time Sentiment Analysis',
      description: 'Track political sentiment across social media platforms in real-time'
    },
    {
      icon: BarChart3,
      title: 'Party & Candidate Analytics',
      description: 'Compare performance metrics and engagement across parties and candidates'
    },
    {
      icon: Map,
      title: 'Province-level Insights',
      description: 'Interactive map showing sentiment distribution across Zambian provinces'
    },
    {
      icon: Bell,
      title: 'Custom Alerts',
      description: 'Get notified when sentiment spikes or trends emerge'
    }
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-green-600/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse-slow" />
        <div className="absolute w-96 h-96 bg-amber-600/10 rounded-full blur-3xl top-1/2 right-0 animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute w-96 h-96 bg-red-600/10 rounded-full blur-3xl bottom-0 left-1/3 animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">Z</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">ZedPulse</h1>
                <p className="text-xs text-gray-400">Elections Dashboard</p>
              </div>
            </div>
            <div className="space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 text-white hover:text-green-400 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-400 via-amber-400 to-red-400 bg-clip-text text-transparent">
              ZedPulse Elections Dashboard
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Real-time digital political sentiment monitoring for Zambia
            </p>
            <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
              Track social media conversations, analyze sentiment trends, and gain insights into the digital political landscape during Zambia's election season.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-green-600 hover:bg-green-700 rounded-lg text-lg font-medium transition-colors"
            >
              <span>Open Dashboard</span>
              <ArrowRight size={20} />
            </button>
          </motion.div>

          {/* Preview Chart */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 bg-navy-900/50 backdrop-blur-sm border border-navy-800 rounded-2xl p-8 max-w-5xl mx-auto"
          >
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">45.2%</div>
                <div className="text-sm text-gray-400">Positive</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">28.7%</div>
                <div className="text-sm text-gray-400">Negative</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-400">26.1%</div>
                <div className="text-sm text-gray-400">Neutral</div>
              </div>
            </div>
            <div className="h-48 bg-navy-800/50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Live sentiment chart preview</p>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-20">
          <h3 className="text-3xl font-bold text-center mb-12">Platform Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-navy-900/50 backdrop-blur-sm border border-navy-800 rounded-xl p-6 hover:border-green-600 transition-colors"
              >
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="text-green-400" size={24} />
                </div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="container mx-auto px-6 py-12">
          <div className="bg-amber-900/20 border border-amber-700 rounded-xl p-6 text-center">
            <p className="text-amber-200">
              <strong>Important Disclaimer:</strong> This platform monitors digital conversation trends and does not predict election results or represent official voter behavior. Social media sentiment does not represent actual voting outcomes.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-8 border-t border-navy-800 text-center text-gray-400">
          <p>&copy; 2026 ZedPulse Elections Dashboard. Built for monitoring digital political discourse.</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
