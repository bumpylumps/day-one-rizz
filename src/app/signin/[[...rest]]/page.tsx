"use client";

import { enUS } from '@clerk/localizations';

import { SignIn, useUser, SignUp } from '@clerk/nextjs'

export default function Home() {
  const { user } = useUser()

  if (!user) {
    return <div className='hero'><SignUp /></div>
  }

  return <div>Welcome!</div>
}