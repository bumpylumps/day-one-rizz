

import { Webhook } from 'svix'


// You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
const webhookSecret: string = process.env.WEBHOOK_SECRET || "your-secret"

export async function POST(req: Request) {

	if (!webhookSecret) {
		throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
	}

	// Get the headers
	const svix_id = req.headers.get("svix-id") ?? ""; 
	const svix_timestamp = req.headers.get("svix-timestamp") ?? "";
	const svix_signature = req.headers.get("svix-signature") ?? "";



	// If there are no headers, error out
	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new Response('Error occured -- no svix headers', {
			status: 400
		})
	}

	//get the body
	const body = await req.text();

	const sivx = new Webhook(webhookSecret);

	let msg: any;

	// Verify the payload with the headers
	try {
		msg = sivx.verify(body, {
			"svix-id": svix_id,
			"svix-timestamp": svix_timestamp,
			"svix-signature": svix_signature,

		});
		
	} catch (err) {
		console.error('Error verifying webhook:', err);
		return new Response('Error occured', {
			status: 400
		})
	}

	
	//instead of just logging the payload
	//use details to add user to DB
	console.log(msg.data.email_addresses[0].email_address);
	

	return new Response("OK", { status: 200 })
}

