
'use client';

import React from 'react';

const staticUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Premium', status: 'Active' },
  { id: 3, name: 'Robert Johnson', email: 'robert@example.com', role: 'User', status: 'Inactive' },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'Admin', status: 'Active' },
  { id: 5, name: 'Michael Brown', email: 'michael@example.com', role: 'User', status: 'Active' },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Users</h1>
          <p className="text-gray-500">Manage your application users</p>
        </div>
        <div className="bg-white border border-gray-100 px-4 py-2 rounded-lg shadow-sm">
          <span className="text-sm text-gray-500">Total Users: </span>
          <span className="font-bold text-primary">{staticUsers.length}</span>
        </div>
      </div>

      <div className="pronimal-card">
        <table className="pronimal-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {staticUsers.map((user) => (
              <tr key={user.id}>
                <td className="font-medium">{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
