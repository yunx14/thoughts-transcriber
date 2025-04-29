# Thoughts Transcriber

A Next.js application that allows you to record your thoughts using speech recognition and save them for future reference. Features user authentication to keep your thoughts private.

## Features

- 🔒 User authentication with email/password signup and login
- 🎙️ Record thoughts directly using your device's microphone
- 🗣️ Real-time speech-to-text conversion using Web Speech API
- 💾 Store thoughts in Supabase with user-based access control
- 📱 Responsive design that works on desktop and mobile

## Prerequisites

- Node.js 18 or higher
- A Supabase account and project
- Modern browser that supports Web Speech API (Chrome, Edge, or Safari recommended)

## Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/thoughts-transcriber.git
cd thoughts-transcriber
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase:
   - Create a new project in the Supabase dashboard
   - Go to Authentication → Settings and enable Email authentication
   - Create a thoughts table in your Supabase project:

```sql
CREATE TABLE thoughts (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  user_id UUID REFERENCES auth.users(id) NOT NULL
);

-- Create a policy to allow users to only access their own thoughts
CREATE POLICY "Users can only access their own thoughts"
  ON thoughts
  FOR ALL
  USING (auth.uid() = user_id);

-- Enable Row Level Security
ALTER TABLE thoughts ENABLE ROW LEVEL SECURITY;
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. Navigate to the application in your browser
2. Sign up for an account or sign in if you already have one
3. Click the microphone button to start recording
4. Speak your thoughts clearly
5. Click the stop button when you're finished
6. Click the save button to confirm your transcription
7. Enter a title for your thought
8. Click "Save Thought"
9. View your saved thoughts in the list below
10. Sign out when you're done using the app

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Web Speech API
- Supabase (Authentication & Database)
- React Hook Form

## Browser Compatibility

This application relies on the Web Speech API, which is supported in:
- Chrome
- Edge
- Safari
- Some Chromium-based browsers

Firefox requires enabling flags for speech recognition support.

## License

MIT
