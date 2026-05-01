import { useEffect, useState } from "react";
import api from "../../services/api";

type UserRow = {
  email: string;
  campaign: string;
  gift: string;
  status: string;
};

export default function Users() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="p-6">Loading users...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Users</h1>

      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Campaign</th>
              <th className="p-3 text-left">Gift</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, index) => (
              <tr key={index} className="border-t">
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.campaign}</td>
                <td className="p-3">{u.gift}</td>
                <td className="p-3">
                  {u.status === "SELECTED" ? (
                    <span className="text-green-600 font-semibold">
                      Selected
                    </span>
                  ) : (
                    <span className="text-red-500">Not Selected</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}