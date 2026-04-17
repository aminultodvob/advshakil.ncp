"use client"

import { useEffect, useState } from "react"
import { Search, Trash2, Loader2, ChevronLeft, ChevronRight, Calendar, Filter, Eye, X } from "lucide-react"

interface Opinion {
  id: string
  name: string
  message: string
  ipAddress: string
  createdAt: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function OpinionsPage() {
  const [opinions, setOpinions] = useState<Opinion[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [viewingOpinion, setViewingOpinion] = useState<Opinion | null>(null)

  useEffect(() => {
    void fetchOpinions(currentPage)
  }, [search, currentPage, dateFrom, dateTo, itemsPerPage])

  const fetchOpinions = async (page: number) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(itemsPerPage),
      })
      if (search) params.append("search", search)
      if (dateFrom) params.append("from", dateFrom)
      if (dateTo) params.append("to", dateTo)

      const response = await fetch(`/api/opinions?${params}`)
      const data = await response.json()
      setOpinions(data.data || [])
      setPagination(data.pagination)
    } catch (error) {
      console.error("Failed to fetch opinions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setCurrentPage(1)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this opinion?")) return

    setDeleting(id)
    try {
      const response = await fetch(`/api/opinions?id=${id}`, { method: "DELETE" })
      if (response.ok) {
        setOpinions(opinions.filter((op) => op.id !== id))
        if (pagination) {
          setPagination({ ...pagination, total: pagination.total - 1 })
        }
      }
    } catch (error) {
      console.error("Failed to delete:", error)
    } finally {
      setDeleting(null)
    }
  }

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Opinions</h1>
          <p className="text-gray-500 mt-1">Total {pagination?.total || 0} opinions found</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006A4E] focus:border-[#006A4E] outline-none w-full bg-white text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <button type="submit" className="px-6 py-2 bg-[#006A4E] text-white rounded-lg hover:bg-[#005a42] transition-colors whitespace-nowrap font-medium">
              Search
            </button>
          </form>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 font-medium ${showFilters ? "bg-[#006A4E] text-white shadow-lg" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"}`}
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                From Date
              </label>
              <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1) }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006A4E] focus:border-[#006A4E] outline-none bg-white text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                To Date
              </label>
              <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1) }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006A4E] focus:border-[#006A4E] outline-none bg-white text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Items per page</label>
              <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1) }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006A4E] focus:border-[#006A4E] outline-none bg-white text-gray-900">
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setDateFrom("")
                  setDateTo("")
                  setSearch("")
                  setSearchInput("")
                  setCurrentPage(1)
                }}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-[#006A4E]" />
          </div>
        ) : opinions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No opinions found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Message</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">IP Address</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {opinions.map((opinion) => (
                  <tr key={opinion.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4"><span className="font-medium text-gray-900">{opinion.name || "Anonymous"}</span></td>
                    <td className="px-6 py-4"><p className="text-gray-600 max-w-md line-clamp-2">{opinion.message}</p></td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-sm">{opinion.ipAddress || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-sm">{formatDateTime(opinion.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setViewingOpinion(opinion)} className="p-2 text-[#006A4E] hover:bg-green-50 rounded-lg transition-colors" title="View Details">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(opinion.id)} disabled={deleting === opinion.id} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50" title="Delete">
                          {deleting === opinion.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 gap-4">
            <span className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(1)} disabled={pagination.page <= 1} className="px-3 py-1 text-sm rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">First</button>
              <button onClick={() => setCurrentPage(pagination.page - 1)} disabled={pagination.page <= 1} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => setCurrentPage(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {viewingOpinion && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setViewingOpinion(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-[#006A4E] to-[#005540]">
                <h2 className="text-xl font-bold text-white">Opinion Details</h2>
                <button onClick={() => setViewingOpinion(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  <p className="text-gray-900 text-lg">{viewingOpinion.name || "Anonymous"}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-60 overflow-y-auto">
                    <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{viewingOpinion.message}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">IP Address</label>
                    <p className="text-gray-600 font-mono text-sm">{viewingOpinion.ipAddress || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Submitted At</label>
                    <p className="text-gray-600 text-sm">{formatDateTime(viewingOpinion.createdAt)}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end p-6 border-t border-gray-100 bg-gray-50">
                <button onClick={() => setViewingOpinion(null)} className="px-6 py-2 bg-[#006A4E] text-white rounded-lg hover:bg-[#005a42] transition-colors">Close</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
