"use client"

import { useState } from "react"
import { InputScreen } from "@/components/deal-generator/input-screen"
import { LoadingScreen } from "@/components/deal-generator/loading-screen"
import { OutputScreen } from "@/components/deal-generator/output-screen"
import {
  DEFAULT_MIN_TAKE_HOME,
  DEMO_BUSINESS_URL,
  DEMO_MIN_TAKE_HOME,
} from "@/lib/deal-generator/constants"
import { dealDataSchema, type DealData } from "@/lib/deal-generator/schema"
import {
  isLikelyBusinessUrl,
  parseTakeHomeNumber,
  type TakeHomeValue,
} from "@/lib/deal-generator/utils"

type Screen = "input" | "loading" | "output"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("input")
  const [businessUrl, setBusinessUrl] = useState("")
  const [minTakeHome, setMinTakeHome] = useState<TakeHomeValue>(DEFAULT_MIN_TAKE_HOME)
  const [dealData, setDealData] = useState<DealData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const hasValidUrl = isLikelyBusinessUrl(businessUrl)
  const minTakeHomeNumber = parseTakeHomeNumber(minTakeHome)
  const isTakeHomeValid = Number.isFinite(minTakeHomeNumber) && minTakeHomeNumber > 0
  const isGenerateDisabled = !hasValidUrl || !isTakeHomeValid

  const handleGenerateDeal = async () => {
    if (!businessUrl.trim()) {
      alert("Please enter your booking or Instagram URL.")
      return
    }

    if (!hasValidUrl) {
      alert("Please enter a valid URL (must include http or .com).")
      return
    }

    if (!isTakeHomeValid) {
      alert("Please enter a valid minimum take-home amount.")
      return
    }

    setIsLoading(true)
    setDealData(null)
    setCurrentScreen("loading")

    try {
      const response = await fetch("/api/generate-deal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: businessUrl.trim(), takeHome: minTakeHomeNumber }),
      })

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(errorPayload?.error || "Failed to generate deal")
      }

      const payload = await response.json()
      const parsed = dealDataSchema.safeParse(payload)

      if (!parsed.success) {
        throw new Error("Invalid API response")
      }

      setDealData(parsed.data)
      setIsLoading(false)
      setCurrentScreen("output")
    } catch (error) {
      console.error(error)
      setIsLoading(false)
      setDealData(null)
      const message = error instanceof Error ? error.message : "Could not generate your deal. Please try again."
      alert(message)
      setCurrentScreen("input")
    }
  }

  const handleEdit = () => {
    setCurrentScreen("input")
  }

  const handleAutofillDemo = () => {
    setBusinessUrl(DEMO_BUSINESS_URL)
    setMinTakeHome(DEMO_MIN_TAKE_HOME)
  }

  if (currentScreen === "loading" || isLoading) {
    return <LoadingScreen />
  }

  if (currentScreen === "output" && dealData) {
    return <OutputScreen dealData={dealData} minTakeHome={minTakeHomeNumber} onEdit={handleEdit} />
  }

  return (
    <InputScreen
      businessUrl={businessUrl}
      setBusinessUrl={setBusinessUrl}
      minTakeHome={minTakeHome}
      setMinTakeHome={setMinTakeHome}
      onGenerate={handleGenerateDeal}
      onAutofillDemo={handleAutofillDemo}
      isGenerateDisabled={isGenerateDisabled}
      isLoading={isLoading}
    />
  )
}
