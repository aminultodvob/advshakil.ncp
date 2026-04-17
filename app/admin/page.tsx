"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MessageSquare, Calendar, TrendingUp, Eye, Download, Loader2 } from "lucide-react"
import { StatsCard } from "@/components/admin/stats-card"

interface Stats {
  total: number
  today: number
  thisWeek: number
  recent: Array<{
    id: string
    name: string
    message: string
    createdAt: string
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const response = await fetch("/api/admin/export")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `opinions-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#006A4E]" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of all opinions</p>
        </div>
        <button onClick={handleExport} className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#006A4E] text-white rounded-lg hover:bg-[#005a42] transition-all shadow-lg shadow-green-900/10 font-medium">
          <Download className="w-5 h-5" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Total Opinions" value={stats?.total || 0} icon={MessageSquare} description="All time submissions" />
        <StatsCard title="Today" value={stats?.today || 0} icon={Calendar} description="Submitted today" />
        <StatsCard title="This Week" value={stats?.thisWeek || 0} icon={TrendingUp} description="Last 7 days" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Opinions</h2>
          <Link href="/admin/opinions" className="text-sm text-[#006A4E] hover:underline flex items-center gap-1">
            <Eye className="w-4 h-4" />
            View All
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {stats?.recent?.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No opinions found</div>
          ) : (
            stats?.recent?.map((opinion) => (
              <div key={opinion.id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{opinion.name || "Anonymous"}</h3>
                    <p className="text-gray-600 mt-1 line-clamp-2">{opinion.message}</p>
                  </div>
                  <span className="text-sm text-gray-400 whitespace-nowrap">
                    {new Date(opinion.createdAt).toLocaleDateString("en-US")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
