import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Define the system prompt for generating flashcards
const systemPrompt = `
You are a flashcard creator. You take in text and create exactly 10 flashcards from it. 
Both the front and back of each card should be one sentence long.
Return the flashcards in the following JSON format:
{
  "flashcards": [
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`;

export async function POST(req) {
  try {
    // Parse the request body
    const data = await req.json();
    const prompt = systemPrompt + data.text;

    console.log('Request Data:', data);
    console.log('Prompt:', prompt);

    // Initialize the GoogleGenerativeAI client
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('API key is missing');
      return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Start a chat session
    const chatSession = await model.startChat({
      history: [],
      generationConfig: {
        temperature: 1,
        maxOutputTokens: 1024,
      },
    });

    // Send the prompt and get the result
    const result = await chatSession.sendMessage(prompt);

    // Extract and clean the response text
    const responseText = typeof result.response.text === 'function'
      ? await result.response.text()
      : result.response.text || result.response;

    console.log('Raw Response Text:', responseText);

    const cleanedText = responseText.replace(/```json|```/g, '').trim();
    console.log('Cleaned Response Text:', cleanedText);

    // Parse the cleaned response text as JSON
    let flashcards;
    try {
      flashcards = JSON.parse(cleanedText);
    } catch (jsonError) {
      console.error('JSON Parse Error:', jsonError);
      return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
    }

    console.log('Parsed Flashcards:', flashcards);

    // Ensure `flashcards.flashcard` is correct and exists
    if (!flashcards.flashcards) {
      console.error('Invalid flashcards format:', flashcards);
      return NextResponse.json({ error: 'Invalid flashcards format' }, { status: 500 });
    }

    return NextResponse.json({ flashcards });
  } catch (error) {
    // Log the error and return a response
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred. Please try again later.' }, { status: 500 });
  }
}
