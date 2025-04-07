'use client'

import { wagmiAdapter, projectId } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import {
  bsc,
  type AppKitNetwork
} from '@reown/appkit/networks'
import React, { type ReactNode, useEffect } from 'react'
import {
  cookieToInitialState,
  WagmiProvider,
  type Config,
  useAccount,
  useChainId
} from 'wagmi'

// ✅ لیست شبکه‌ها با تضمین حداقل یک شبکه برای TypeScript
const allNetworks = [bsc] as [AppKitNetwork]

// ✅ تعیین شبکه پیش‌فرض بر اساس محیط
const defaultNetwork = bsc

// ✅ بررسی projectId
if (!projectId) {
  throw new Error('❌ projectId تعریف نشده! آن را در فایل .env به صورت NEXT_PUBLIC_PROJECT_ID قرار دهید.')
}

// ✅ متادیتای سفارشی
const metadata = {
  name: 'Ewave Airdrop',
  description: 'Claim your free BDOGE tokens',
  url: 'https://reown.com/appkit',
  icons: ['https://assets.reown.com/reown-profile-pic.png']
}

// ✅ ساخت AppKit modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: allNetworks,
  defaultNetwork,
  metadata,
  themeMode: 'dark',
  features: {
    analytics: true,
    email: true,
    socials: ['google', 'x', 'github', 'discord', 'facebook', 'farcaster'],
    emailShowWallets: true
  }
})

// ✅ اتصال خودکار به شبکه صحیح
function NetworkChecker() {
  const chainId = useChainId()
  const { isConnected } = useAccount()

  useEffect(() => {
    const switchToCorrectNetwork = async () => {
      if (typeof window === 'undefined' || !window.ethereum) return
      if (!isConnected) return

      // 👇 تایپ‌کست درست برای TypeScript
      const ethereum = window.ethereum as {
        request: (args: { method: string; params?: any[] }) => Promise<unknown>
      }

      const correctChainId = defaultNetwork.id
      if (chainId === correctChainId) return

      try {
        console.log('🔄 Switching to correct network...')
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${correctChainId.toString(16)}` }]
        })
        console.log('✅ Switched to correct network!')
      } catch (error: any) {
        console.warn('⚠️ Network not found, trying to add it...')
        if (error.code === 4902) {
          try {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x38',
                  chainName: 'BNB Smart Chain',
                  nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
                  rpcUrls: ['https://bsc-dataseed.binance.org/'],
                  blockExplorerUrls: ['https://bscscan.com/']
                }
              ]
            })
            console.log('✅ Network added and switched!')
          } catch (addError) {
            console.error('❌ Failed to add network:', addError)
          }
        } else {
          console.error('❌ Failed to switch network:', error)
        }
      }
    }

    switchToCorrectNetwork()
  }, [chainId, isConnected])

  return null
}

// ✅ Provider اصلی
function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={new QueryClient()}>
        <NetworkChecker />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider
