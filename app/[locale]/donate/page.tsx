"use client"

import { GSAPProvider } from "@/lib/gsap-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DonationForm } from "@/components/donation-form"
import { useTranslations } from "next-intl"

function DonateContent() {
  const t = useTranslations()

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-[#006A4E] via-[#005a42] to-[#003d2e]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-600/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-teal-600/15 via-transparent to-transparent" />
        </div>
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-emerald-400/15 to-transparent blur-3xl animate-pulse" />
        <div className="absolute bottom-[5%] right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-teal-400/10 to-transparent blur-3xl" />
      </div>

      <Header />

      <main className="relative z-10 pt-32 pb-16 px-4 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight tracking-tight">
              {t("donate.title")}
            </h1>
            <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed font-light">
              {t("donate.subtitle")}
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              {t("donate.form.registerTitle")}
            </h2>
            <p className="text-gray-600 text-center mb-6">
              {t("donate.form.registerSubtitle")}
            </p>
            <DonationForm />
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <span className="text-emerald-300 text-lg">•</span>
              <span className="text-white font-medium">{t("donate.trust.secure")}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <span className="text-emerald-300 text-lg">•</span>
              <span className="text-white font-medium">{t("donate.trust.receipt")}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <span className="text-emerald-300 text-lg">•</span>
              <span className="text-white font-medium">{t("donate.trust.transparent")}</span>
            </div>
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}

export default function DonatePage() {
  return (
    <GSAPProvider>
      <DonateContent />
    </GSAPProvider>
  )
}
