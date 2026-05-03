import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { UserCircle, RefreshCw } from 'lucide-react';
import { mockCandidates } from '../lib/mockData';

const CandidatesPage = () => {
  const [candidatesList, setCandidatesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setCandidatesList(mockCandidates);
    } catch (error) {
      toast.error('Failed to load candidates');
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
        <h1 className="text-3xl font-bold text-white">Candidates</h1>
        <p className="text-gray-400 mt-1">Overview of tracked political candidates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidatesList.map((candidate) => (
          <div key={candidate._id} className="card hover:border-green-600 transition-colors cursor-pointer">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center">
                {candidate.photo ? (
                  <img src={candidate.photo} alt={candidate.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <UserCircle size={40} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white">{candidate.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{candidate.party.name}</p>
                <span
                  className="inline-block mt-2 px-2 py-1 text-xs rounded"
                  style={{ backgroundColor: `${candidate.party.color}20`, color: candidate.party.color }}
                >
                  {candidate.party.abbreviation}
                </span>
              </div>
            </div>
            {candidate.position && (
              <p className="text-xs text-gray-500 mt-4 capitalize">{candidate.position}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidatesPage;
