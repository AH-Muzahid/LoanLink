# How to Get Your Free Google Gemini API Key

Follow these simple steps to make your AI Loan Advisor chatbot intelligent!

### Step 1: Visit Google AI Studio
Go to this URL: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

### Step 2: Sign In
Sign in with your standard Google (Gmail) account. You do **not** need a paid cloud account or credit card for the free tier.

### Step 3: Create API Key
1. Click the large blue **"Create API key"** button.
2. If asked, select **"Create API key in new project"**.
   - This keeps things simple and automatically sets up a project for you.

### Step 4: Copy the Key
1. A popup will appear showing your new key. It starts with `AIza...`.
2. Click the **"Copy"** button to copy it to your clipboard.

### Step 5: Add to Your Project
1. Open the file `.env.local` in your project folder (`c:\Projects\B12A11-LoanLinks\LoanLinks clients\.env.local`).
2. Paste the key like this:

```env
VITE_GEMINI_API_KEY=AIzaSyB...<paste_your_key_here>...
```

### Step 6: Restart
Stop your terminal (Ctrl+C) and run `npm run dev` again to load the new key.
