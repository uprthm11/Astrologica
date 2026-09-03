import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getMbtiQuestions, evaluateMbti, API_BASE_URL } from '../services/api'
import ClarityBars from './ClarityBars'
import CognitiveStack from './CognitiveStack'

// 24-Item Fallback Question Bank
const FALLBACK_QUESTIONS = [
  // --- Axis 1: Energy (E vs I) ---
  {
    id: 1,
    axis: 'EI',
    axis_name: 'Energy Orientation (Extraversion vs Introversion)',
    prompt: 'When facing a high-energy social weekend with numerous gatherings:',
    option_a: { text: 'I feel energized, invigorated, and excited to actively participate and connect with many people.', trait: 'E', val: 1 },
    option_b: { text: 'I feel the need to preserve personal space and recharge in quiet solitude with focused activities.', trait: 'I', val: -1 }
  },
  {
    id: 2,
    axis: 'EI',
    axis_name: 'Energy Orientation (Extraversion vs Introversion)',
    prompt: 'When working through a complex, unfamiliar challenge:',
    option_a: { text: 'I prefer to talk it through out loud, brainstorm dynamically with peers, and externalize my thoughts.', trait: 'E', val: 1 },
    option_b: { text: 'I prefer to contemplate it internally in depth before presenting a refined conclusion.', trait: 'I', val: -1 }
  },
  {
    id: 3,
    axis: 'EI',
    axis_name: 'Energy Orientation (Extraversion vs Introversion)',
    prompt: 'In your daily environment and professional rhythm, you feel most in your element when:',
    option_a: { text: 'Engaged in multiple active conversations, collaborative initiatives, and dynamic stimuli.', trait: 'E', val: 1 },
    option_b: { text: 'Immersed in sustained deep-focus sessions with minimal external interruptions.', trait: 'I', val: -1 }
  },
  {
    id: 4,
    axis: 'EI',
    axis_name: 'Energy Orientation (Extraversion vs Introversion)',
    prompt: 'When entering a room of unfamiliar people, your natural inclination is to:',
    option_a: { text: 'Introduce yourself freely, initiate lively rapport, and seek out new connections.', trait: 'E', val: 1 },
    option_b: { text: 'Observe the atmosphere quietly, wait for organic openings, or connect deeply with one or two individuals.', trait: 'I', val: -1 }
  },
  {
    id: 5,
    axis: 'EI',
    axis_name: 'Energy Orientation (Extraversion vs Introversion)',
    prompt: 'Regarding your circle of friends and intellectual collaborators:',
    option_a: { text: 'I maintain a broad, diverse network of acquaintances across varied walks of life.', trait: 'E', val: 1 },
    option_b: { text: 'I invest deeply in a select, intimate inner circle built on profound trust and mutual understanding.', trait: 'I', val: -1 }
  },
  {
    id: 6,
    axis: 'EI',
    axis_name: 'Energy Orientation (Extraversion vs Introversion)',
    prompt: 'After a long, demanding week of intense work, what truly restores your vitality?',
    option_a: { text: 'Meeting friends for dinner, attending an event, or engaging in active external stimulation.', trait: 'E', val: 1 },
    option_b: { text: 'A calm, quiet evening at home with a book, personal project, or restful atmosphere.', trait: 'I', val: -1 }
  },

  // --- Axis 2: Information (S vs N) ---
  {
    id: 7,
    axis: 'SN',
    axis_name: 'Information Processing (Sensing vs Intuition)',
    prompt: 'When learning a new subject or evaluating an opportunity, you first gravitate toward:',
    option_a: { text: 'Concrete facts, verified data, tangible applications, and immediate practical details.', trait: 'S', val: 1 },
    option_b: { text: 'Underlying theories, future possibilities, abstract frameworks, and symbolic patterns.', trait: 'N', val: -1 }
  },
  {
    id: 8,
    axis: 'SN',
    axis_name: 'Information Processing (Sensing vs Intuition)',
    prompt: 'When describing an event or experience to others, you naturally focus on:',
    option_a: { text: 'Chronological, sequential accuracy and vivid sensory descriptions of what actually occurred.', trait: 'S', val: 1 },
    option_b: { text: 'The overall thematic impression, underlying meaning, and symbolic significance.', trait: 'N', val: -1 }
  },
  {
    id: 9,
    axis: 'SN',
    axis_name: 'Information Processing (Sensing vs Intuition)',
    prompt: 'When presented with a novel, unorthodox idea, your instinctive instinct is to:',
    option_a: { text: 'Examine whether it has proven precedent, realistic viability, and immediate utility.', trait: 'S', val: 1 },
    option_b: { text: 'Envision how it could disrupt existing paradigms and branch into uncharted future territory.', trait: 'N', val: -1 }
  },
  {
    id: 10,
    axis: 'SN',
    axis_name: 'Information Processing (Sensing vs Intuition)',
    prompt: 'In your daily perspective, you tend to see the world primarily through the lens of:',
    option_a: { text: 'What is concrete, present, observable, and measurable in current reality.', trait: 'S', val: 1 },
    option_b: { text: 'What could be, speculative potential, hidden implications, and future trajectories.', trait: 'N', val: -1 }
  },
  {
    id: 11,
    axis: 'SN',
    axis_name: 'Information Processing (Sensing vs Intuition)',
    prompt: 'When solving practical problems, you feel most confident when relying on:',
    option_a: { text: 'Proven methodologies, established best practices, and direct sensory verification.', trait: 'S', val: 1 },
    option_b: { text: 'Original intuitive hunches, conceptual models, and novel lateral connections.', trait: 'N', val: -1 }
  },
  {
    id: 12,
    axis: 'SN',
    axis_name: 'Information Processing (Sensing vs Intuition)',
    prompt: 'You are more naturally admired for being:',
    option_a: { text: 'Grounded, realistic, accurate, and deeply attuned to tangible detail.', trait: 'S', val: 1 },
    option_b: { text: 'Visionary, conceptual, innovative, and attuned to the bigger picture.', trait: 'N', val: -1 }
  },

  // --- Axis 3: Decisions (T vs F) ---
  {
    id: 13,
    axis: 'TF',
    axis_name: 'Decision Making (Thinking vs Feeling)',
    prompt: 'When making an important critical decision, your ultimate benchmark is:',
    option_a: { text: 'Objective logic, rigorous consistency, impartial fairness, and empirical efficacy.', trait: 'T', val: 1 },
    option_b: { text: 'Human empathy, core personal values, relational impact, and individual authenticity.', trait: 'F', val: -1 }
  },
  {
    id: 14,
    axis: 'TF',
    axis_name: 'Decision Making (Thinking vs Feeling)',
    prompt: 'When someone close to you shares a distressing problem, your first natural response is to:',
    option_a: { text: 'Analyze the root cause and systematically formulate an actionable, rational solution.', trait: 'T', val: 1 },
    option_b: { text: 'Offer warm emotional presence, active validation, and deep empathetic understanding.', trait: 'F', val: -1 }
  },
  {
    id: 15,
    axis: 'TF',
    axis_name: 'Decision Making (Thinking vs Feeling)',
    prompt: 'When evaluating a debate or argument, you are most unsettled by:',
    option_a: { text: 'Logical fallacies, sloppy reasoning, factual inconsistencies, and flawed premises.', trait: 'T', val: 1 },
    option_b: { text: 'Cruelty, callousness, disrespect for human dignity, and lack of compassion.', trait: 'F', val: -1 }
  },
  {
    id: 16,
    axis: 'TF',
    axis_name: 'Decision Making (Thinking vs Feeling)',
    prompt: 'In teamwork and leadership, you believe it is more vital to be:',
    option_a: { text: 'Direct, fair, and uncompromising in pursuing high standards of competence.', trait: 'T', val: 1 },
    option_b: { text: 'Encouraging, supportive, and dedicated to building emotional safety and harmony.', trait: 'F', val: -1 }
  },
  {
    id: 17,
    axis: 'TF',
    axis_name: 'Decision Making (Thinking vs Feeling)',
    prompt: 'When providing feedback to a colleague or collaborator:',
    option_a: { text: 'I prioritize clear, frank critique focused on optimizing performance and fixing errors.', trait: 'T', val: 1 },
    option_b: { text: 'I carefully cushion my observations with encouragement to protect morale and connection.', trait: 'F', val: -1 }
  },
  {
    id: 18,
    axis: 'TF',
    axis_name: 'Decision Making (Thinking vs Feeling)',
    prompt: 'When a rule or policy conflicts with an individual’s unique emotional circumstances:',
    option_a: { text: 'The rule must be upheld impartially to maintain justice and systematic integrity.', trait: 'T', val: 1 },
    option_b: { text: 'Compassion and individual extenuating circumstances should allow for flexible grace.', trait: 'F', val: -1 }
  },

  // --- Axis 4: Lifestyle (J vs P) ---
  {
    id: 19,
    axis: 'JP',
    axis_name: 'Lifestyle & Execution (Judging vs Perceiving)',
    prompt: 'When organizing your schedule, vacations, or projects, you prefer:',
    option_a: { text: 'A clear, well-structured plan with defined milestones, deadlines, and booked itineraries.', trait: 'J', val: 1 },
    option_b: { text: 'A flexible, open-ended framework that allows for spontaneous changes and unexpected detours.', trait: 'P', val: -1 }
  },
  {
    id: 20,
    axis: 'JP',
    axis_name: 'Lifestyle & Execution (Judging vs Perceiving)',
    prompt: 'When working on a major deadline-driven project, your working style tends to be:',
    option_a: { text: 'Steady, disciplined progression scheduled well in advance to avoid last-minute rush.', trait: 'J', val: 1 },
    option_b: { text: 'Dynamic bursts of creative adrenaline and intense flow close to the target deadline.', trait: 'P', val: -1 }
  },
  {
    id: 21,
    axis: 'JP',
    axis_name: 'Lifestyle & Execution (Judging vs Perceiving)',
    prompt: 'In your physical space and digital desktop, you feel most at peace with:',
    option_a: { text: 'Orderly, categorized, tidy environments with designated spaces for everything.', trait: 'J', val: 1 },
    option_b: { text: 'Organic, dynamic arrangements where ongoing projects remain visibly accessible.', trait: 'P', val: -1 }
  },
  {
    id: 22,
    axis: 'JP',
    axis_name: 'Lifestyle & Execution (Judging vs Perceiving)',
    prompt: 'When a settled decision is unexpectedly reopened for deliberation:',
    option_a: { text: 'I feel frustrated by the inefficiency and disruption to closure and momentum.', trait: 'J', val: 1 },
    option_b: { text: 'I welcome the opportunity to explore new data, refine possibilities, and adapt.', trait: 'P', val: -1 }
  },
  {
    id: 23,
    axis: 'JP',
    axis_name: 'Lifestyle & Execution (Judging vs Perceiving)',
    prompt: 'Your ideal lifestyle is best characterized as:',
    option_a: { text: 'Structured, predictable, deliberate, with clear boundaries and steady commitments.', trait: 'J', val: 1 },
    option_b: { text: 'Spontaneous, adventurous, adaptable, responsive to emerging opportunities.', trait: 'P', val: -1 }
  },
  {
    id: 24,
    axis: 'JP',
    axis_name: 'Lifestyle & Execution (Judging vs Perceiving)',
    prompt: 'Once you have completed a task or reached a conclusion, your immediate feeling is:',
    option_a: { text: 'Deep satisfaction at checking it off, settling the matter, and archiving closure.', trait: 'J', val: 1 },
    option_b: { text: 'Curiosity regarding what interesting new door or avenue this has unlocked next.', trait: 'P', val: -1 }
  }
]

