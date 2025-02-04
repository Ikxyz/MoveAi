import clsx from 'clsx'
import React from 'react'

export default function SpecialText({ children, className }: { children: string, className?: string }) {
     return (
          <span className={clsx(['bg-linear-to-r from-[#fff1be] from-28% via-[#ee87cb] via-70% to-[#fed700] bg-clip-text text-transparent', className])}>
               {children}
          </span>
     )
}
