import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { Gradient } from '@/components/gradient'
import { LogoCloud } from '@/components/logo-cloud'
import { Navbar } from '@/components/navbar'
import SpecialText from '@/components/special-text'
import { Templates } from '@/components/templates'
import '@/styles/tailwind.css'
import { ChevronRightIcon } from '@heroicons/react/16/solid'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  description:
    'Build smart contracts effortlessly using our pre-audited templates, or analyze your existing ones for security vulnerabilities with our AI-powered super-agent.',
}

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <Container className="mt-10">
        <LogoCloud />
      </Container>
      <Templates />
      {/* <Footer /> */}
    </div>
  )
}

function Hero() {
  return (
    <div className="relative">
      <Gradient className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
      <Container className="relative">
        <Navbar
          banner={
            <Link
              href="#"
              className="flex items-center gap-1 rounded-full bg-fuchsia-950/35 px-3 py-0.5 text-sm/6 font-medium text-white data-hover:bg-fuchsia-950/30"
            >
              AI-Powered Smart Contract Generator & Analysis.
              <ChevronRightIcon className="size-4" />
            </Link>
          }
        />
        <div className="pt-16 pb-24 sm:pt-24 sm:pb-32 md:pt-32 md:pb-48">
          <SpecialText className="font-display text-5xl/[0.9] font-medium tracking-tight text-balance sm:text-8xl/[0.8] md:text-9xl/[0.8]">
            Code It, Move It
          </SpecialText>
          <br />
          <br />
          <SpecialText>– Everything move and movement blockchain.</SpecialText>
          <p className="mt-8 max-w-lg text-xl/7 font-medium sm:text-2xl/8">
            Build smart contracts effortlessly using our pre-audited templates,
            generate, edit, analyze and optimize move based smart contract with our
            AI-powered super-agent.
          </p>
          <div className="mt-12 flex flex-col gap-x-6 gap-y-4 sm:flex-row">
            <Button variant='primary' className="bg-amber-500" href="/chat">
              Meet MoveAi
            </Button>
            <Button variant="secondary" className='text-white' href="#templates">
              Move Templates
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
