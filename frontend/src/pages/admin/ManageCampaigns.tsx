import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Campaign } from '../../types';
import { Plus } from 'lucide-react';
import { Button } from '../../components/Button';

export default function ManageCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await api.get('/campaigns');
      setCampaigns(res.data);
    } catch (err) {
      console.error('Error fetching campaigns', err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/campaign', {
        name,
        description: desc
      });
      setName('');
      setDesc('');
      fetchCampaigns();
    } catch (err) {
      console.error('Error creating campaign', err);
    }
  };

  const toggleCampaign = async (id: number) => {
    try {
      await api.put(`/campaign/${id}/toggle`);
      fetchCampaigns();
    } catch (err) {
      console.error('Error toggling campaign', err);
    }
  };

  return (
    <div className="space-y-8 p-6">
      
      <div className="bg-white p-6 rounded-xl shadow border">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Plus className="mr-2 text-blue-600" />
          Create Campaign
        </h3>

        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            placeholder="Campaign Name"
            required
            className="p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Description"
            required
            className="p-2 border rounded"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <button
            type="submit"
            className="bg-blue-600 text-white rounded font-bold hover:bg-blue-700"
          >
            Create
          </button>
        </form>
      </div>

      
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-left">
          
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id} className="border-t">
                
                <td className="px-6 py-3 text-gray-500">
                  #{c.id}
                </td>

                <td className="px-6 py-3 font-bold">
                  {c.name}
                </td>

                <td className="px-6 py-3">
                  {c.description}
                </td>

                
                <td className="px-6 py-3">
                  <span
                    className={`px-2 py-1 rounded text-sm font-semibold ${
                      c.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {c.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>

                
                <td className="px-6 py-3">
                  <Button onClick={() => toggleCampaign(c.id)}>
                    {c.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

       
        {campaigns.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No campaigns found
          </div>
        )}
      </div>
    </div>
  );
}