import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export async function POST(req: Request) {
	const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

	if(!WEBHOOK_SECRET) {
		throw new Error('Error: Please add WEBHOOK_SECRET from Clerk Dashboard to .env');
	}

	// create new Svix instance with secret
	const wh = new Webhook(WEBHOOK_SECRET)


	//get headers
	const headerPayload = await headers()

	const svix_id = headerPayload.get('svix-id')
	const svix_timestamp = headerPayload.get('svix-timestamp')
	const svix_signature = headerPayload.get('svix-signature')
	
	if(!svix_id || !svix_timestamp || !svix_signature) {
		return new Response('Error: Missing Svix headers', {
			status: 400,
		  })
	}

	const payload = await req.json()
	const body = JSON.stringify(payload)

	let evt: WebhookEvent;


	try {
		evt = wh.verify(body, {
			'svix-id': svix_id,
			'svix-timestamp': svix_timestamp,
			'svix-signature': svix_signature
		}) as WebhookEvent 
		
	} catch (err) {
		console.error('Error: Could not verify webhook:', err)
		return new Response('Error: Verification error', {
		  status: 400,
		})
	}
	// @ts-ignore
	const email:string = evt.data.email_addresses[0].email_address
	//@ts-ignore
	const name:string  = evt.data.first_name

	//do something with payload
	//for guide, log payload to console
	console.log(email)
	console.log(name)

	//add to prisma
	try {
		await prisma.user.create({
			data: {
				email: email,
				name: name,
			}
		})
	} catch (dbError) {
		console.error('Error saving to database: ', dbError);
		return new Response('Error: Could not save to database', {
			status: 500
		})
	}
  

  	return new Response('Webhook received', { status: 200 })
}