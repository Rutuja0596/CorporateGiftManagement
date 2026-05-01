import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { ShoppingBag } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    // Note: You would need an admin endpoint to get ALL orders
    // For now, this is a placeholder for the logic
    api.get('/all-orders-admin').then(res => setOrders(res.data));
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center space-x-2">
        <ShoppingBag className="text-blue-600" />
        <h3 className="font-bold text-slate-800 uppercase tracking-wider">Live Gift Selections</h3>
      </div>
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200 uppercase text-xs text-slate-400">
          <tr>
            <th className="px-6 py-4">Order ID</th>
            <th className="px-6 py-4">User Email</th>
            <th className="px-6 py-4">Selected Gift</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map(o => (
            <tr key={o.id}>
              <td className="px-6 py-4 font-mono text-blue-600">#{o.id}</td>
              <td className="px-6 py-4 font-medium text-slate-800">{o.email}</td>
              <td className="px-6 py-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                  {o.gift_name}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}