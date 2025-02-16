'use client'

import { clsx } from 'clsx'
import { motion } from 'framer-motion'

export function Logo({ className }: { className?: string }) {
  let transition = {
    duration: 0.5,
    ease: 'easeInOut',
  }

  return (
    <img src='/logo.png' alt='Logo' className={clsx('w-12 h-12', className)} />
  )
}
