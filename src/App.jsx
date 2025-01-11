import { useState } from 'react'
import styled from '@emotion/styled'
import { motion, AnimatePresence } from 'framer-motion'

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  background-color: #f8f0ff;
  min-height: 100vh;
`

const Title = styled.h1`
  color: #6b46c1;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
`

const InputArea = styled.textarea`
  width: 100%;
  height: 150px;
  padding: 1rem;
  border-radius: 15px;
  border: 3px solid #ffd700;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  background-color: white;
  &:focus {
    outline: none;
    border-color: #6b46c1;
  }
`

const TranslationCard = styled(motion.div)`
  background-color: white;
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
`

const TipsContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #fff3dc;
  border-radius: 15px;
`

const LoadingSpinner = styled(motion.div)`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #6b46c1;
  border-radius: 50%;
  margin: 20px auto;
`

const Button = styled(motion.button)`
  background-color: #6b46c1;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  cursor: pointer;
  display: block;
  margin: 0 auto;
  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`

function App() {
  const [input, setInput] = useState('')
  const [translation, setTranslation] = useState('')
  const [tips, setTips] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const callGeminiAPI = async (prompt, apiKey) => {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }],
          role: 'user'
        }]
      })
    });

    const data = await response.json();
    console.log('API Response:', data);  // Debug log
    
    if (!response.ok) {
      console.error('API Error:', data.error);  // Debug log
      throw new Error(data.error?.message || 'API request failed');
    }

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Invalid Response Structure:', data);  // Debug log
      throw new Error('Invalid response from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  }

  const translateText = async () => {
    if (!input.trim()) return

    setIsLoading(true)
    setError('')
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey) {
        throw new Error('API key not found. Please check your environment variables.')
      }
      const prompt = `
        Act as a helpful teacher. Given this text written by a child learning to spell:
        "${input}"
        
        Please provide:
        1. The correct spelling
        2. 2-3 encouraging tips about their spelling attempt
        
        Format the response as JSON with "translation" and "tips" fields.
        
        Example response format:
        {
          "translation": "how to make money really quick",
          "tips": [
            "Great job sounding out 'really'!",
            "The 'k' sound can be made by both 'k' and 'c'"
          ]
        }
      `

      const responseText = await callGeminiAPI(prompt, apiKey)
      console.log('Raw Response:', responseText);  // Debug log
      
      try {
        // Clean up the response text by removing markdown code block syntax
        const cleanJson = responseText
          .replace(/```json\n?/g, '')  // Remove ```json
          .replace(/```\n?/g, '')      // Remove closing ```
          .trim()                      // Remove extra whitespace
        
        const data = JSON.parse(cleanJson)
        console.log('Parsed Data:', data);  // Debug log
        
        if (!data.translation || !Array.isArray(data.tips)) {
          throw new Error('Response missing required fields');
        }
        
        setTranslation(data.translation)
        setTips(data.tips)
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);  // Debug log
        setError('Oops! The response format was unexpected. Let\'s try again! 🎈')
      }
    } catch (err) {
      console.error('API Error:', err);  // Debug log
      setError(err.message || 'Oops! Something went wrong. Let\'s try again! 🎈')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <Title>✨ Skedword Translator 🌈</Title>
      
      <InputArea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your spelling here! Don't worry about getting it perfect - just try your best! 😊"
      />

      <Button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={translateText}
        disabled={!input.trim() || isLoading}
      >
        Translate! 🚀
      </Button>

      <AnimatePresence>
        {isLoading && (
          <LoadingSpinner
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}

        {error && (
          <TranslationCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {error}
          </TranslationCard>
        )}

        {translation && !isLoading && (
          <TranslationCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3>Here's what you wrote: ✍️</h3>
            <p style={{ fontSize: '1.2rem' }}>{translation}</p>

            <TipsContainer>
              <h3>Helpful Tips! 🌟</h3>
              <ul>
                {tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </TipsContainer>
          </TranslationCard>
        )}
      </AnimatePresence>
    </Container>
  )
}

export default App
