import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function escapeLikeInput(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, message } = body

    if (!name || !message) {
      return NextResponse.json(
        { error: 'Name and message are required' },
        { status: 400 }
      )
    }

    if (typeof name !== 'string' || name.length > 100) {
      return NextResponse.json(
        { error: 'Name must be 100 characters or less' },
        { status: 400 }
      )
    }

    if (typeof message !== 'string' || message.length > 5000) {
      return NextResponse.json(
        { error: 'Message must be 5000 characters or less' },
        { status: 400 }
      )
    }

    const forwardedFor = request.headers.get('x-forwarded-for')
    const ipAddress = forwardedFor?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    const opinion = await prisma.opinion.create({
      data: {
        name: name.trim(),
        message: message.trim(),
        ipAddress,
        userAgent,
      },
      select: {
        id: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Opinion submitted successfully',
        data: opinion,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving opinion:', error)
    return NextResponse.json(
      { error: 'Failed to save opinion. Please try again.' },
      { status: 500 }
    )
  }
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
      OR?: Array<{ name?: { contains: string; mode: 'insensitive' }; message?: { contains: string; mode: 'insensitive' } }>
      createdAt?: { gte?: Date; lte?: Date }
    } = {}

    if (search) {
      const escapedSearch = escapeLikeInput(search)
      where.OR = [
        { name: { contains: escapedSearch, mode: 'insensitive' } },
        { message: { contains: escapedSearch, mode: 'insensitive' } },
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

    const [opinions, total] = await Promise.all([
      prisma.opinion.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          message: true,
          ipAddress: true,
          createdAt: true,
        },
      }),
      prisma.opinion.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: opinions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching opinions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch opinions' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Opinion ID is required' },
        { status: 400 }
      )
    }

    await prisma.opinion.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Opinion deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting opinion:', error)
    return NextResponse.json(
      { error: 'Failed to delete opinion' },
      { status: 500 }
    )
  }
}
