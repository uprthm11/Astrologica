import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import API_BASE_URL from '../config/api'

const QUESTIONS = [
  {
    id: 1,
    axis: 'Energy Axis (E vs I)',
    title: 'How do you recharge your energy?',
    subtitle: 'Where do you naturally direct your attention and gain vitality?',
    options: [
      {
        text: 'In a lively crowd surrounded by people, dynamic conversations & active engagement',
        value: 1,
        label: 'Extraverted (+1)',
        icon: '⚡',
        accentColor: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 hover:border-amber-400 hover:bg-amber-500/10'
      },
      {
        text: 'In quiet solitude with personal space, calm reflection & deep individual focus',
        value: -1,
        label: 'Introverted (-1)',
        icon: '🌙',
        accentColor: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/40 hover:border-indigo-400 hover:bg-indigo-500/10'
      }
    ]
  },
  {
    id: 2,
    axis: 'Perception Axis (S vs N)',
    title: 'How do you process information?',
    subtitle: 'What kind of details do you intuitively trust and notice first?',
    options: [
      {
        text: 'Focusing on concrete facts, tangible evidence, practical realities & present moments',
        value: 1,
        label: 'Observant / Sensing (+1)',
        icon: '🔍',
        accentColor: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-500/10'
      },
      {
        text: 'Exploring abstract theories, imaginative possibilities, symbols & future trends',
        value: -1,
        label: 'Intuitive (-1)',
        icon: '🔮',
        accentColor: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-500/10'
      }
    ]
  },
  {
    id: 3,
    axis: 'Decision Axis (T vs F)',
    title: 'How do you make major decisions?',
    subtitle: 'What guiding principle drives your choices and problem solving?',
    options: [
      {
        text: 'Using objective logic, critical analysis, hard metrics & impartial fairness',
        value: 1,
        label: 'Thinking (+1)',
        icon: '⚖️',
        accentColor: 'from-blue-500/20 to-indigo-500/20 border-blue-500/40 hover:border-blue-400 hover:bg-blue-500/10'
      },
      {
        text: 'Guided by core values, emotional empathy, personal impact & interpersonal harmony',
        value: -1,
        label: 'Feeling (-1)',
        icon: '💖',
        accentColor: 'from-rose-500/20 to-pink-500/20 border-rose-500/40 hover:border-rose-400 hover:bg-rose-500/10'
      }
    ]
  },
  {
    id: 4,
    axis: 'Lifestyle Axis (J vs P)',
    title: 'How do you organize your life & tasks?',
    subtitle: 'How do you prefer to manage your environment and commitments?',
    options: [
      {
        text: 'With structured plans, established deadlines, organized checklists & decided routines',
        value: 1,
        label: 'Judging / Structured (+1)',
        icon: '📋',
        accentColor: 'from-violet-500/20 to-purple-500/20 border-violet-500/40 hover:border-violet-400 hover:bg-violet-500/10'
      },
      {
        text: 'With spontaneous adaptability, flexible improvisation, curiosity & open-ended options',
        value: -1,
        label: 'Prospecting / Spontaneous (-1)',
        icon: '🌊',
        accentColor: 'from-fuchsia-500/20 to-pink-500/20 border-fuchsia-500/40 hover:border-fuchsia-400 hover:bg-fuchsia-500/10'
      }
    ]
  }
]

