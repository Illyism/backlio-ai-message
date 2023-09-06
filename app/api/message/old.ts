import { readFileSync } from 'fs';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import path from 'path';
import * as typechat from 'typechat'
import { type EmailSchema } from './emailSchema'

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
// IMPORTANT! Set the runtime to edge
// export const runtime = 'edge';

interface Message {
  prospect_url: string;
  prospect_domain: string;
  prospect_domainrating: number;
  prospect_is_blog: boolean;
  prospect_language: string;
  prospect_reached_out: boolean;
  prospect_links_to_us: boolean;
  prospect_title: string;
  prospect_title_above_link: string;
  prospect_description: string | null;
  prospect_flags: string[];
  prospect_published: string | null;
  prospect_updated: string | null;
  email_address: string;
  email_status: string | null;
  email_url: string;
  email_title: string;
  email_count: number;
  my_claim: string;
  my_domain: string;
  my_first_name: string;
  my_full_name: string;
  my_last_name: string;
  my_profile_photo_url: string | null;
}
 
const model = typechat.createOpenAILanguageModel(process.env.OPENAI_API_KEY!, 'gpt-4')
const schema = readFileSync(path.join(__dirname, 'emailSchema.ts'), 'utf8')
const translator = typechat.createJsonTranslator<EmailSchema>(
  model,
  schema,
  'EmailSchema'
)

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  console.log(req)
  const msg = JSON.parse(await req.json()) as Message;
  console.log(msg)

  const prompt = `
  Write a message to ${msg.prospect_title} (${msg.prospect_url}) asking for a backlink.
  You can use the following information:
  - Your name: ${msg.my_first_name}
  - Your domain: ${msg.my_domain}
  - Your claim: ${msg.my_claim}
  - Prospect domain: ${msg.prospect_domain}
  - Prospect domain rating: ${msg.prospect_domainrating}
  - Prospect is blog: ${msg.prospect_is_blog}
  - Prospect language: ${msg.prospect_language}
  - Prospect reached out: ${msg.prospect_reached_out}
  - Prospect links to us: ${msg.prospect_links_to_us}
  - Prospect title: ${msg.prospect_title}
  - Prospect title above link: ${msg.prospect_title_above_link}
  - Prospect description: ${msg.prospect_description}
  - Prospect flags: ${msg.prospect_flags}
  - Prospect published: ${msg.prospect_published}
  - Prospect updated: ${msg.prospect_updated}
  - Email status: ${msg.email_status}
  - Email url: ${msg.email_url}
  - Email title: ${msg.email_title}
  - Email count: ${msg.email_count}
  
  The message should be:
  - Short
  - Friendly
  - Personalized
  - Include a question
  - Include a link to ${msg.my_domain}
  - Include a link to ${msg.prospect_domain}
  - Include a link to ${msg.prospect_url}
  - Include a link to ${msg.email_url}
  
  The message should not be:
  - Spammy
  - Include a link to a competitor
  - Include a link to a site that is not relevant to the prospect
  
  Most important:
  - The message should be written in a way that the prospect will want to respond to it.
  - The message should be written in a way that the prospect will want to add a link to ${msg.my_domain}.
  
  Return format:
  - Subject: The subject of the email
  - Body: The body of the email
  (as a JSON object)
  `

  const response = await translator.translate(prompt)

  if (!response) {
    console.log('No response')
    return new NextResponse('nope', {
      headers: { 'content-type': 'application/json' },
    });
  }

  if (!response.success) {
    console.log('No succ')
    return new NextResponse('nope', {
      headers: { 'content-type': 'application/json' },
    });
  }


  // Return the response
  return new NextResponse(JSON.stringify(response.data), {
    headers: { 'content-type': 'application/json' },
  });
}