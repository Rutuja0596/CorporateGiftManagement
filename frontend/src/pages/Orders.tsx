// import { useState, useEffect } from 'react';
// import api from '../services/api';
// import { Card } from '../components/Card';
// import { Package, CheckCircle } from 'lucide-react';

// export default function Orders() {
//   const [order, setOrder] = useState<any>(null);
//   const [giftName, setGiftName] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.get('/my-order')
//       .then(res => {
//         if (res.data && res.data.length > 0) {
//           setOrder(res.data[0]); // First item is the order object
//           setGiftName(res.data[1]); // Second item is the string
//         }
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <div className="text-center py-20 text-gray-600">Loading order...</div>;

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h1 className="text-3xl font-bold text-gray-900 mb-6">My Order</h1>
//       {order ? (
//         <Card className="border-t-4 border-t-blue-600 shadow-xl">
//           <div className="flex items-center space-x-6">
//             <div className="bg-blue-100 p-4 rounded-full text-blue-600">
//               <Package size={40} />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Selected Item</p>
//               <h2 className="text-2xl font-black text-gray-900">{giftName}</h2>
//               <p className="text-gray-500 mt-1">Order Ref: #{order.id}</p>
//               <div className="mt-4 flex items-center text-green-600 font-bold">
//                 <CheckCircle size={18} className="mr-2" />
//                 Processing for Delivery
//               </div>
//             </div>
//           </div>
//         </Card>
//       ) : (
//         <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
//           <Package size={48} className="mx-auto text-gray-300 mb-4" />
//           <p className="text-xl text-gray-500 font-medium">No gift selected yet.</p>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Orders() {
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    api.get('/my-order').then(res => {
      setOrder(res.data);
    });
  }, []);

  if (!order) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Order</h1>

      {order.status === "NOT_SELECTED" && (
        <div className="text-red-500">
          You have not selected any gift yet.
        </div>
      )}

      {order.status === "SELECTED" && (
        <div className="text-green-600">
          Gift Selected: {order.gift_name}
        </div>
      )}
    </div>
  );
}