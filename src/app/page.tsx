'use client';


import * as React from 'react';
import Link from 'next/link';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';


export default function Home (){
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');
  const [useBackupCode, setUseBackupCode] = React.useState(false);
  const [displayTOTP, setDisplayTOTP] = React.useState(false)
  const router = useRouter();

  //added for TOTP
  const handleFirstStage = (e: React.FormEvent) => {
    e.preventDefault();
    setDisplayTOTP(true)
  };

  //submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!isLoaded) return;

    //start sign in process with captured deets
    try {
      await signIn.create({
        identifier: email,
        password,
      })

      //added for MFA/TOTP
       // Attempt the TOTP or Backup Code verification
       const signInAttempt = await signIn.attemptSecondFactor({
        strategy: useBackupCode ? 'backup_code' : 'totp',
        code: code,
      });

      //if all is good
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push('/success');
      } else {
       console.log(signInAttempt);
      }
    } catch(err: any) {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(err, null, 2))
      }
  } 

  //added for MFA/TOTP
  if (displayTOTP) {
    return (
      <div>
        <h1>Verify your account</h1>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div>
            <label htmlFor="code">Code</label>
            <input
              onChange={(e) => setCode(e.target.value)}
              id="code"
              name="code"
              type="text"
              value={code}
            />
          </div>
          <div>
            <label htmlFor="backupcode">This code is a backup code</label>
            <input
              onChange={() => setUseBackupCode((prev) => !prev)}
              id="backupcode"
              name="backupcode"
              type="checkbox"
              checked={useBackupCode}
            />
          </div>
          <button type="submit">Verify</button>
        </form>
      </div>
    )
  }


  return (
    <>
    <div>
      <Link href="/sign-up">Sign Up</Link>
      <h1>Or....</h1>
    </div>
    <div>
      <h1>Sign in!</h1>
      <form onSubmit={(e) => handleFirstStage(e)}>
        <div>
          <label htmlFor="email">Enter that email</label>
          <input 
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            name="email"
            type="email"
            value={email}
          />
        </div>
        <div>
          <label htmlFor="password">Enter that password playa</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            name="password"
            type="password"
            value={password}
          />
        </div>
        <button type="submit">Sign in!</button>
      </form>
      <div>
        <h2>Did you forget your password? <Link href='/forgorPassword'>Click here ya dingus!</Link></h2>
      </div>
    </div>
    </>
  );
};


