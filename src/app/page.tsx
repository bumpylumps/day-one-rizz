'use client';

import { UserProfile, useUser, OrganizationSwitcher, OrganizationProfile } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server';

export default function Home() {
  const { user } = useUser();

  if (!user) {
    return <div>Please Sign in!</div>
  };

  return (
    <>
      <div>Welcome!</div>
      <UserProfile />
      <OrganizationSwitcher />
      <OrganizationProfile />
    </>
  ) 
};