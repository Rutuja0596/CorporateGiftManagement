
// import React, { useEffect, useState } from 'react';
// import api from '../../services/api';

// interface Order {
//   user_name: string;
//   email: string;
//   gift: string;
//   status: string;
// }

// export default function AdminOrders() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const res = await api.get('/admin/orders');
//       setOrders(res.data);
//     } catch (err) {
//       console.error('Error fetching orders', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <p className="p-6">Loading...</p>;
//   }

//   return (
//     <div className="p-6 space-y-6">

//       <h1 className="text-3xl font-bold">Employees & Gift Selections</h1>

//       <div className="bg-white shadow rounded-xl overflow-hidden">
//         <table className="w-full text-left">

//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-6 py-3">Employee</th>
//               <th className="px-6 py-3">Email</th>
//               <th className="px-6 py-3">Gift</th>
//               <th className="px-6 py-3">Status</th>
//             </tr>
//           </thead>

//           <tbody>
//             {orders.map((o, i) => (
//               <tr key={i} className="border-t">

//                 <td className="px-6 py-3 font-semibold">
//                   {o.user_name}
//                 </td>

//                 <td className="px-6 py-3 text-gray-600">
//                   {o.email}
//                 </td>

//                 <td className="px-6 py-3">
//                   {o.gift || 'Not Selected'}
//                 </td>

//                 <td className="px-6 py-3">
//                   <span
//                     className={`px-3 py-1 rounded text-sm font-semibold ${
//                       o.status === 'SELECTED'
//                         ? 'bg-green-100 text-green-700'
//                         : 'bg-red-100 text-red-600'
//                     }`}
//                   >
//                     {o.status === 'SELECTED'
//                       ? 'Selected'
//                       : 'Pending'}
//                   </span>
//                 </td>

//               </tr>
//             ))}
//           </tbody>

//         </table>

//         {orders.length === 0 && (
//           <div className="text-center py-6 text-gray-500">
//             No data available
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/admin/orders")
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th>Email</th>
            <th>Campaign</th>
            <th>Gift</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o: any, i) => (
            <tr key={i} className="border-t text-center">
              <td>{o.email}</td>
              <td>{o.campaign}</td>
              <td>{o.gift}</td>
              <td>{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}