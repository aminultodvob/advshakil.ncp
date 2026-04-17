import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const opinions = await prisma.opinion.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        name: true,
        message: true,
        ipAddress: true,
        createdAt: true,
      },
    })

    const headers = ['Name', 'Message', 'IP Address', 'Date']
    const rows = opinions.map((op) => [
      `"${(op.name || 'Anonymous').replace(/"/g, '""')}"`,
      `"${(op.message || '').replace(/"/g, '""')}"`,
      `"${op.ipAddress || 'N/A'}"`,
      `"${new Date(op.createdAt).toLocaleString('en-US')}"`,
    ])

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n')

    const bom = '\uFEFF'
    const csvWithBom = bom + csv

    return new NextResponse(csvWithBom, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="opinions-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export opinions' },
      { status: 500 }
    )
  }
}
