import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function escapeLikeInput(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const search = searchParams.get('search') || ''
    const dateFrom = searchParams.get('from') || ''
    const dateTo = searchParams.get('to') || ''
    const skip = (page - 1) * limit

    const where: {
      OR?: Array<{ donorName?: { contains: string; mode: 'insensitive' }; email?: { contains: string; mode: 'insensitive' } }>
      createdAt?: { gte?: Date; lte?: Date }
    } = {}

    if (search) {
      const escapedSearch = escapeLikeInput(search)
      where.OR = [
        { donorName: { contains: escapedSearch, mode: 'insensitive' } },
        { email: { contains: escapedSearch, mode: 'insensitive' } },
      ]
    }

    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        const toDate = new Date(dateTo)
        toDate.setHours(23, 59, 59, 999)
        where.createdAt.lte = toDate
      }
    }

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const [donations, total, totalAmountAgg, todayCount, thisWeekCount] = await Promise.all([
      prisma.donation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.donation.count({ where }),
      prisma.donation.aggregate({
        where,
        _sum: { amount: true },
      }),
      prisma.donation.count({
        where: {
          ...where,
          createdAt: {
            ...(where.createdAt || {}),
            gte: todayStart,
          },
        },
      }),
      prisma.donation.count({
        where: {
          ...where,
          createdAt: {
            ...(where.createdAt || {}),
            gte: weekStart,
          },
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: donations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        totalAmount: totalAmountAgg._sum.amount || 0,
        totalCount: total,
        todayCount,
        thisWeekCount,
      },
    })
  } catch (error) {
    console.error('Error fetching donations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch donations' },
      { status: 500 }
    )
  }
}
