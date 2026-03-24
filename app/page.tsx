"use client"

import { useState } from "react"
import { InputScreen } from "@/components/deal-generator/input-screen"
import { LoadingScreen } from "@/components/deal-generator/loading-screen"
import { OutputScreen } from "@/components/deal-generator/output-screen"
import { dealDataSchema, type DealData, type GenerateDealRequest } from "@/lib/deal-generator/schema"
import { track } from "@/lib/deal-generator/events"

type Screen = "input" | "loading" | "output"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("input")
  const [dealData, setDealData] = useState<DealData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [goalMetric, setGoalMetric] = useState(45)

  const handleGenerateDeal = async (payload: GenerateDealRequest) => {
    track({
      name: "deal_creation_started",
      props: { service: payload.service, price: payload.price },
    })

    setIsLoading(true)
    setDealData(null)
    setGoalMetric(payload.cost)
    setCurrentScreen("loading")

    try {
      const response = await fetch("/api/generate-deal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(errorPayload?.error || "Failed to generate deal")
      }

      const raw = await response.json()
      const parsed = dealDataSchema.safeParse(raw)
      if (!parsed.success) {
        throw new Error("Invalid API response")
      }

      setDealData(parsed.data)
      track({
        name: "ai_draft_generated",
        props: {
          titlePreview: parsed.data.title,
          evalTotal: parsed.data.evalScores.total,
        },
      })
      setCurrentScreen("output")
    } catch (error) {
      console.error(error)
      setDealData(null)
      const message = error instanceof Error ? error.message : "Could not generate your deal. Please try again."
      alert(message)
      setCurrentScreen("input")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setCurrentScreen("input")
  }

  if (currentScreen === "loading" || isLoading) {
    return <LoadingScreen />
  }

  if (currentScreen === "output" && dealData) {
    return <OutputScreen dealData={dealData} minTakeHome={goalMetric} onEdit={handleEdit} />
  }

  return <InputScreen onGenerate={handleGenerateDeal} isLoading={isLoading} />
}
