import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Gift, Campaign } from '../../types';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

export default function ManageGifts() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [isActive, setIsActive] = useState<boolean>(true);

  const [newGiftName, setNewGiftName] = useState('');
  const [newGiftDesc, setNewGiftDesc] = useState('');

  const [editingGiftId, setEditingGiftId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    const res = await api.get('/campaigns');
    setCampaigns(res.data);
  };

  const loadGifts = async (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    const res = await api.get(`/gifts/${campaign.id}`);
    setGifts(res.data.gifts);
    setIsActive(res.data.is_active);
  };

  // ✅ ADD
  const handleAddGift = async () => {
    if (!selectedCampaign || !newGiftName) return;

    await api.post('/gift', {
      name: newGiftName,
      description: newGiftDesc,
      campaign_id: selectedCampaign.id
    });

    setNewGiftName('');
    setNewGiftDesc('');
    loadGifts(selectedCampaign);
  };

  // ✅ DELETE
  const handleDelete = async (giftId: number) => {
    await api.delete(`/gift/${giftId}`);
    if (selectedCampaign) loadGifts(selectedCampaign);
  };

  // ✅ START EDIT
  const startEdit = (gift: Gift) => {
    setEditingGiftId(gift.id);
    setEditName(gift.name);
    setEditDesc(gift.description || '');
  };

  // ✅ SAVE EDIT
  const handleUpdate = async () => {
    if (!editingGiftId) return;

    await api.put(`/gift/${editingGiftId}`, {
      name: editName,
      description: editDesc
    });

    setEditingGiftId(null);
    if (selectedCampaign) loadGifts(selectedCampaign);
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">Manage Gifts</h1>

      {/* CAMPAIGNS */}
      <Card>
        {campaigns.map(c => (
          <div key={c.id} className="flex justify-between p-3 border mb-2">
            <span>{c.name}</span>
            <Button onClick={() => loadGifts(c)}>View Gifts</Button>
          </div>
        ))}
      </Card>

      {/* ADD GIFT */}
      {selectedCampaign && isActive && (
        <Card className="mt-6">
          <h2 className="font-bold mb-2">Add Gift</h2>

          <input
            placeholder="Name"
            value={newGiftName}
            onChange={(e) => setNewGiftName(e.target.value)}
            className="border p-2 w-full mb-2"
          />

          <input
            placeholder="Description"
            value={newGiftDesc}
            onChange={(e) => setNewGiftDesc(e.target.value)}
            className="border p-2 w-full mb-2"
          />

          <Button onClick={handleAddGift}>Add</Button>
        </Card>
      )}

      {/* GIFT LIST */}
      {selectedCampaign && (
        <Card className="mt-6">
          <h2 className="font-bold mb-4">Gifts</h2>

          {gifts.map(g => (
            <div key={g.id} className="flex justify-between items-center border p-3 mb-2">

              {editingGiftId === g.id ? (
                <>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border p-1 mr-2"
                  />
                  <input
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="border p-1 mr-2"
                  />

                  <Button size="sm" onClick={handleUpdate}>Save</Button>
                </>
              ) : (
                <>
                  <div>
                    <p className="font-bold">{g.name}</p>
                    <p className="text-sm text-gray-500">{g.description}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => startEdit(g)}>Edit</Button>
                    <Button size="sm" onClick={() => handleDelete(g.id)}>Delete</Button>
                  </div>
                </>
              )}

            </div>
          ))}

        </Card>
      )}
    </div>
  );
}