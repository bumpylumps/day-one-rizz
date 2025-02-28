'use client'

import * as React from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from  'next/navigation';

export default function Page() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const [verifying, setVerifying] = React.useState(false);
    const [phone, setPhone] = React.useState('');
    const [code, setCode] = React.useState('');
    const router = useRouter();


    async function handleSubmit(e: React.FormEvent){
        e.preventDefault()

        if (!isLoaded && !signUp) return null

        try {
            //start sign up process w. phone num
            await signUp.create({ 
                phoneNumber: phone, 
            })

            //start verification - SMS message with
            //one time code
            await signUp.preparePhoneNumberVerification()

            //set verifyng to true to display second form
            //and capture OTP code
            setVerifying(true)
        } catch(err) {
            console.error('Error:', JSON.stringify(err,null,2))
        }
    }


    async function handleVerification(e: React.FormEvent) {
        e.preventDefault()

        if(!isLoaded && !signUp) return null;

        try {
            //use code provided by user and attempt 
            //verification
            const signUpAttempt = await signUp.attemptPhoneNumberVerification({
                code,
            })

            //If verification was completed, set session to
            //active and redirect user
            if(signUpAttempt.status === 'complete') {
                await setActive({session: signUpAttempt.createdSessionId })

                router.push('/')
            } else {
                //if verification status is not complete, 
                //check why. User may need to complete
                // further steps
                console.error(signUpAttempt)
            }
        } catch(err) {
            console.error('Error: ', JSON.stringify(err,null,2))
        }
    }

    if(verifying){
        return (
            <>
                <h1>Verify your phone number</h1>
                <form onSubmit={handleVerification}>
                    <label htmlFor="code">Enter your verification code</label>
                    <input value={code} id="code" name="code" onChange={(e) => setCode(e.target.value)} />
                    <button type="submit">Verify</button>
                </form>
            </>
        )
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="phone">Enter phone number</label>
                <input
                    value={phone}
                    id="phone"
                    name="phone"
                    type="tel"
                    onChange={(e) => setPhone(e.target.value)}
                />
                <button type="submit">Continue</button>
            </form>
        </>
    )
}