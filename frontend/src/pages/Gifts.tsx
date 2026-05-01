import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/Button';
import { Message } from '../components/Message';
import { Gift } from '../types';

export default function Gifts() {
  const { id } = useParams<{ id: string }>();
  const campaignId = Number(id);

  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGiftId, setSelectedGiftId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!campaignId) return;

    const loadData = async () => {
      try {
        setLoading(true);

        // ✅ Handle BOTH response formats
        const giftRes = await api.get(`/gifts/${campaignId}`);

        if (Array.isArray(giftRes.data)) {
          setGifts(giftRes.data);
        } else {
          setGifts(giftRes.data.gifts || []);
        }

        // ✅ Check existing order for THIS campaign
        const orderRes = await api.get(`/orders/my/${campaignId}`);

        if (orderRes.data?.gift_id) {
          setSelectedGiftId(orderRes.data.gift_id);
        }

      } catch (err: any) {
        setError("Failed to load gifts");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [campaignId]);

  const handleSelect = async (giftId: number) => {
    try {
      await api.post("/orders", {
        campaign_id: campaignId,
        gift_id: giftId,
      });

      setSelectedGiftId(giftId);
      setSuccess("Gift selected successfully!");

    } catch (err: any) {
      setError(err.response?.data?.detail || "Error selecting gift");
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="p-6">
      {error && (
        <Message type="error" message={error} onClose={() => setError('')} />
      )}

      {success && (
        <Message type="success" message={success} onClose={() => setSuccess('')} />
      )}

      {/* ✅ EMPTY STATE */}
      {gifts.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          No gifts available for this campaign
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gifts.map((g) => (
          <div
            key={g.id}
            className={`p-4 border rounded-lg flex justify-between items-center ${
              selectedGiftId === g.id ? "border-green-500 bg-green-50" : ""
            }`}
          >
            <span className="font-medium">{g.name}</span>

            <Button
              onClick={() => handleSelect(g.id)}
              disabled={selectedGiftId !== null}
            >
              {selectedGiftId === g.id ? "Selected ✓" : "Select"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}