"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsData {
  totalRequests: number;
  uniqueIPs: number;
  dailyStats: Array<{ date: string; requests: number; uniqueIPs: number }>;
}

interface TopIP {
  ip: string;
  count: number;
}

interface IPCheck {
  ip: string;
  dailyCount: number;
  suspicious: {
    suspicious: boolean;
    count: number;
    threshold: number;
  };
  blocked: boolean;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [topIPs, setTopIPs] = useState<TopIP[]>([]);
  const [checkIP, setCheckIP] = useState("");
  const [ipCheckResult, setIpCheckResult] = useState<IPCheck | null>(null);
  const [loading, setLoading] = useState(false);

  const authenticate = () => {
    if (adminToken) {
      setIsAuthenticated(true);
      loadData();
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Load analytics
      const analyticsRes = await fetch("/api/admin?action=analytics", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      }

      // Load top IPs
      const topIPsRes = await fetch("/api/admin?action=top-ips", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (topIPsRes.ok) {
        const topIPsData = await topIPsRes.json();
        setTopIPs(topIPsData);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    }
    setLoading(false);
  };

  const checkIPDetails = async () => {
    if (!checkIP.trim()) return;

    try {
      const response = await fetch(`/api/admin?action=check-ip&ip=${encodeURIComponent(checkIP)}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (response.ok) {
        const result = await response.json();
        setIpCheckResult(result);
      }
    } catch (error) {
      console.error("Failed to check IP:", error);
    }
  };

  const blockIP = async (ip: string, duration: number = 3600) => {
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "block", ip, duration }),
      });
      if (response.ok) {
        alert(`IP ${ip} has been blocked`);
        if (ipCheckResult && ipCheckResult.ip === ip) {
          checkIPDetails(); // Refresh the check result
        }
      }
    } catch (error) {
      console.error("Failed to block IP:", error);
    }
  };

  const unblockIP = async (ip: string) => {
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "unblock", ip }),
      });
      if (response.ok) {
        alert(`IP ${ip} has been unblocked`);
        if (ipCheckResult && ipCheckResult.ip === ip) {
          checkIPDetails(); // Refresh the check result
        }
      }
    } catch (error) {
      console.error("Failed to unblock IP:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="password"
              placeholder="Admin Token"
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              className="w-full p-2 border rounded"
              onKeyPress={(e) => e.key === "Enter" && authenticate()}
            />
            <button onClick={authenticate} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
              Login
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Access Monitor Dashboard</h1>
          <button onClick={loadData} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* Analytics Overview */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Requests (7 days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics.totalRequests.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Unique IPs (7 days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics.uniqueIPs.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Avg Requests/IP</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics.uniqueIPs > 0 ? (analytics.totalRequests / analytics.uniqueIPs).toFixed(1) : "0"}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Daily Stats */}
        {analytics && (
          <Card>
            <CardHeader>
              <CardTitle>Daily Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date</th>
                      <th className="text-right p-2">Requests</th>
                      <th className="text-right p-2">Unique IPs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.dailyStats.map((day) => (
                      <tr key={day.date} className="border-b">
                        <td className="p-2">{day.date}</td>
                        <td className="p-2 text-right">{day.requests.toLocaleString()}</td>
                        <td className="p-2 text-right">{day.uniqueIPs.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top IPs */}
        <Card>
          <CardHeader>
            <CardTitle>Top IPs (Today)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">IP Address</th>
                    <th className="text-right p-2">Requests</th>
                    <th className="text-center p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {topIPs.map((ipData) => (
                    <tr key={ipData.ip} className="border-b">
                      <td className="p-2 font-mono">{ipData.ip}</td>
                      <td className="p-2 text-right">{ipData.count.toLocaleString()}</td>
                      <td className="p-2 text-center space-x-2">
                        <button onClick={() => setCheckIP(ipData.ip)} className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600">
                          Check
                        </button>
                        <button onClick={() => blockIP(ipData.ip)} className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">
                          Block
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* IP Check Tool */}
        <Card>
          <CardHeader>
            <CardTitle>IP Investigation Tool</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <input type="text" placeholder="Enter IP address" value={checkIP} onChange={(e) => setCheckIP(e.target.value)} className="flex-1 p-2 border rounded" />
              <button onClick={checkIPDetails} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Check IP
              </button>
            </div>

            {ipCheckResult && (
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-bold mb-2">IP: {ipCheckResult.ip}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p>
                      <strong>Daily Count:</strong> {ipCheckResult.dailyCount}
                    </p>
                    <p>
                      <strong>Suspicious:</strong> {ipCheckResult.suspicious.suspicious ? "⚠️ Yes" : "✅ No"}
                    </p>
                    <p>
                      <strong>Threshold:</strong> {ipCheckResult.suspicious.threshold}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Blocked:</strong> {ipCheckResult.blocked ? "🚫 Yes" : "✅ No"}
                    </p>
                    <div className="mt-2 space-x-2">
                      {!ipCheckResult.blocked ? (
                        <>
                          <button onClick={() => blockIP(ipCheckResult.ip, 3600)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                            Block 1h
                          </button>
                          <button onClick={() => blockIP(ipCheckResult.ip, 86400)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                            Block 24h
                          </button>
                        </>
                      ) : (
                        <button onClick={() => unblockIP(ipCheckResult.ip)} className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                          Unblock
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
