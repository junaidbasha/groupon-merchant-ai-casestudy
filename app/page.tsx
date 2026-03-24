"use client"

import { useState, useEffect } from "react"
import { InputScreen } from "@/components/deal-generator/input-screen"
import { LoadingScreen } from "@/components/deal-generator/loading-screen"
import { OutputScreen } from "@/components/deal-generator/output-screen"

type Screen = "input" | "loading" | "output"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("input")
  const [bookingUrl, setBookingUrl] = useState("")
  const [minTakeHome, setMinTakeHome] = useState("")

  const handleGenerate = () => {
    setCurrentScreen("loading")
  }

  const handleEdit = () => {
    setCurrentScreen("input")
  }

  // Auto-transition from loading to output after 4 seconds
  useEffect(() => {
    if (currentScreen === "loading") {
      const timeout = setTimeout(() => {
        setCurrentScreen("output")
      }, 4000)

      return () => clearTimeout(timeout)
    }
  }, [currentScreen])

  if (currentScreen === "loading") {
    return <LoadingScreen />
  }

  if (currentScreen === "output") {
    return <OutputScreen minTakeHome={minTakeHome} onEdit={handleEdit} />
  }

  return (
    <InputScreen
      bookingUrl={bookingUrl}
      setBookingUrl={setBookingUrl}
      minTakeHome={minTakeHome}
      setMinTakeHome={setMinTakeHome}
      onGenerate={handleGenerate}
    />
  )
}
