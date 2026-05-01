import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Card } from '../../components/Card';
import { Button } from "../../components/Button";
import { LayoutDashboard, Users, Gift, Layers } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState({
    total_users: 0,
    selected_users: 0,
    active_campaigns: 0
  });

  useEffect(() => {
    api.get('/dashboard').then((res: any) => {
      setData(res.data);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Card>
          <div className="flex items-center gap-4">
            <Users className="text-blue-600" />
            <div>
              <p className="text-gray-500">Total Employees</p>
              <h2 className="text-2xl font-bold">{data.total_users}</h2>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <Gift className="text-green-600" />
            <div>
              <p className="text-gray-500">Selected Gifts</p>
              <h2 className="text-2xl font-bold">{data.selected_users}</h2>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <Layers className="text-purple-600" />
            <div>
              <p className="text-gray-500">Active Campaigns</p>
              <h2 className="text-2xl font-bold">{data.active_campaigns}</h2>
            </div>
          </div>
        </Card>

      </div>
      
    </div>
  );
}