import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Map, RefreshCw } from 'lucide-react';
import { mockProvinceAnalytics } from '../lib/mockData';

const MapAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [provinceData, setProvinceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setProvinceData(mockProvinceAnalytics);
    } catch (error) {
      toast.error('Failed to load province analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="animate-spin text-green-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Map Analytics</h1>
          <p className="text-gray-400 mt-1">Province-level sentiment analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          {['24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === range
                  ? 'bg-green-600 text-white'
                  : 'bg-navy-800 text-gray-300 hover:bg-navy-700'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="card">
        <div className="h-96 bg-navy-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Map size={64} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Interactive Zambia map will be displayed here</p>
            <p className="text-sm text-gray-500 mt-2">Showing sentiment distribution across provinces</p>
          </div>
        </div>
      </div>

      {/* Province Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {provinceData.map((province) => (
          <div key={province._id} className="card">
            <h3 className="text-lg font-semibold text-white mb-3">{province._id}</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Mentions:</span>
                <span className="text-white font-medium">{province.totalMentions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Avg Sentiment:</span>
                <span className={`font-medium ${
                  province.avgSentiment > 0 ? 'text-green-400' : 
                  province.avgSentiment < 0 ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {(province.avgSentiment * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapAnalyticsPage;
