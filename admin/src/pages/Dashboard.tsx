
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, BarChart3, Activity } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Legend } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";


const userStats = {
  total: 1250,
  active: 875,
  roles: [
    { name: "Admin", value: 25, color: "#8b5cf6" },
    { name: "User", value: 1225, color: "#c4b5fd" },
  ],
};

const pdfStats = {
  total: 3728,
  sections: [
    { name: "Mood", value: 1245, color: "#8b5cf6" },
    { name: "Gratitude", value: 986, color: "#c4b5fd" },
    { name: "Goals", value: 845, color: "#a78bfa" },
    { name: "Notes", value: 652, color: "#ddd6fe" },
  ],
};

const weeklyLogins = [
  { name: "Mon", value: 120 },
  { name: "Tue", value: 145 },
  { name: "Wed", value: 135 },
  { name: "Thu", value: 160 },
  { name: "Fri", value: 180 },
  { name: "Sat", value: 90 },
  { name: "Sun", value: 75 },
];

const featureUsage = [
  { name: "Mood Tracking", value: 35 },
  { name: "Gratitude Journal", value: 25 },
  { name: "Goal Setting", value: 15 },
  { name: "Notes", value: 10 },
  { name: "Meditation", value: 15 },
];

const adminActivities = [
  { id: 1, action: "New user added", timestamp: "2023-04-07 09:15:23" },
  { id: 2, action: "Settings updated", timestamp: "2023-04-07 08:30:11" },
  { id: 3, action: "User permissions changed", timestamp: "2023-04-06 16:45:32" },
  { id: 4, action: "Backup completed", timestamp: "2023-04-06 01:00:00" },
  { id: 5, action: "New report template added", timestamp: "2023-04-05 14:22:18" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your admin dashboard</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* User Stats Card */}
        <Card className="admin-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Total Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">
              {userStats.total}
            </div>
            <p className="text-sm text-muted-foreground pt-1">
              {userStats.active} active users
            </p>
            <div className="h-[100px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userStats.roles}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={45}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {userStats.roles.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} users`, name]}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                    }}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* PDF Reports Card */}
        <Card className="admin-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">PDF Reports</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">
              {pdfStats.total}
            </div>
            <p className="text-sm text-muted-foreground pt-1">
              Total reports generated
            </p>
            <div className="h-[100px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={pdfStats.sections}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <Tooltip 
                    formatter={(value, name) => [`${value} reports`, name]}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {pdfStats.sections.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* App Usage Card */}
        <Card className="admin-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">App Usage</CardTitle>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
              Daily Logins
            </div>
            <div className="h-[100px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weeklyLogins}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <Tooltip 
                    formatter={(value) => [`${value} logins`]}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8b5cf6"
                    fill="#c4b5fd"
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Most Used Feature Card */}
        <Card className="admin-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Feature Usage</CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
              Most Used Features
            </div>
            <div className="h-[100px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={featureUsage}
                    cx="50%"
                    cy="50%"
                    outerRadius={45}
                    dataKey="value"
                    label={false}
                  >
                    {featureUsage.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`hsl(${265 - index * 10}, ${85 - index * 5}%, ${75 - index * 3}%)`} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}% usage`]}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Admin Activity Log */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>Admin Activity Log</CardTitle>
          <CardDescription>Recent actions performed by administrators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-3 py-3 text-left text-sm font-medium text-muted-foreground">Action</th>
                  <th className="px-3 py-3 text-left text-sm font-medium text-muted-foreground">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {adminActivities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-muted/50">
                    <td className="px-3 py-3 text-sm">{activity.action}</td>
                    <td className="px-3 py-3 text-sm text-muted-foreground">{activity.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
