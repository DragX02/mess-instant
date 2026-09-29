import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers as getHeaders } from "next/headers"
import { hashPassword, verifyPassword } from "better-auth/crypto"

export async function POST(request: NextRequest) {
  try {
    const requestHeaders = await getHeaders()
    const session = await auth.api.getSession({ headers: requestHeaders })

    if (!session?.user) {
      return NextResponse.json({ message: "Non authentifié" }, { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword, confirmPassword } = body

    // Input validation
    if (!currentPassword?.trim() || !newPassword?.trim() || !confirmPassword?.trim()) {
      return NextResponse.json({ message: "Tous les champs sont requis" }, { status: 400 })
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { message: "Les mots de passe ne correspondent pas" },
        { status: 400 },
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "Le nouveau mot de passe doit avoir au moins 8 caractères" },
        { status: 400 },
      )
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { message: "Le nouveau mot de passe doit être différent de l'actuel" },
        { status: 400 },
      )
    }

    // Get account with password (any provider that has a password set)
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        password: { not: null },
      },
    })

    if (!account || !account.password) {
      console.warn(`No password account found for user ${session.user.id}`)
      // List all accounts for debugging
      const allAccounts = await prisma.account.findMany({
        where: { userId: session.user.id },
      })
      console.warn(
        `Available accounts for user ${session.user.id}:`,
        allAccounts.map((a) => ({
          providerId: a.providerId,
          accountId: a.accountId,
          hasPassword: !!a.password,
        })),
      )
      return NextResponse.json(
        { message: "Aucun mot de passe défini pour ce compte" },
        { status: 400 },
      )
    }

    console.log(`Found account for user ${session.user.id}:`, {
      providerId: account.providerId,
      accountId: account.accountId,
      passwordLength: account.password?.length,
      passwordStarts: account.password?.substring(0, 6),
    })

    // Verify current password using better-auth's crypto
    let isPasswordValid = false
    try {
      isPasswordValid = await verifyPassword({
        hash: account.password,
        password: currentPassword,
      })
      console.log(`Password validation for user ${session.user.id}: ${isPasswordValid}`)
    } catch (compareError) {
      console.error(`Password verify error for user ${session.user.id}:`, compareError)
      return NextResponse.json({ message: "Mot de passe actuel incorrect" }, { status: 401 })
    }

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Mot de passe actuel incorrect" }, { status: 401 })
    }

    // Hash new password using better-auth's crypto
    const hashedPassword = await hashPassword(newPassword)

    // Update password in database with timestamp
    await prisma.account.update({
      where: { id: account.id },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, message: "Mot de passe changé" })
  } catch (error: unknown) {
    console.error("Erreur lors du changement de mot de passe:", error)
    return NextResponse.json(
      { message: "Erreur lors du changement de mot de passe" },
      { status: 500 },
    )
  }
}
