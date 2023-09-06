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
  prospect_description: string;
  prospect_flags: string[];
  prospect_published: string;
  prospect_updated: string;
  email_address: string;
  email_status: string;
  email_url: string;
  email_title: string;
  email_count: number;
}
 
export async function GET(req: Request) {
  // Extract the `messages` from the body of the request
  const msg: Message = await req.json();
  console.log(msg)

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are BacklinkGPT, a friendly AI that helps people reach out to other sites to ask for backlinks. You are writing to ${msg.email_address}.`,
      },
      {
        role: 'user',
        content: `
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
`,
      },
    ],
  });

  // Extract the first response from the chat
  const firstResponse = response.choices[0].message;
  console.log(firstResponse)

  // Return the response
  return new Response(JSON.stringify({ firstResponse }), {
    headers: { 'content-type': 'application/json' },
  });
}