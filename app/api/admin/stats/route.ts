import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)

    const [total, today, thisWeek, recent] = await Promise.all([
      prisma.opinion.count(),
      prisma.opinion.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.opinion.count({ where: { createdAt: { gte: weekStart } } }),
      prisma.opinion.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          message: true,
          createdAt: true,
        },
      }),
    ])

    return NextResponse.json({
      total,
      today,
      thisWeek,
      recent,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
