'use client'

import * as Headless from '@headlessui/react'
import { ArrowLongRightIcon } from '@heroicons/react/20/solid'
import { clsx } from 'clsx'
import {
  MotionValue,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  type HTMLMotionProps,
} from 'framer-motion'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import useMeasure, { type RectReadOnly } from 'react-use-measure'
import { Container } from './container'
import { Link } from './link'
import { Heading, Subheading } from './text'

const testimonials = [
  {
    "img": "/contract/img1.png",
    "name": "Token Smart Contracts (ERC-20, BEP-20, SPL)",
    "title": "Create and manage fungible tokens on blockchain networks",
    "quote": "Token smart contracts define the rules of digital assets like cryptocurrencies, stablecoins, and governance tokens. The ERC-20 standard on Ethereum ensures interoperability with wallets and exchanges, while BEP-20 operates on Binance Smart Chain, and SPL is used in the Solana ecosystem. These contracts handle transfers, balances, and approvals, ensuring automated execution of token-related functions. They are commonly used in ICOs, DeFi applications, and governance models."
  },
  {
    "img": "/contract/img2.png",
    "name": "NFT Smart Contracts (ERC-721 & ERC-1155)",
    "title": "Facilitate unique digital assets like NFTs and collectibles",
    "quote": "NFT smart contracts are designed for unique digital assets, including art, collectibles, and in-game items. The ERC-721 standard allows for individual ownership of assets, ensuring uniqueness and provable scarcity. ERC-1155, on the other hand, supports both fungible and non-fungible tokens within the same contract, making it more efficient for gaming applications and collections. These contracts define metadata, ownership, and royalties, ensuring creators get compensated when assets are resold."
  },
  {
    "img": "/contract/img3.png",
    "name": "Crowdfunding (ICO & STO) Contracts",
    "title": "Raise funds through decentralized crowdfunding models",
    "quote": "Crowdfunding contracts allow startups and businesses to raise funds in a decentralized and transparent manner. Initial Coin Offering (ICO) contracts distribute tokens to investors in exchange for cryptocurrency, while Security Token Offering (STO) contracts ensure regulatory compliance by representing real-world securities like company shares. These contracts automate token issuance, enforce contribution limits, and protect investors by ensuring funds are used as promised."
  },
  {
    "img": "/contract/img4.png",
    "name": "Decentralized Exchange (DEX) Contracts",
    "title": "Enable trustless and peer-to-peer token trading",
    "quote": "DEX smart contracts facilitate peer-to-peer swaps of cryptocurrencies without intermediaries. These contracts handle liquidity pools, automated market makers (AMM), and trading pairs to enable users to swap tokens securely. Unlike centralized exchanges, DEX contracts ensure non-custodial trading, meaning users retain control of their assets. Popular implementations include Uniswap and PancakeSwap smart contracts, which enable automated token pricing based on supply and demand."
  },
  {
    "img": "/contract/img5.png",
    "name": "Decentralized Autonomous Organization (DAO) Contracts",
    "title": "Create self-governed organizations with blockchain voting",
    "quote": "DAO contracts govern decentralized organizations where decisions are made through token-holder voting. These contracts manage proposals, voting mechanisms, and fund distribution, ensuring transparent decision-making. By automating governance, DAOs eliminate the need for centralized management, making them ideal for investment funds, communities, and open-source projects. DAOs operate with multi-signature wallets to prevent unauthorized access and ensure consensus-driven changes."
  },
  {
    "img": "/contract/img6.png",
    "name": "Supply Chain Smart Contracts",
    "title": "Track the movement of goods across a supply chain",
    "quote": "These contracts track the movement of goods across a supply chain, ensuring transparency and accountability. By logging every transaction on the blockchain, they reduce fraud and increase efficiency. These contracts can automate payments, inventory updates, and delivery confirmations, helping businesses improve logistics. Enterprises use them to authenticate product origins, prevent counterfeiting, and ensure compliance with regulations."
  },
  {
    "img": "/contract/img7.png",
    "name": "Real Estate Tokenization Contracts",
    "title": "Fractionalize property ownership and enable secure transfers",
    "quote": "Real estate smart contracts allow property ownership to be fractionalized and traded as tokens. These contracts record ownership, transfers, and rental agreements on the blockchain, reducing paperwork and eliminating intermediaries. By allowing investors to buy and sell fractions of properties, real estate tokenization increases liquidity in the housing market and enables global investment in properties."
  },
  {
    "img": "/contract/img8.png",
    "name": "Lending & Borrowing (DeFi) Smart Contracts",
    "title": "Facilitate decentralized lending and borrowing",
    "quote": "These contracts facilitate decentralized lending platforms where users can lend assets to earn interest or borrow funds by providing collateral. Platforms like Aave and Compound use these contracts to automate interest rates based on supply and demand. The absence of intermediaries ensures lower costs and higher efficiency. Smart contracts ensure that loans are only released if collateral is provided, reducing risks for lenders."
  },
  {
    "img": "/contract/img9.png",
    "name": "Subscription & Recurring Payment Contracts",
    "title": "Automate recurring payments and subscription services",
    "quote": "These smart contracts automate recurring payments on the blockchain, allowing businesses to offer subscription-based services. Unlike traditional banking systems, these contracts ensure timely payments without requiring manual intervention. Users can subscribe to services and cancel at any time without worrying about unauthorized deductions. Popular use cases include SaaS platforms, NFT memberships, and blockchain-based streaming services."
  },
  {
    "img": "/contract/img10.png",
    "name": "Identity & Verification Smart Contracts",
    "title": "Secure identity verification and KYC compliance",
    "quote": "Identity smart contracts enable users to store and verify personal credentials on the blockchain securely. These contracts can be used for KYC (Know Your Customer) processes, digital IDs, and self-sovereign identity management. By using blockchain for identity verification, businesses eliminate fraud, reduce onboarding time, and enhance user privacy. These are often integrated with decentralized identity providers (DIDs)."
  }
]

