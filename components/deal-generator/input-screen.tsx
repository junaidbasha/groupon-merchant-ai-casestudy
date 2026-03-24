"use client"

import { useMemo, useState } from "react"
import { Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DEMO_INPUTS } from "@/lib/deal-generator/constants"
import type { GenerateDealRequest } from "@/lib/deal-generator/schema"

interface InputScreenProps {
  onGenerate: (payload: GenerateDealRequest) => void
  isLoading: boolean
}

const EMPTY_FORM: GenerateDealRequest = {
  service: "",
  price: 0,
  cost: 0,
  slowDays: "",
  studioDesc: "",
  goal: "",
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const

const parseDemoSlowDays = (slowDays: string) => {
  const normalized = slowDays.toLowerCase()
  return DAYS.filter((day) => normalized.includes(day.toLowerCase()))
}

export function InputScreen({ onGenerate, isLoading }: InputScreenProps) {
  const [form, setForm] = useState<GenerateDealRequest>(EMPTY_FORM)
  const [selectedDays, setSelectedDays] = useState<string[]>([])

  const isGenerateDisabled = useMemo(() => {
    return (
      !form.service.trim() ||
      selectedDays.length === 0 ||
      !form.studioDesc.trim() ||
      !form.goal.trim() ||
      !Number.isFinite(form.price) ||
      form.price <= 0 ||
      !Number.isFinite(form.cost) ||
      form.cost < 0
    )
  }, [form, selectedDays])

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <div className="flex justify-end p-4">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-400">
          Experiment: Margin-UI-v2 (Active)
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-balance text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Fill your slow days. Protect your margins.
            </h1>
            <p className="mt-3 text-pretty text-gray-600">
              Tell us about your studio. We&apos;ll write your deal, set margin-safe pricing, and score it for quality — in about 30 seconds.
            </p>
          </div>

          <div className="mb-8 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Zap className="h-4 w-4 text-amber-500" />
            <span>Takes 30 seconds. No marketing experience required.</span>
          </div>

          <div className="mb-4 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setForm(DEMO_INPUTS)
                setSelectedDays(parseDemoSlowDays(DEMO_INPUTS.slowDays))
              }}
              disabled={isLoading}
              className="text-xs font-medium text-emerald-700 underline decoration-emerald-300 underline-offset-4 transition-colors hover:text-emerald-800"
            >
              ⚡ Auto-fill from Groupon Merchant Profile
            </button>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="service" className="text-sm font-medium text-gray-700">Service Name</Label>
              <Input
                id="service"
                placeholder="Classic Lash Full Set"
                value={form.service}
                onChange={(e) => setForm((prev) => ({ ...prev, service: e.target.value }))}
                className="h-12 text-base shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium text-gray-700">Standard Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min={1}
                  step="0.01"
                  value={form.price || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, price: Number(e.target.value) || 0 }))}
                  className="h-12 text-base shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost" className="text-sm font-medium text-gray-700">Your Internal Cost ($) — Supplies & Labor</Label>
                <Input
                  id="cost"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.cost || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, cost: Number(e.target.value) || 0 }))}
                  className="h-12 text-base shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slowDays" className="text-sm font-medium text-gray-700">Slow Days</Label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => {
                  const isActive = selectedDays.includes(day)

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        setSelectedDays((prev) =>
                          prev.includes(day) ? prev.filter((value) => value !== day) : [...prev, day],
                        )
                      }}
                      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "border-emerald-500 bg-emerald-100 text-emerald-800"
                          : "border-gray-300 bg-white text-gray-700 hover:border-emerald-300"
                      }`}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="studioDesc" className="text-sm font-medium text-gray-700">Studio Description</Label>
              <Textarea
                id="studioDesc"
                rows={3}
                placeholder="Briefly describe your business and location"
                value={form.studioDesc}
                onChange={(e) => setForm((prev) => ({ ...prev, studioDesc: e.target.value }))}
                className="text-base shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal" className="text-sm font-medium text-gray-700">Goal</Label>
              <select
                id="goal"
                value={form.goal}
                onChange={(e) => setForm((prev) => ({ ...prev, goal: e.target.value }))}
                className="h-12 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm"
              >
                <option value="" disabled>Select a goal</option>
                <option value="Fill slow days">Fill slow days</option>
                <option value="Acquire long-term regulars">Acquire long-term regulars</option>
                <option value="Test Groupon for the first time">Test Groupon for the first time</option>
              </select>
            </div>

            <Button
              onClick={() => onGenerate({ ...form, slowDays: selectedDays.join(", ") })}
              disabled={isLoading || isGenerateDisabled}
              className="h-14 w-full bg-emerald-600 text-base font-semibold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl"
            >
              Generate Margin-Safe Deal
              <span className="ml-2">→</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
