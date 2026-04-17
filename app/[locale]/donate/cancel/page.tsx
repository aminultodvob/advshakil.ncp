"use client"

import { useTranslations } from "next-intl"
import { GSAPProvider } from "@/lib/gsap-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function CancelContent() {
  const t = useTranslations()

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-red-600 to-rose-700" />

      <Header />

      <main className="relative z-10 pt-32 pb-16 px-4 flex-1">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            {t("donate.cancel.title")}
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg mx-auto">
            {t("donate.cancel.message")}
          </p>

          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8 mb-8 text-left">
            <h2 className="font-bold text-gray-900 text-xl mb-4">
              {t("donate.cancel.whatHappened")}
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-orange-500 text-xl mt-0.5">•</span>
                <span className="text-gray-700 text-base">{t("donate.cancel.point1")}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 text-xl mt-0.5">•</span>
                <span className="text-gray-700 text-base">{t("donate.cancel.point2")}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 text-xl mt-0.5">•</span>
                <span className="text-gray-700 text-base">{t("donate.cancel.point3")}</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-md px-6 py-6 text-base rounded-full">
                <Home className="w-5 h-5 mr-2" />
                {t("donate.success.goHome")}
              </Button>
            </Link>
            <Link href="/donate">
              <Button className="w-full sm:w-auto bg-white text-orange-700 hover:bg-white/90 px-6 py-6 text-base rounded-full shadow-xl">
                {t("donate.success.donateAgain")}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}

export default function CancelPage() {
  return (
    <GSAPProvider>
      <CancelContent />
    </GSAPProvider>
  )
}
