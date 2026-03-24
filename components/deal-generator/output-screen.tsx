"use client"

import { useEffect, useMemo, useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import type { DealData } from "@/lib/deal-generator/schema"
import { computeEditRate, getEditRateStatus } from "@/lib/deal-generator/utils"
import { track } from "@/lib/deal-generator/events"

interface OutputScreenProps {
  minTakeHome: number
  dealData: DealData
  onEdit: () => void
}

const formatCurrency = (value: number) => `$${value.toFixed(2)}`

const scorePercent = (score: number) => {
  const clamped = Math.max(0, Math.min(10, score))
  return `${(clamped / 10) * 100}%`
}

export function OutputScreen({ minTakeHome, dealData, onEdit }: OutputScreenProps) {
  const [draft, setDraft] = useState<DealData>(dealData)
  const [editedFields, setEditedFields] = useState<Set<string>>(new Set())

  useEffect(() => {
    setDraft(dealData)
    setEditedFields(new Set())
  }, [dealData])

  const markEdited = (field: string) => {
    setEditedFields((prev) => {
      if (prev.has(field)) {
        return prev
      }

      const next = new Set(prev)
      next.add(field)
      const pct = computeEditRate(next.size)
      track({
        name: "draft_edited",
        props: {
          field,
          editCount: next.size,
          pct,
        },
      })
      return next
    })
  }

  const editRate = useMemo(() => computeEditRate(editedFields.size), [editedFields])
  const editRateStatus = useMemo(() => getEditRateStatus(editRate), [editRate])

  const goal = minTakeHome || 45
  const platformFee = draft.lowestDealPrice * 0.3
  const meetsGoal = draft.netMargin >= goal
  const goalMessage =
    meetsGoal
      ? `Meets your ${formatCurrency(goal)} take-home goal`
      : `Below your ${formatCurrency(goal)} take-home goal`
  const badgeStyles = meetsGoal ? "bg-emerald-100 animate-pulse" : "bg-amber-100"
  const badgeDotStyles = meetsGoal ? "bg-emerald-500" : "bg-amber-500"
  const badgeTextStyles = meetsGoal ? "text-emerald-800" : "text-amber-800"

  const statusStyles =
    editRateStatus === "target"
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : editRateStatus === "low"
        ? "text-sky-700 bg-sky-50 border-sky-200"
        : "text-amber-700 bg-amber-50 border-amber-200"

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <div className="flex justify-end p-4">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-400">
          Experiment: Margin-UI-v2 (Active)
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center px-6 pb-16 pt-4">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-balance text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Here is your optimized deal, ready to launch.
            </h1>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
            <div className="relative h-48 w-full bg-gradient-to-br from-rose-100 to-rose-50">
              <Image
                src="https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=400&fit=crop&crop=faces"
                alt="Lash lift treatment showing beautiful curled lashes"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-3 left-3">
                <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm backdrop-blur-sm">
                  {draft.category}
                </span>
              </div>
            </div>

            <div className="p-5">
              <Input
                value={draft.title}
                onChange={(e) => {
                  markEdited("title")
                  setDraft((prev) => ({ ...prev, title: e.target.value }))
                }}
                className="h-11 border-none px-0 text-xl font-bold text-gray-900 shadow-none focus-visible:ring-0"
              />
              <Input
                value={draft.tagline}
                onChange={(e) => {
                  markEdited("tagline")
                  setDraft((prev) => ({ ...prev, tagline: e.target.value }))
                }}
                className="mt-1 h-9 border-none px-0 text-sm font-medium text-emerald-700 shadow-none focus-visible:ring-0"
              />

              <div className="mt-4 space-y-2">
                {draft.options.map((option, index) => (
                  <div key={`${option.name}-${index}`} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <Input
                        value={option.name}
                        onChange={(e) => {
                          markEdited(index === 0 ? "option0" : "option1")
                          setDraft((prev) => ({
                            ...prev,
                            options: prev.options.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, name: e.target.value } : item,
                            ),
                          }))
                        }}
                        className="h-9 bg-white"
                      />
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={option.originalPrice}
                          onChange={(e) => {
                            markEdited(index === 0 ? "option0" : "option1")
                            setDraft((prev) => ({
                              ...prev,
                              options: prev.options.map((item, itemIndex) =>
                                itemIndex === index
                                  ? { ...item, originalPrice: Number(e.target.value) || 0 }
                                  : item,
                              ),
                            }))
                          }}
                          className="h-9 bg-white"
                        />
                        <Input
                          type="number"
                          value={option.dealPrice}
                          onChange={(e) => {
                            markEdited(index === 0 ? "option0" : "option1")
                            setDraft((prev) => ({
                              ...prev,
                              options: prev.options.map((item, itemIndex) =>
                                itemIndex === index
                                  ? { ...item, dealPrice: Number(e.target.value) || 0 }
                                  : item,
                              ),
                            }))
                          }}
                          className="h-9 bg-white"
                        />
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {index === 0 ? "Base tier" : "Premium tier"}
                    </div>
                  </div>
                ))}
              </div>

              <Textarea
                value={draft.description}
                onChange={(e) => {
                  markEdited("description")
                  setDraft((prev) => ({ ...prev, description: e.target.value }))
                }}
                rows={3}
                className="mt-3"
              />
              <Textarea
                value={draft.finePrint}
                onChange={(e) => {
                  markEdited("finePrint")
                  setDraft((prev) => ({ ...prev, finePrint: e.target.value }))
                }}
                rows={2}
                className="mt-3 text-xs"
              />

              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <h3 className="mb-3 font-semibold text-gray-900">Your Unit Economics</h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Customer Pays:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(draft.lowestDealPrice)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Groupon Platform Fee (~30%)⚑</span>
                    <span className="font-medium text-red-500">-{formatCurrency(platformFee)}</span>
                  </div>

                  <div className="my-2 border-t border-emerald-200" />

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-emerald-700">You Keep:</span>
                    <span className="text-lg font-bold text-emerald-700">{formatCurrency(draft.netMargin)}</span>
                  </div>
                </div>

                <div className={`mt-4 flex items-center gap-2 rounded-lg px-3 py-2 ${badgeStyles}`}>
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full ${badgeDotStyles}`}>
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${badgeTextStyles}`}>{goalMessage}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">⚑ Platform fee shown as 30% — actual rate varies by deal type and contract. Verify with your Groupon account manager.</p>
              </div>

              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-900">AI Quality Score</h3>
                  <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">⚑ Hypothesis — not yet validated vs. redemption rate</span>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs text-gray-700">
                      <span>Specificity</span>
                      <span>{draft.evalScores.specificity.score}/10</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-amber-100">
                      <div className="h-2 rounded-full bg-amber-500" style={{ width: scorePercent(draft.evalScores.specificity.score) }} />
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs text-gray-700">
                      <span>Conversion Language</span>
                      <span>{draft.evalScores.conversionLanguage.score}/10</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-amber-100">
                      <div className="h-2 rounded-full bg-amber-500" style={{ width: scorePercent(draft.evalScores.conversionLanguage.score) }} />
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs text-gray-700">
                      <span>Category Fit</span>
                      <span>{draft.evalScores.categoryFit.score}/10</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-amber-100">
                      <div className="h-2 rounded-full bg-amber-500" style={{ width: scorePercent(draft.evalScores.categoryFit.score) }} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-sm font-semibold text-gray-900">Total: {draft.evalScores.total}/30</div>
                <p className="text-xs text-amber-600 mt-2 border-t border-dashed border-amber-200 pt-2">Call 2 scores output from Call 1 — known self-favorability bias applies. In production: validate against redemption rate data within 60 days.</p>
              </div>

              <div className="mt-5 rounded-xl border border-sky-200 bg-sky-50/70 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Edit Rate</h3>
                  <span className={`rounded border px-2 py-0.5 text-xs font-medium ${statusStyles}`}>{editRateStatus}</span>
                </div>
                <p className="mt-2 text-sm text-gray-700">{editRate}% ({editedFields.size}/6 core fields edited)</p>
                <p className="mt-1 text-xs text-gray-500">Target range is 15-35%: AI does the heavy lifting while merchant personalizes final details.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Button
              onClick={() => {
                track({ name: "draft_submitted", props: { editRate, evalScore: draft.evalScores.total } })
                track({
                  name: "deal_submitted_for_review",
                  props: { service: draft.options[0]?.name || draft.title, evalScore: draft.evalScores.total, stub: true },
                })
                alert("Deal queued for review (prototype stub).")
              }}
              className="h-14 w-full bg-emerald-600 text-base font-semibold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl"
            >
              Publish Deal to Groupon
            </Button>
            <Button
              variant="outline"
              onClick={onEdit}
              className="h-12 w-full border-gray-300 text-base font-medium text-gray-700 transition-all hover:bg-gray-50"
            >
              Edit Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
