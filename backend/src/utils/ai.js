import dotenv from 'dotenv';

dotenv.config();

/**
 * Moderates a comment using the Groq AI API.
 * @param {string} content - The comment content to moderate.
 * @returns {Promise<boolean>} - True if the comment is safe, false if it is inappropriate.
 */
export async function moderateComment(content) {
  const apiKey = process.env.VITE_GROQ_API_KEY;
  const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

  if (!apiKey) {
    console.error('Missing VITE_GROQ_API_KEY for moderation');
    return true; // Fail safe (allow) if API key is missing, or change to false if you want strictness
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a content moderator. Evaluate the following comment for profanity, hate speech, spam, or highly inappropriate content. Respond with ONLY the word "SAFE" if it is acceptable, or "UNSAFE" if it should be rejected. Do not provide any other text.'
          },
          { role: 'user', content }
        ],
        max_tokens: 10,
        temperature: 0
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Groq API Error during moderation:', data);
      return true; // Fail safe
    }

    const result = data.choices[0].message.content.trim().toUpperCase();
    return result === 'SAFE';
  } catch (err) {
    console.error('Error during comment moderation:', err);
    return true; // Fail safe
  }
}
