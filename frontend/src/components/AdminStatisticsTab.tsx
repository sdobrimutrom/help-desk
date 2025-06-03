import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA66CC", "#33B5E5"];

export default function StatisticsTab() {
  const [stats, setStats] = useState<any>(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    fetch("http://localhost:8000/api/stats/overview/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setStats);
  }, []);

  if (!stats) return <div className="p-3">Loading statistics...</div>;

  const statusData = Object.entries(stats.status_counts).map(([key, value]) => ({
    name: key,
    value: value as number
  }));

  const categoryData = Object.entries(stats.category_counts).map(([key, value]) => ({
    name: key,
    value: value as number
  }));

  const ticketsByDayData = stats.tickets_by_day.map((item: any) => ({
    name: item.day,
    value: item.count
  }));

  const resolutionDistData = Object.entries(stats.resolution_distribution).map(([key, value]) => ({
    name: key,
    value: value as number
  }));

  const technicianLoadData = Object.entries(stats.technician_load).map(([key, value]) => ({
    name: key,
    value: value as number
  }));

  const topUsersData = Object.entries(stats.most_active_users).map(([key, value]) => ({
    name: key,
    value: value as number
  }));

  return (
    <div className="p-4">
      <div className="d-flex gap-2 mt-3">
        <a href="http://localhost/prometheus/" className="btn btn-outline-secondary" target="_blank">Prometheus</a>
        <a href="http://localhost/grafana/" className="btn btn-outline-secondary" target="_blank">Grafana</a>
      </div>
      <h3 className="mb-4">📊 Ticket Statistics Overview</h3>

      <div className="row">
        <div className="col-md-6 mb-4">
          <h5>Status Distribution</h5>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} dataKey="value" label outerRadius={80}>
                {statusData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="col-md-6 mb-4">
          <h5>Category Breakdown</h5>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <h5>Tickets Over Time</h5>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={ticketsByDayData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#0088FE" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="col-md-6 mb-4">
          <h5>Resolution Time Distribution</h5>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={resolutionDistData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <h5>Technician Load</h5>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart layout="vertical" data={technicianLoadData}>
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-md-6 mb-4">
          <h5>Most Active Users</h5>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart layout="vertical" data={topUsersData}>
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#AA66CC" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <h5>🕒 Average Resolution Time</h5>
          <div className="alert alert-info">
            {stats.average_resolution_time || "Not enough closed tickets"}
          </div>
        </div>
        <div className="col-md-6">
          <h5>❗ Tickets Without Technician</h5>
          <div className="alert alert-warning">
            {stats.unassigned_tickets} tickets are not assigned
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h5>🏆 Top Technician</h5>
        {stats.top_technician ? (
          <div className="alert alert-success">
            {stats.top_technician.username} — {stats.top_technician.resolved_tickets} closed tickets
          </div>
        ) : (
          <div className="alert alert-secondary">No technician data available</div>
        )}
      </div>
    </div>
  );
}