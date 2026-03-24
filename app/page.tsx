"use client"

import { useState } from "react"
import { InputScreen } from "@/components/deal-generator/input-screen"
import { LoadingScreen } from "@/components/deal-generator/loading-screen"
import { OutputScreen } from "@/components/deal-generator/output-screen"

type Screen = "input" | "loading" | "output"

type DealData = {
  dealPrice: number
  platformFee: number
  merchantNets: number
  title: string
  description: string
  finePrint: string
}

const parseDealData = (payload: unknown): DealData => {
  const raw = payload as Partial<Record<keyof DealData, unknown>>

  return {
    dealPrice: Number(raw.dealPrice),
    platformFee: Number(raw.platformFee),
    merchantNets: Number(raw.merchantNets),
    title: typeof raw.title === "string" ? raw.title : "",
    description: typeof raw.description === "string" ? raw.description : "",
    finePrint: typeof raw.finePrint === "string" ? raw.finePrint : "",
  }
}

const isValidDealData = (data: DealData) => {
  return (
    Number.isFinite(data.dealPrice) &&
    Number.isFinite(data.platformFee) &&
    Number.isFinite(data.merchantNets) &&
    data.title.trim().length > 0 &&
    data.description.trim().length > 0 &&
    data.finePrint.trim().length > 0
  )
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("input")
  const [businessUrl, setBusinessUrl] = useState("")
  const [minTakeHome, setMinTakeHome] = useState(45)
  const [dealData, setDealData] = useState<DealData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerateDeal = async () => {
    if (!businessUrl.trim()) {
      alert("Please enter your booking or Instagram URL.")
      return
    }

    if (!Number.isFinite(minTakeHome) || minTakeHome <= 0) {
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
        body: JSON.stringify({ url: businessUrl, takeHome: minTakeHome }),
      })

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(errorPayload?.error || "Failed to generate deal")
      }

      const payload = await response.json()
      const data = parseDealData(payload)
      if (!isValidDealData(data)) {
        throw new Error("Invalid API response")
      }

      setDealData(data)
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

  if (currentScreen === "loading" || isLoading) {
    return <LoadingScreen />
  }

  if (currentScreen === "output" && dealData) {
    return <OutputScreen dealData={dealData} minTakeHome={minTakeHome} onEdit={handleEdit} />
  }

  return (
    <InputScreen
      businessUrl={businessUrl}
      setBusinessUrl={setBusinessUrl}
      minTakeHome={minTakeHome}
      setMinTakeHome={setMinTakeHome}
      onGenerate={handleGenerateDeal}
      isLoading={isLoading}
    />
  )
}
