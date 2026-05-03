import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Users, RefreshCw } from 'lucide-react';
import { mockParties } from '../lib/mockData';

const PartiesPage = () => {
  const [partiesList, setPartiesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setPartiesList(mockParties);
    } catch (error) {
      toast.error('Failed to load parties');
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
      <div>
        <h1 className="text-3xl font-bold text-white">Political Parties</h1>
        <p className="text-gray-400 mt-1">Overview of tracked political parties</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partiesList.map((party) => (
          <div key={party._id} className="card hover:border-green-600 transition-colors cursor-pointer">
            <div className="flex items-start space-x-4">
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold"
                style={{ backgroundColor: `${party.color}20`, color: party.color }}
              >
                {party.abbreviation.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white">{party.abbreviation}</h3>
                <p className="text-sm text-gray-400 mt-1">{party.name}</p>
                {party.leader && (
                  <p className="text-xs text-gray-500 mt-2">Leader: {party.leader}</p>
                )}
              </div>
            </div>
            {party.description && (
              <p className="text-sm text-gray-400 mt-4 line-clamp-2">{party.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartiesPage;
