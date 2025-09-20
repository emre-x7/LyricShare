import React, { useState } from "react";
import { User } from "../../services/adminService";

interface UsersTableProps {
  users: User[];
}

const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  const [selectedRole, setSelectedRole] = useState<{ [key: number]: string }>(
    {}
  );

  const handleRoleChange = (userId: number, newRole: string) => {
    setSelectedRole((prev) => ({ ...prev, [userId]: newRole }));
  };

  if (users.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400">Henüz kullanıcı yok.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700">
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
              Kullanıcı
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
              Email
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
              Kayıt Tarihi
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
              Şarkı Sayısı
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
              Rol
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-200 dark:border-gray-600"
            >
              <td className="px-4 py-2 dark:text-white">
                {user.firstName} {user.lastName}
              </td>
              <td className="px-4 py-2 dark:text-gray-300">{user.email}</td>
              <td className="px-4 py-2 dark:text-gray-300">
                {new Date(user.createdAt).toLocaleDateString("tr-TR")}
              </td>
              <td className="px-4 py-2 dark:text-gray-300">{user.songCount}</td>
              <td className="px-4 py-2">
                <select
                  value={selectedRole[user.id] || user.roles[0]}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded px-2 py-1 text-sm"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
