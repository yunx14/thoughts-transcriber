'use client';

import { useState, useEffect } from 'react';
import { Thought } from '@/lib/supabase';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';
import { useAuth } from '@/lib/auth-context';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';

// Dynamically import browser-only components
const SpeechRecorder = dynamic(() => import('./components/SpeechRecorder'), { ssr: false });
const ThoughtsList = dynamic(() => import('./components/ThoughtsList'), { ssr: false });

type FormValues = {
  title: string;
};

export default function Home() {
  const { user, session, isLoading: authLoading } = useAuth();
  
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [transcription, setTranscription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingThoughts, setLoadingThoughts] = useState(true);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>();

  // Fetch thoughts on initial load or when auth state changes
  useEffect(() => {
    const fetchThoughts = async () => {
      if (!user || !session) {
        setThoughts([]);
        setLoadingThoughts(false);
        return;
      }
      
      try {
        const response = await fetch('/api/thoughts', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setThoughts(data);
        } else {
          console.error('Failed to fetch thoughts');
        }
      } catch (error) {
        console.error('Error fetching thoughts:', error);
      } finally {
        setLoadingThoughts(false);
      }
    };

    if (!authLoading) {
      fetchThoughts();
    }
  }, [user, session, authLoading]);

  // Handle speech recognition transcription complete
  const handleTranscriptionComplete = (text: string) => {
    setTranscription(text);
  };

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    if (!transcription) {
      alert('Please record your thought first');
      return;
    }
    
    if (!user || !session) {
      alert('You must be logged in to save thoughts');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          title: data.title,
          content: transcription,
        }),
      });

      if (response.ok) {
        const newThought = await response.json();
        setThoughts(prev => [newThought, ...prev]);
        reset();
        setTranscription('');
      } else {
        const errorData = await response.json();
        alert(`Failed to save thought: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error saving thought:', error);
      alert('Failed to save your thought');
    } finally {
      setIsLoading(false);
    }
  };

  // If authentication is still loading, show a loading spinner
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }
  
  // If user is not authenticated, show the auth component
  if (!user) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">Voice Thoughts Recorder</h1>
        <Auth />
      </main>
    );
  }

  // If user is authenticated, show the thoughts recorder
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Voice Thoughts Recorder</h1>
      
      <UserProfile />
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Capture a New Thought</h2>
        
        <div className="mb-6">
          <SpeechRecorder onTranscriptionComplete={handleTranscriptionComplete} />
        </div>
        
        {transcription && (
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <p className="text-sm text-blue-800 font-semibold mb-1">Your Recorded Thought:</p>
            <p className="text-sm">{transcription}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Thought Title
            </label>
            <input
              id="title"
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a title for your thought"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !transcription}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <FaSpinner className="inline mr-2 animate-spin" /> Saving...
              </>
            ) : (
              'Save Thought'
            )}
          </button>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Thoughts</h2>
        
        {loadingThoughts ? (
          <div className="flex justify-center items-center py-10">
            <FaSpinner className="animate-spin text-gray-500 text-2xl" />
          </div>
        ) : (
          <ThoughtsList thoughts={thoughts} />
        )}
      </div>
    </main>
  );
}
