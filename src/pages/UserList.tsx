import { useEffect, useState } from 'react';
import { getUsersFromFirestore } from '../api/firestore.user';
import type { User } from '../types/user';

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsersFromFirestore();
      setUsers(users);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h4 className="text-2xl font-bold mb-4">User Management</h4>
      {loading ? (
        <div className="flex justify-center items-center h-40">Loading users...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Avatar</th>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Email</th>
                <th className="px-4 py-2 border-b">Provider</th>
                <th className="px-4 py-2 border-b">Admin</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.uid} className="text-center">
                  <td className="px-4 py-2 border-b">
                    <img src={user.photoURL ?? 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.displayName)} alt={user.displayName} className="w-10 h-10 rounded-full mx-auto" />
                  </td>
                  <td className="px-4 py-2 border-b font-semibold">{user.displayName}</td>
                  <td className="px-4 py-2 border-b">{user.email}</td>
                  <td className="px-4 py-2 border-b">{user.provider}</td>
                  <td className="px-4 py-2 border-b">{user.isAdmin ? '✔️' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 