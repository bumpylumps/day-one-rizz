import { OrganizationSwitcher } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server';

export default async function Home() {
  const { userId } = await auth();
  

  if (!userId) {
    return <div>Please Sign in!</div>
  };

  return (
    <>
      <div>Welcome!</div>
      <OrganizationSwitcher />
    </>
  ) 
};