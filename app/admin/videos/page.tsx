"use client"

import { useState, useEffect, useCallback } from "react"
import { Play, Plus, Trash2, Youtube, ExternalLink, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface VideoData {
  id: string
  youtubeId: string
  title: string
  titleBn: string
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newVideo, setNewVideo] = useState({ url: "" })

  const fetchVideos = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/videos")
      const data = await res.json()
      if (data.success) {
        setVideos(data.data)
      }
    } catch {
      toast.error("Failed to fetch videos")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchVideos()
  }, [fetchVideos])

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    const youtubeId = extractYoutubeId(newVideo.url)

    if (!youtubeId) {
      toast.error("Invalid YouTube URL")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          youtubeId,
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Video added successfully")
        setNewVideo({ url: "" })
        void fetchVideos()
      } else {
        toast.error(data.error || "Failed to add video")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteVideo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return

    try {
      const res = await fetch(`/api/admin/videos/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Video deleted")
        void fetchVideos()
      }
    } catch {
      toast.error("Failed to delete")
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Video Management</h1>
        <p className="text-gray-500">Add or remove YouTube videos for the randomized display</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900">
          <Plus className="w-5 h-5 text-[#006A4E]" />
          Add New Video
        </h2>
        <form onSubmit={handleAddVideo} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2 w-full">
            <Label htmlFor="url" className="text-gray-700">YouTube URL</Label>
            <Input id="url" placeholder="https://youtube.com/watch?v=..." className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400" value={newVideo.url} onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })} required />
          </div>
          <Button type="submit" className="bg-[#006A4E] hover:bg-[#005a42] text-white h-11 px-8 whitespace-nowrap" disabled={submitting}>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            Add Video
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl aspect-video animate-pulse" />)
        ) : videos.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <Youtube className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No videos added yet</p>
          </div>
        ) : (
          videos.map((video) => (
            <div key={video.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
              <div className="relative aspect-video">
                <img src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} alt={video.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href={`https://youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-full text-[#006A4E] hover:scale-110 transition-transform">
                    <ExternalLink className="w-6 h-6" />
                  </a>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="overflow-hidden">
                  <h3 className="font-bold text-gray-900 truncate">{video.title}</h3>
                  <p className="text-sm text-gray-500 truncate">{video.titleBn}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteVideo(video.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
