import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, count: videos.length, data: videos })
  } catch (error) {
    console.error('Fetch videos error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch videos' }, { status: 500 })
  }
}
