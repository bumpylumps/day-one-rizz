'use client'

import { ClerkProvider, SignedOut } from '@clerk/nextjs'
import { AppProps } from 'next/app'

function MyApp({ pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <SignedOut>
        <p>You are signed out.</p>
      </SignedOut>
      <p>This content is always visible.</p>
    </ClerkProvider>
  )
}

export default MyApp