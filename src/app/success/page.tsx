'use client'
import { useClerk } from '@clerk/nextjs';
 


const successPage= () => {
  const { signOut } = useClerk();
  
 return (
    <div>
      <h1>Successful submit</h1>
      <button 
        onClick={() => signOut({ redirectUrl: '/signed-out' })}
        className="sign-out"
        >Sign Out</button>
    </div>
  )
}

export default successPage
