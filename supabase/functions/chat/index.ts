import { serve } from 'https://deno.fresh.dev/std/http/server.ts';
import OpenAI from 'https://esm.sh/openai@4.28.0';

const openai = new OpenAI({
  apiKey: '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',
});

serve(async (req) => {
  try {
    const { message } = await req.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful event planning assistant. Help users with event organization, scheduling, and management.',
        },
        { role: 'user', content: message },
      ],
    });

    return new Response(
      JSON.stringify({ response: completion.choices[0].message.content }),
      {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});