function TestimonialCard({
  name,
  title,
  img,
  children,
  bounds,
  scrollX,
  ...props
}: {
  img: string
  name: string
  title: string
  children: React.ReactNode
  bounds: RectReadOnly
  scrollX: MotionValue<number>
} & HTMLMotionProps<'div'>) {
  let ref = useRef<HTMLDivElement | null>(null)

  let computeOpacity = useCallback(() => {
    let element = ref.current
    if (!element || bounds.width === 0) return 1

    let rect = element.getBoundingClientRect()

    if (rect.left < bounds.left) {
      let diff = bounds.left - rect.left
      let percent = diff / rect.width
      return Math.max(0.5, 1 - percent)
    } else if (rect.right > bounds.right) {
      let diff = rect.right - bounds.right
      let percent = diff / rect.width
      return Math.max(0.5, 1 - percent)
    } else {
      return 1
    }
  }, [ref, bounds.width, bounds.left, bounds.right])

  let opacity = useSpring(computeOpacity(), {
    stiffness: 154,
    damping: 23,
  })

  useLayoutEffect(() => {
    opacity.set(computeOpacity())
  }, [computeOpacity, opacity])

  useMotionValueEvent(scrollX, 'change', () => {
    opacity.set(computeOpacity())
  })

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      {...props}
      className="relative flex aspect-9/16 w-72 shrink-0 snap-start scroll-ml-[var(--scroll-padding)] flex-col justify-end overflow-hidden rounded-3xl sm:aspect-3/4 sm:w-96"
    >
      <img
        alt=""
        src={img}
        className="absolute inset-x-0 top-0 aspect-square w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-3xl bg-linear-to-t from-black from-[calc(7/16*100%)] ring-1 ring-gray-950/10 ring-inset sm:from-25%"
      />
      <figure className="relative p-10">
        <blockquote>
          <p className="relative text-xl/7 text-white">
            <span aria-hidden="true" className="absolute -translate-x-full">
              “
            </span>
            {children}
            <span aria-hidden="true" className="absolute">
              ”
            </span>
          </p>
        </blockquote>
        <figcaption className="mt-6 border-t border-white/20 pt-6">
          <p className="text-sm/6 font-medium text-white">{name}</p>
          <p className="text-sm/6 font-medium">
            <span className="bg-linear-to-r from-[#fff1be] from-28% via-[#ee87cb] via-70% to-[#b060ff] bg-clip-text text-transparent">
              {title}
            </span>
          </p>
        </figcaption>
      </figure>
    </motion.div>
  )
}

function CallToAction() {
  return (
    <div>
      <p className="max-w-sm text-sm/6 text-gray-600">
        Start writing and deploying your smart contract today

      </p>
      <div className="mt-2">
        <Link
          href="#"
          className="inline-flex items-center gap-2 text-sm/6 font-medium text-pink-600"
        >
          Get started
          <ArrowLongRightIcon className="size-5" />
        </Link>
      </div>
    </div>
  )
}

export function Testimonials() {
  let scrollRef = useRef<HTMLDivElement | null>(null)
  let { scrollX } = useScroll({ container: scrollRef })
  let [setReferenceWindowRef, bounds] = useMeasure()
  let [activeIndex, setActiveIndex] = useState(0)

  useMotionValueEvent(scrollX, 'change', (x) => {
    setActiveIndex(Math.floor(x / scrollRef.current!.children[0].clientWidth))
  })

  function scrollTo(index: number) {
    let gap = 32
    let width = (scrollRef.current!.children[0] as HTMLElement).offsetWidth
    scrollRef.current!.scrollTo({ left: (width + gap) * index })
  }

  return (
    <div className="overflow-hidden py-32">
      <Container>
        <div ref={setReferenceWindowRef}>
          <Subheading>Choose from our numerous templates design.</Subheading>
          <Heading as="h3" className="mt-2">
            Trusted by Developers.
          </Heading>
        </div>
      </Container>
      <div
        ref={scrollRef}
        className={clsx([
          'mt-16 flex gap-8 px-[var(--scroll-padding)]',
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          'snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth',
          '[--scroll-padding:max(--spacing(6),calc((100vw-(var(--container-2xl)))/2))] lg:[--scroll-padding:max(--spacing(8),calc((100vw-(var(--container-7xl)))/2))]',
        ])}
      >
        {testimonials.map(({ img, name, title, quote }, testimonialIndex) => (
          <TestimonialCard
            key={testimonialIndex}
            name={name}
            title={title}
            img={img}
            bounds={bounds}
            scrollX={scrollX}
            onClick={() => scrollTo(testimonialIndex)}
          >
            {quote.substring(0, 120)}
          </TestimonialCard>
        ))}
        <div className="w-[42rem] shrink-0 sm:w-[54rem]" />
      </div>
      <Container className="mt-16">
        <div className="flex justify-between">
          <CallToAction />
          <div className="hidden sm:flex sm:gap-2">
            {testimonials.map(({ name }, testimonialIndex) => (
              <Headless.Button
                key={testimonialIndex}
                onClick={() => scrollTo(testimonialIndex)}
                data-active={
                  activeIndex === testimonialIndex ? true : undefined
                }
                aria-label={`Scroll to testimonial from ${name}`}
                className={clsx(
                  'size-2.5 rounded-full border border-transparent bg-gray-300 transition',
                  'data-active:bg-gray-400 data-hover:bg-gray-400',
                  'forced-colors:data-active:bg-[Highlight] forced-colors:data-focus:outline-offset-4',
                )}
              />
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}
