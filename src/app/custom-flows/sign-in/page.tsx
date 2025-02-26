'use client'

import * as React from 'react'
import { OAuthStrategy } from '@clerk/types'
import { useSignIn } from '@clerk/nextjs'

export default function OauthSignIn() {
  const { signIn } = useSignIn()

  if (!signIn) return null

  const signInWith = (strategy: OAuthStrategy) => {
    return signIn
      .authenticateWithRedirect({
        strategy,
        redirectUrl: '/custom-flows/sso-callback',
        redirectUrlComplete: '/',
      })
      .then((res) => {
        console.log(res)
      })
      .catch((err: any) => {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.log(err.errors)
        console.error(err, null, 2)
      })
  }

  // Render a button for each supported OAuth provider
  // you want to add to your app. This example uses only Google.
  return (
    <div>
      <button onClick={() => signInWith('oauth_google')}>Sign in with Google</button>
      <button onClick={() => signInWith('oauth_github')}>Sign in with Github</button>
    </div>
  )
}