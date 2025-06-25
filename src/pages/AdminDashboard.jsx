import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";

export default function AdminDashboard() {
  const apiURL = import.meta.env.VITE_API_URL;
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);


  const fetchStats = async () => {
    const res = await fetch(`${apiURL}/api/early-access/stats`);
    const data = await res.json();
    setStats(data);
  };

  const fetchUsers = async () => {
    setLoading(true);
    let url = `${apiURL}/api/early-access/all`;
    const filters = [];
    if (roleFilter) filters.push(`role=${roleFilter}`);
    if (statusFilter) filters.push(`status=${statusFilter}`);
    if (filters.length) url += `?${filters.join("&")}`;

    const res = await fetch(url);
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  const updateStatus = async (id, newStatus) => {
    await fetch(`${apiURL}/api/early-access/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),

    });
    fetchUsers(); // Refresh list
    fetchStats(); // Refresh stats
    setSelectedUser(null); // add this line after successful update
  };

  const logout = () => {
    localStorage.removeItem("isAdmin");
    window.location.href = "/admin";
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-12 h-12" />
          <h1 className="text-2xl font-bold text-[#213729]">Admin Dashboard</h1>
        </div>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Users" value={stats.totalUsers} />
          <StatCard label="Total Clients" value={stats.totalClients} />
          <StatCard label="Total Taskers" value={stats.totalTaskers} />
          <StatCard label="Pending" value={stats.statusCounts.pending} />
          <StatCard label="Accepted" value={stats.statusCounts.accepted} />
          <StatCard label="Rejected" value={stats.statusCounts.rejected} />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Roles</option>
          <option value="client">Client</option>
          <option value="tasker">Tasker</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* User Table */}
      {loading ? (
        <p className="text-center text-gray-600">Loading users...</p>
      ) : (
        <div className="overflow-auto rounded-lg shadow bg-white">
          <table className="min-w-full">
            <thead className="bg-[#215432] text-white text-left text-sm">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="p-3 text-blue-600 underline cursor-pointer" onClick={() => setSelectedUser(user)}>
                    {user.name}
                  </td>

                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3 capitalize">{user.status}</td>
                  <td className="p-3 space-x-2">
                    {user.status !== "accepted" && (
                      <button
                        onClick={() => updateStatus(user._id, "accepted")}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Accept
                      </button>
                    )}
                    {user.status !== "rejected" && (
                      <button
                        onClick={() => updateStatus(user._id, "rejected")}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

{selectedUser && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-xl space-y-4">
      <h2 className="text-xl font-bold text-[#215432]">User Details</h2>
      <p><strong>Name:</strong> {selectedUser.name}</p>
      <p><strong>Email:</strong> {selectedUser.email}</p>
      <p><strong>Role:</strong> {selectedUser.role}</p>
      <p><strong>Age:</strong> {selectedUser.age}</p>

      {selectedUser.role === "client" && (
        <>
          <h3 className="font-semibold mt-4">Client Answers</h3>
          <p><strong>Task Type:</strong> {selectedUser.clientAnswers?.taskType}</p>
          <p><strong>Usage Frequency:</strong> {selectedUser.clientAnswers?.usageFrequency}</p>
          <p><strong>Contact Method:</strong> {selectedUser.clientAnswers?.contactMethod}</p>
        </>
      )}

      {selectedUser.role === "tasker" && (
        <>
          <h3 className="font-semibold mt-4">Tasker Answers</h3>
          <p><strong>Services Offered:</strong> {selectedUser.taskerAnswers?.servicesOffered}</p>
          <p><strong>Experience Level:</strong> {selectedUser.taskerAnswers?.experienceLevel}</p>
          <p><strong>Weekly Availability:</strong> {selectedUser.taskerAnswers?.weeklyAvailability}</p>
        </>
      )}

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => updateStatus(selectedUser._id, "accepted")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Accept
        </button>
        <button
          onClick={() => updateStatus(selectedUser._id, "rejected")}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Reject
        </button>
        <button
          onClick={() => setSelectedUser(null)}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>

    
  );
  
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <h3 className="text-gray-600 text-sm">{label}</h3>
      <p className="text-2xl font-bold text-[#213729]">{value}</p>
    </div>
  );
}
