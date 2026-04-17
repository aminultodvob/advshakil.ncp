import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { donorName, email, amount, isAnonymous } = body

    if (!donorName || !email || !amount) {
      return NextResponse.json(
        { error: 'Donor name, email, and amount are required' },
        { status: 400 }
      )
    }

    const numAmount = Number(amount)
    if (!Number.isFinite(numAmount) || numAmount < 10) {
      return NextResponse.json(
        { error: 'Minimum donation amount is 10' },
        { status: 400 }
      )
    }

    const donation = await prisma.donation.create({
      data: {
        donorName: donorName.trim(),
        email: email.trim().toLowerCase(),
        amount: numAmount,
        isAnonymous: Boolean(isAnonymous),
      },
      select: {
        id: true,
      },
    })

    return NextResponse.json({
      success: true,
      referenceId: donation.id,
      donationId: donation.id,
      message: 'Support registration completed successfully.',
    })
  } catch (error) {
    console.error('Error creating donation:', error)
    return NextResponse.json(
      { error: 'Failed to create donation. Please try again.' },
      { status: 500 }
    )
  }
}