export default function MBTIQuiz({ onComplete, completedData }) {
  const [questions, setQuestions] = useState(FALLBACK_QUESTIONS)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(completedData || null)

  // Fetch server questions if available
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getMbtiQuestions()
        if (data && data.questions && data.questions.length === 24) {
          setQuestions(data.questions)
        }
      } catch (err) {
        console.log('Using local questions bank fallback.')
      }
    }
    fetchQuestions()
  }, [])

  useEffect(() => {
    if (completedData) {
      setResult(completedData)
    }
  }, [completedData])

  const totalQuestions = questions.length

  const handleSelectOption = useCallback(
    async (value) => {
      const updatedAnswers = [...answers, value]
      setAnswers(updatedAnswers)

      if (currentStep < totalQuestions - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        // Complete -> evaluate 24 responses
        setLoading(true)
        setError(null)
        try {
          const data = await evaluateMbti(updatedAnswers)
          setResult(data)
          if (onComplete) {
            onComplete(data)
          }
        } catch (err) {
          console.error('MBTI Evaluation Error:', err)
          setError(
            err.response?.data?.detail ||
              'Failed to evaluate psychometric assessment. Ensure backend is running.'
          )
        } finally {
          setLoading(false)
        }
      }
    },
    [answers, currentStep, totalQuestions, onComplete]
  )

  // Keyboard navigation support: '1' or 'A' for Option A, '2' or 'B' for Option B, Backspace / Left for Previous
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (result || loading) return

      const key = e.key.toUpperCase()
      if (key === '1' || key === 'A') {
        e.preventDefault()
        handleSelectOption(1)
      } else if (key === '2' || key === 'B') {
        e.preventDefault()
        handleSelectOption(-1)
      } else if ((key === 'ARROWLEFT' || key === 'BACKSPACE') && currentStep > 0) {
        e.preventDefault()
        setCurrentStep((prev) => prev - 1)
        setAnswers((prev) => prev.slice(0, -1))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [result, loading, currentStep, handleSelectOption])

  const handleReset = () => {
    setCurrentStep(0)
    setAnswers([])
    setResult(null)
    setError(null)
    setLoading(false)
  }

  const currentQ = questions[currentStep] || FALLBACK_QUESTIONS[0]
  const progressPct = Math.round(((currentStep + 1) / totalQuestions) * 100)

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!result && !loading ? (
          /* --- Interactive Question Card --- */
          <motion.div
            key={`question-${currentStep}`}
            initial={{ opacity: 0, x: 25, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -25, scale: 0.96 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="relative p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-indigo-500/20 shadow-2xl backdrop-blur-xl text-left"
          >
            {/* Ambient Nebula Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header: Section + Step Counter */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300 bg-indigo-950/70 border border-indigo-500/30 px-3 py-1 rounded-full">
                Question {currentStep + 1} of {totalQuestions}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {currentQ.axis_name}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-950 rounded-full mb-6 overflow-hidden border border-slate-800">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"
                initial={{ width: `${(currentStep / totalQuestions) * 100}%` }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Question Prompt */}
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                {currentQ.prompt}
              </h2>
              <div className="text-[11px] font-mono text-slate-500 mt-1 flex items-center gap-2">
                <span>⌨️ Press <strong className="text-indigo-300">1 / A</strong> for Option A, <strong className="text-purple-300">2 / B</strong> for Option B</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs">
                ⚠️ {error}
              </div>
            )}

            {/* Forced-Choice Option Cards */}
            <div className="space-y-3.5">
              {/* Option A */}
              <motion.button
                onClick={() => handleSelectOption(1)}
                whileHover={{ scale: 1.015, y: -2 }}
                whileTap={{ scale: 0.985 }}
                className="w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/50 via-slate-900 to-slate-950 border border-indigo-500/30 hover:border-indigo-400 text-left transition duration-200 cursor-pointer flex items-start gap-4 shadow-lg group"
              >
                <span className="w-8 h-8 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-mono font-black text-sm flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition">
                  A
                </span>
                <div className="flex-1">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 mb-1">
                    Option A &bull; {currentQ.option_a.trait} Preference
                  </div>
                  <div className="text-sm sm:text-base font-medium text-slate-100 leading-snug">
                    {currentQ.option_a.text}
                  </div>
                </div>
              </motion.button>

              {/* Option B */}
              <motion.button
                onClick={() => handleSelectOption(-1)}
                whileHover={{ scale: 1.015, y: -2 }}
                whileTap={{ scale: 0.985 }}
                className="w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-slate-950 border border-purple-500/30 hover:border-purple-400 text-left transition duration-200 cursor-pointer flex items-start gap-4 shadow-lg group"
              >
                <span className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 font-mono font-black text-sm flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition">
                  B
                </span>
                <div className="flex-1">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 mb-1">
                    Option B &bull; {currentQ.option_b.trait} Preference
                  </div>
                  <div className="text-sm sm:text-base font-medium text-slate-100 leading-snug">
                    {currentQ.option_b.text}
                  </div>
                </div>
              </motion.button>
            </div>

            {/* Back Button */}
            {currentStep > 0 && (
              <button
                onClick={() => {
                  setCurrentStep(currentStep - 1)
                  setAnswers(answers.slice(0, -1))
                }}
                className="mt-6 text-xs text-slate-500 hover:text-slate-300 transition flex items-center gap-1 mx-auto cursor-pointer"
              >
                ← Back to Question {currentStep}
              </button>
            )}
          </motion.div>
        ) : loading ? (
          /* --- Loading Transition Card --- */
          <motion.div
            key="loading-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-12 rounded-3xl bg-slate-900/90 border border-indigo-500/20 shadow-2xl backdrop-blur-xl text-center space-y-6"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center animate-pulse">
              <span className="text-3xl animate-spin">🔮</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Synthesizing Psychometric Profile...</h3>
              <p className="text-xs text-slate-400 mt-1">
                Calculating Preference Clarity Index & Jungian Cognitive Stack
              </p>
            </div>
          </motion.div>
        ) : (
          /* --- Comprehensive Psychometric Result View --- */
          <motion.div
            key="mbti-result-card"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }}
            className="space-y-6 text-left"
          >
            {/* Top Archetype Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/90 via-slate-900 to-purple-950/90 border border-indigo-500/30 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-indigo-300 bg-indigo-900/60 border border-indigo-500/30 rounded-full">
                  🧠 Psychometric Assessment &bull; 24-Item Complete
                </div>
                <button
                  onClick={handleReset}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                >
                  ↺ Retake
                </button>
              </div>

              {/* 4-Letter Code Display */}
              <div className="flex items-center gap-2 sm:gap-3 my-4">
                {result.mbti_type.split('').map((letter, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.08, type: 'spring' }}
                    className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl bg-gradient-to-b from-indigo-800/80 via-slate-950 to-slate-900 border border-indigo-400/40 shadow-xl flex items-center justify-center font-black text-2xl sm:text-3xl text-indigo-200 tracking-wider"
                  >
                    {letter}
                  </motion.div>
                ))}
                <div className="ml-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {result.archetype}
                  </h2>
                  <div className="text-xs text-purple-300 font-semibold">{result.title}</div>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed italic border-l-2 border-indigo-500 pl-3 my-4">
                "{result.description}"
              </p>

              {/* Strengths & Growth Tags */}
              {result.strengths && (
                <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
                      Core Strengths:
                    </span>
                    <ul className="mt-1 space-y-0.5 text-slate-300 list-disc list-inside">
                      {result.strengths.slice(0, 3).map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">
                      Growth Frontiers:
                    </span>
                    <ul className="mt-1 space-y-0.5 text-slate-300 list-disc list-inside">
                      {result.growth_areas.slice(0, 2).map((g, idx) => (
                        <li key={idx}>{g}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Preference Clarity Index Bipolar Bars */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/20 shadow-xl backdrop-blur-xl">
              <ClarityBars preferenceClarity={result.preference_clarity} />
            </div>

            {/* Jungian Cognitive Architecture Matrix */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/20 shadow-xl backdrop-blur-xl">
              <CognitiveStack cognitiveStack={result.cognitive_stack} />
            </div>

            {/* Astrological Synergy Insight */}
            {result.astrological_synergy && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 text-xs text-slate-300 space-y-1">
                <div className="font-bold uppercase tracking-wider text-purple-300">
                  ✦ Astrological & Cognitive Synergy
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {result.astrological_synergy}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
