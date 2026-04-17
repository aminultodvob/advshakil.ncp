import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const videos = await prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, count: videos.length, data: videos })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { youtubeId } = await request.json()

    if (!youtubeId) {
      return NextResponse.json({ error: 'YouTube ID is required' }, { status: 400 })
    }

    // Automatically fetch title from YouTube
    let videoTitle = 'YouTube Video'
    try {
      const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`
      const res = await fetch(oembedUrl)
      if (res.ok) {
        const data = await res.json()
        videoTitle = data.title || videoTitle
      }
    } catch (e) {
      console.error('Failed to fetch YouTube title:', e)
    }

    const video = await prisma.video.create({
      data: {
        youtubeId,
        title: videoTitle,
        titleBn: videoTitle, // Defaulting Bengali title to the same fetched title
        isActive: true
      },
    })

    return NextResponse.json({ success: true, data: video })
  } catch (error) {
    console.error('Video creation error:', error)
    return NextResponse.json({ success: false, error: 'Failed to add video' }, { status: 500 })
  }
}
