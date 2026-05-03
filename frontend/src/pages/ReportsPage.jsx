import { useState } from 'react';
import toast from 'react-hot-toast';
import { FileText, Download } from 'lucide-react';

const ReportsPage = () => {
  const [generating, setGenerating] = useState(false);
  const [format, setFormat] = useState('pdf');
  const [timeRange, setTimeRange] = useState('7d');

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Report generated successfully!');
      console.log('Report data:', { format, timeRange });
      // In demo mode, just show success message
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Reports</h1>
        <p className="text-gray-400 mt-1">Generate and download analytics reports</p>
      </div>

      <div className="card max-w-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="text-green-400" size={32} />
          <div>
            <h3 className="text-xl font-semibold text-white">Generate Report</h3>
            <p className="text-sm text-gray-400">Create a comprehensive analytics report</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Time Range
            </label>
            <div className="grid grid-cols-3 gap-3">
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

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['pdf', 'csv'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={`px-4 py-2 rounded-lg font-medium uppercase transition-colors ${
                    format === fmt
                      ? 'bg-green-600 text-white'
                      : 'bg-navy-800 text-gray-300 hover:bg-navy-700'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {generating ? (
              <span>Generating...</span>
            ) : (
              <>
                <Download size={18} />
                <span>Generate Report</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