export default function MBTIQuiz({ onComplete, completedData }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(completedData || null)

  useEffect(() => {
    if (completedData) {
      setResult(completedData)
    }
  }, [completedData])

  const handleSelectOption = async (value) => {
    const updatedAnswers = [...answers, value]
    setAnswers(updatedAnswers)

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // All 4 questions answered -> calculate MBTI
      setLoading(true)
      setError(null)
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/calculate-mbti`,
          { answers: updatedAnswers }
        )
        setResult(response.data)
        if (onComplete) {
          onComplete(response.data)
        }
      } catch (err) {
        console.error('MBTI Assessment Error:', err)
        setError(
          err.response?.data?.detail ||
            'Failed to calculate MBTI archetype. Ensure the backend API is reachable.'
        )
      } finally {
        setLoading(false)
      }
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setAnswers([])
    setResult(null)
    setError(null)
    setLoading(false)
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {!result && !loading ? (
          /* --- Question Card --- */
          <motion.div
            key={`question-${currentStep}`}
            initial={{ opacity: 0, x: 30, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.96 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="relative p-8 rounded-3xl bg-slate-900/90 border border-indigo-500/20 shadow-2xl backdrop-blur-xl"
          >
            {/* Ambient Lighting */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Progress Header */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 px-3 py-1 rounded-full">
                Question {currentStep + 1} of 4
              </span>
              <span className="text-xs font-medium text-slate-400">
                {QUESTIONS[currentStep].axis}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full mb-6 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: `${(currentStep / 4) * 100}%` }}
                animate={{ width: `${((currentStep + 1) / 4) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Question Title */}
            <div className="text-left mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {QUESTIONS[currentStep].title}
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                {QUESTIONS[currentStep].subtitle}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs text-left">
                ⚠️ {error}
              </div>
            )}

            {/* Option Buttons */}
            <div className="space-y-4">
              {QUESTIONS[currentStep].options.map((option, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleSelectOption(option.value)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-5 rounded-2xl bg-gradient-to-r ${option.accentColor} border text-left transition duration-200 cursor-pointer flex items-start gap-4 shadow-lg`}
                >
                  <span className="text-2xl p-2 bg-slate-950/60 rounded-xl border border-slate-800 shrink-0">
                    {option.icon}
                  </span>
                  <div className="flex-1">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      {option.label}
                    </div>
                    <div className="text-sm sm:text-base font-medium text-slate-100 leading-snug">
                      {option.text}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {currentStep > 0 && (
              <button
                onClick={() => {
                  setCurrentStep(currentStep - 1)
                  setAnswers(answers.slice(0, -1))
                }}
                className="mt-6 text-xs text-slate-500 hover:text-slate-300 transition flex items-center gap-1 mx-auto cursor-pointer"
              >
                ← Previous Question
              </button>
            )}
          </motion.div>
        ) : loading ? (
          /* --- Loading Transition --- */
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
              <h3 className="text-xl font-bold text-white">Synthesizing Archetype...</h3>
              <p className="text-xs text-slate-400 mt-1">Analyzing psychological cognitive axes</p>
            </div>
          </motion.div>
        ) : (
          /* --- Stylized MBTI Result Card --- */
          <motion.div
            key="mbti-result-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.25 }}
            className="relative p-8 rounded-3xl bg-slate-900/95 border border-indigo-500/30 shadow-2xl backdrop-blur-xl overflow-hidden"
          >
            {/* Ambient Nebula */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wider text-indigo-300 uppercase bg-indigo-950/60 border border-indigo-500/30 rounded-full mb-3"
              >
                🧠 Psychological Assessment Complete
              </motion.div>

              {/* 4-Letter Code Display */}
              <div className="flex justify-center items-center gap-2 sm:gap-3 my-4">
                {result.mbti_type.split('').map((letter, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + idx * 0.1, type: 'spring' }}
                    className="w-14 h-16 sm:w-16 sm:h-20 rounded-2xl bg-gradient-to-b from-indigo-900/80 via-slate-950 to-slate-900 border border-indigo-400/40 shadow-xl flex items-center justify-center font-black text-2xl sm:text-3xl text-indigo-200 tracking-wider"
                  >
                    {letter}
                  </motion.div>
                ))}
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {result.archetype}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-md mx-auto leading-relaxed italic">
                "{result.description}"
              </p>
            </div>

            {/* Cognitive Axes Breakdown Grid */}
            {result.breakdown && (
              <div className="grid grid-cols-2 gap-3 mb-6 text-left">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Energy</div>
                  <div className="text-xs sm:text-sm font-semibold text-amber-300 mt-0.5">
                    {result.breakdown.energy?.letter} &bull; {result.breakdown.energy?.trait}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Mind</div>
                  <div className="text-xs sm:text-sm font-semibold text-cyan-300 mt-0.5">
                    {result.breakdown.mind?.letter} &bull; {result.breakdown.mind?.trait}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Nature</div>
                  <div className="text-xs sm:text-sm font-semibold text-rose-300 mt-0.5">
                    {result.breakdown.nature?.letter} &bull; {result.breakdown.nature?.trait}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Tactics</div>
                  <div className="text-xs sm:text-sm font-semibold text-purple-300 mt-0.5">
                    {result.breakdown.tactics?.letter} &bull; {result.breakdown.tactics?.trait}
                  </div>
                </div>
              </div>
            )}

            {/* Retake Button */}
            <motion.button
              onClick={handleReset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-6 rounded-xl font-medium text-sm text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>↺ Retake Questionnaire</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
