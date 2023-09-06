// api/message.ts
import type { NextRequest, NextResponse } from 'next/server'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  const p = JSON.parse(req.body)
  const subject = `Links on your site "${p.prospect_title}"`
  const email = p.email_address
  let name = 'there'
  
  if (email.includes('.')) {
    name = email.split('@')[0].split('.')[0].charAt(0).toUpperCase() + email.split('@')[0].split('.')[0].slice(1)
  }

  let extra_section = ''
  if (p.prospect_title_above_link) {
    extra_section = ` under the section "${p.prospect_title_above_link}"`
  }

  const body = `Hi ${name},

My name is ${p.my_first_name} and I'm the founder of ${p.my_domain}: ${p.my_claim}.

I found your site "${p.prospect_title}" and noticed that you link to similar tools.

Question: would you mind adding a link to ${p.my_domain}${extra_section}? It would mean the world to me!

Greets
${p.my_first_name}
`
  return NextResponse.json({ subject, body })
}