"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, BookOpen, Star, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function AdminDashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await api.get("/dashboard/stats");
      return res.data.data;
    }
  });
  const stats = dashboardData ? [
    { title: "Total Destinasi", value: dashboardData.stats.totalDestinations.toString(), icon: MapPin, color: "text-blue-500" },
    { title: "Wisatawan Baru", value: dashboardData.stats.totalUsers.toString(), icon: Users, color: "text-green-500" },
    { title: "Total Reservasi", value: dashboardData.stats.totalBookings.toString(), icon: BookOpen, color: "text-amber-500" },
    { title: "Ulasan Menunggu", value: dashboardData.stats.newReviews.toString(), icon: Star, color: "text-purple-500" },
    { title: "Event Mendatang", value: dashboardData.stats.upcomingEvents.toString(), icon: Calendar, color: "text-pink-500" },
  ] : [
    { title: "Total Destinasi", value: "-", icon: MapPin, color: "text-blue-500" },
    { title: "Wisatawan Baru", value: "-", icon: Users, color: "text-green-500" },
    { title: "Total Reservasi", value: "-", icon: BookOpen, color: "text-amber-500" },
    { title: "Ulasan Menunggu", value: "-", icon: Star, color: "text-purple-500" },
    { title: "Event Mendatang", value: "-", icon: Calendar, color: "text-pink-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Ringkasan aktivitas dan metrik pariwisata.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Tren Pengunjung (6 Bulan Terakhir)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardData?.chartVisitorsData || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Reservasi per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData?.chartBookingsData || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: '#f1f5f9' }}
                    />
                    <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Reservasi Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-3 rounded-tl-lg">ID Reservasi</th>
                    <th className="px-6 py-3">Pelanggan</th>
                    <th className="px-6 py-3">Destinasi</th>
                    <th className="px-6 py-3">Tanggal Kunjungan</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center">Loading...</td>
                    </tr>
                  ) : dashboardData?.recentBookings?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">Belum ada reservasi</td>
                    </tr>
                  ) : (
                    dashboardData?.recentBookings?.map((booking: any) => (
                      <tr key={booking.id} className="border-b dark:border-slate-800">
                        <td className="px-6 py-4 font-medium">{booking.bookingNumber}</td>
                        <td className="px-6 py-4">{booking.user.fullName}</td>
                        <td className="px-6 py-4">{booking.destination.name}</td>
                        <td className="px-6 py-4">{new Date(booking.visitDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            booking.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                            booking.status === "cancelled" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}>
                            {booking.status === "completed" ? "Selesai" : booking.status === "cancelled" ? "Dibatalkan" : "Menunggu"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
