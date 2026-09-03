import React, { useRef, useEffect } from 'react'

export default function CinematicWheelPicker({
  options = [],
  value = '',
  onChange,
  label = '',
  itemHeight = 40,
}) {
  const containerRef = useRef(null)
  const isUserScrolling = useRef(false)
  const scrollTimeout = useRef(null)

  // Normalize options to { label, value }
  const normalizedOptions = options.map(opt =>
    typeof opt === 'object' && opt !== null
      ? { label: opt.label ?? opt.name ?? String(opt.value), value: String(opt.value) }
      : { label: String(opt), value: String(opt) }
  )

  const selectedIndex = normalizedOptions.findIndex(o => o.value === String(value))

  // Scroll to selected item on mount or external value change
  useEffect(() => {
    if (containerRef.current && selectedIndex >= 0 && !isUserScrolling.current) {
      const targetScroll = selectedIndex * itemHeight
      containerRef.current.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      })
    }
  }, [selectedIndex, itemHeight])

  const handleScroll = () => {
    if (!containerRef.current) return
    isUserScrolling.current = true
    clearTimeout(scrollTimeout.current)

    scrollTimeout.current = setTimeout(() => {
      if (!containerRef.current) return
      const currentScroll = containerRef.current.scrollTop
      const targetIndex = Math.round(currentScroll / itemHeight)
      const clampedIndex = Math.max(0, Math.min(targetIndex, normalizedOptions.length - 1))
      const targetOption = normalizedOptions[clampedIndex]

      if (targetOption && targetOption.value !== String(value)) {
        onChange?.(targetOption.value)
      }
      isUserScrolling.current = false
    }, 90)
  }

  const handleItemClick = (index, optValue) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * itemHeight,
        behavior: 'smooth',
      })
    }
    onChange?.(optValue)
  }

  // Vertical mask gradient to fade top and bottom smoothly
  const maskStyle = {
    maskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
  }

  return (
    <div className="flex flex-col items-center select-none w-full">
      {label && (
        <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-blue-200/50 mb-1">
          {label}
        </span>
      )}

      <div className="relative w-full h-40 flex items-center justify-center">
        {/* Center Target Lens Line */}
        <div
          className="pointer-events-none absolute inset-x-2 border-t border-b border-blue-400/25 bg-white/[0.02]"
          style={{
            height: `${itemHeight}px`,
            top: `calc(50% - ${itemHeight / 2}px)`,
            boxShadow: '0 0 15px rgba(56, 88, 246, 0.1)',
          }}
        />

        {/* Scrollable Wheel List */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          style={{
            ...maskStyle,
            paddingTop: `${80 - itemHeight / 2}px`,
            paddingBottom: `${80 - itemHeight / 2}px`,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          className="w-full h-full overflow-y-auto snap-y snap-mandatory scroll-smooth no-scrollbar"
        >
          {normalizedOptions.map((opt, i) => {
            const isSelected = opt.value === String(value)
            return (
              <div
                key={`${opt.value}-${i}`}
                onClick={() => handleItemClick(i, opt.value)}
                style={{ height: `${itemHeight}px` }}
                className={`snap-center flex items-center justify-center cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'text-white text-lg md:text-xl font-normal drop-shadow-[0_0_12px_rgba(255,255,255,0.85)] opacity-100 scale-105'
                    : 'text-blue-100/40 text-sm md:text-base font-light opacity-40 hover:opacity-75 hover:text-white scale-95'
                }`}
              >
                {opt.label}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
