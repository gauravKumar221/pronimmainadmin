
'use client';

import React from 'react';

const staticAgencies = [
  { id: 1, name: 'Global Tech Solutions', location: 'New York', category: 'IT', employees: '50-200' },
  { id: 2, name: 'Skyline Real Estate', location: 'London', category: 'Property', employees: '10-50' },
  { id: 3, name: 'Creative Minds Agency', location: 'Berlin', category: 'Marketing', employees: '1-10' },
  { id: 4, name: 'Nexus Logistics', location: 'Tokyo', category: 'Supply Chain', employees: '500+' },
  { id: 5, name: 'Pure Water Co', location: 'Toronto', category: 'Sustainability', employees: '20-50' },
];

export default function AgencyPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Agencies</h1>
          <p className="text-gray-500">Manage registered agencies and partners</p>
        </div>
        <div className="bg-white border border-gray-100 px-4 py-2 rounded-lg shadow-sm">
          <span className="text-sm text-gray-500">Total Agencies: </span>
          <span className="font-bold text-primary">{staticAgencies.length}</span>
        </div>
      </div>

      <div className="pronimal-card">
        <table className="pronimal-table">
          <thead>
            <tr>
              <th>Agency Name</th>
              <th>Location</th>
              <th>Category</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            {staticAgencies.map((agency) => (
              <tr key={agency.id}>
                <td className="font-semibold">{agency.name}</td>
                <td>{agency.location}</td>
                <td>{agency.category}</td>
                <td>{agency.employees}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
