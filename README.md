# Thoughts Transcriber

A Next.js application that allows you to record your thoughts using speech recognition and save them for future reference.

## Features

- 🎙️ Record thoughts directly using your device's microphone
- 🗣️ Real-time speech-to-text conversion using Web Speech API
- 💾 Store thoughts in Supabase
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

4. Create a table in your Supabase project:

```sql
CREATE TABLE thoughts (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  user_id UUID
);
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. Navigate to the application in your browser
2. Click the microphone button to start recording
3. Speak your thoughts clearly
4. Click the stop button when you're finished
5. Click the save button to confirm your transcription
6. Enter a title for your thought
7. Click "Save Thought"
8. View your saved thoughts in the list below

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Web Speech API
- Supabase
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
