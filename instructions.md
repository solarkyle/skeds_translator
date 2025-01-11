# Project overview
Here's a clear description you can use with an AI coder, optimized for GitHub Pages deployment:

---

I need a kid's spelling translator web app that helps young children learning to spell. The app should convert their phonetic/invented spelling into correct English and provide encouraging learning tips.

Core Features:
1. Single-page React app (needs to work with GitHub Pages)
2. Two main components:
   - Input area for kids to type their "invented spelling" attempts
   - Display area showing the corrected text and learning tips

Technical Requirements:

3. Use the gemini for translation
4. Since it's on GitHub Pages (static hosting), handle the API calls through a serverless function (e.g., Vercel Edge Functions, Netlify Functions, or AWS Lambda)
5. Store API keys securely in environment variables

Key UI Elements:
- Large, friendly text input area
- Fun, colorful design with emojis and encouraging messages
- Loading spinner while translation happens
- Error handling with kid-friendly messages
- Tips section that shows 2-3 spelling tips based on their attempt

Example Input/Output:
```
Input: "haw to mac muny rely crewec"
Output: 
- Translated: "how to make money really quick"
- Tips: 
  • "The 'k' sound can be made by both 'k' and 'c'"
  • "Great job sounding out 'really'!"
```

Design Requirements:
- Purple and yellow color scheme
- Round corners on all elements
- Large, readable text
- Emoji decorations
- Animated elements (like the loading spinner)
- Mobile-responsive design

For GitHub Pages deployment:
- All API calls should go through a serverless function URL
- Environment variables should be configured for production
- Build script should be set up for gh-pages deployment

