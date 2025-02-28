import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

function Header() {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: 20 }}>
      <h1>Bumpy Zone</h1>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <ClerkProvider>
      <body>
        <Header />
        {children}
      </body>
      </ClerkProvider>
    </html>
  )
}