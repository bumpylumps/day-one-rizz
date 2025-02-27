'use client'

import * as React from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = React.useState();
  const [password, setPassword] = React.useState();
  const [verifying, setVerifying] = React.useState(false);
  const [code, setCode] = React.useState('');
  const router = useRouter();

  //grab them deets
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent default form submit

    if (!isLoaded) return; //only if the code is loaded

    //begin sign up process using provided email/pass
    try {
      await signUp.create({
        emailAddress, 
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      setVerifying(true);

    } catch(err:any) {
      //TODO add actual error handling from clerk! it's right here: https://clerk.com/docs/custom-flows/error-handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // gettem verified
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!isLoaded) return 

    try {
      //use the ver code given to user 
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });


      //If verification completed, set session=== active
      // redirect user to home(signedin) or wahtever page
      if(signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.push('/success');
      } else {
        //if it didn't validate successfully, yell at the console
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch(err: any) {
      //TODO add actual error handling from clerk! it's right here: https://clerk.com/docs/custom-flows/error-handling
      console.error(JSON.stringify(err, null, 2));
    }
  };


  // Display verification form to capture OTP code
  if (verifying) {
    return (
      <>
        <h1>Verify your email</h1>
        <form onSubmit={handleVerify}>
          <label id="code">Enter your verification Code</label>
          <input value={code} id="code" name="code" onChange={(e) => setCode(e.target.value)} />
          <button type="submit">Verify!</button>
        </form>
      </>
    );
  };

  //display intial sign up form
  return (
    <>
      <h1>Sign up!</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Enter that email address</label>
          <input
            id="email"
            type="email"
            name="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Enter that password</label>
          <input 
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">Continue</button>
        </div>
      </form>
    </>
  )



}