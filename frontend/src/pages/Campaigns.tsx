import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Message } from '../components/Message';
import { Campaign } from '../types';
import { Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';


export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchCampaigns();
  }, [isAuthenticated]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await api.get('/campaigns');
      setCampaigns(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
        <p className="text-lg text-gray-600">Loading campaigns...</p>
      </div>
    );
  }

  return (
    <>
      {error && <Message type="error" message={error} />}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Campaigns</h1>
        <p className="text-xl text-gray-600">
          Choose a campaign to explore gifts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {campaigns
          .filter((c) => c.is_active)
          .map((campaign) => (
            <Card key={campaign.id} hoverEffect>
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl mb-6 flex items-end p-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 w-full">
                  <div className="flex items-center text-white mb-3">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium opacity-90">
                      Active Campaign
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 truncate">
                    {campaign.name}
                  </h3>
                  <p className="text-white/90 text-sm mb-4 line-clamp-2">
                    {campaign.description}
                  </p>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() =>
                  navigate(`/campaigns/${campaign.id}/gifts`)
                }
              >
                View Gifts <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </Card>
          ))}
      </div>

      {campaigns.length === 0 && !loading && (
        <Card className="text-center py-20 col-span-full">
          <p className="text-2xl text-gray-500 mb-4">
            No campaigns available
          </p>
          <Button variant="outline" onClick={fetchCampaigns}>
            Refresh
          </Button>
        </Card>
      )}
    </>
  );
}