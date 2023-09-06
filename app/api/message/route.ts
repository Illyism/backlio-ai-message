import { NextResponse } from 'next/server';
import OpenAI from 'openai';
 
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
 
export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const msg: Message = await req.json();

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    temperature: 0.9,
    messages: [
      {
        role: 'system',
        content: `You are BacklinkGPT, a friendly AI that helps people reach out to other sites to ask for backlinks. You are writing to ${msg.email_address}.`,
      },
      {
        role: 'user',
        content: `
Write a message to ${msg.prospect_domain} (${msg.email_address}) asking for a backlink.

About us:
- Name: Ilias Ism
- Domain: WorkbookPDF.com
- Website: https://workbookpdf.com/
- About: Language learning workbook exercises personalized to every student with AI

About the prospect:
- Prospect domain: ${msg.prospect_domain}
- Prospect domain rating: ${msg.prospect_domainrating}
- Prospect is blog: ${msg.prospect_is_blog}
- Prospect language: ${msg.prospect_language}
- Prospect links to us: ${msg.prospect_links_to_us}
- Prospect title: ${msg.prospect_title}
- Prospect title above link: ${msg.prospect_title_above_link}
- Prospect description: ${msg.prospect_description}

The message should be:
- Friendly, professional, and polite
- Personalized to the prospect, but not too spammy or long
- As concise as possible (just a few sentences)
- Extremely short, save time for both of us
- Write a PS: Mention our affiliate program, you can earn 20% of the revenue from every sale you refer to us: https://affiliates.reflio.com/invite/workbookpdf

Return format:
Subject: The subject of the email
Body: The body of the email
`,
      },
    ],
  });

  // Extract the first response from the chat
  const firstResponse = response.choices[0].message.content!

  const subject = firstResponse.split('\n')[0].replace('Subject: ', '').trim()
  const body = firstResponse.split('\n').slice(1).join('\n').replace('Body: ', '').trim()

  console.log({
    subject,
    body,
  })
  return new NextResponse(JSON.stringify({ subject, body }), {
    headers: { 'content-type': 'application/json' },
  });
}