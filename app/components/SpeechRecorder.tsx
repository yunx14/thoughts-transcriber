'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaStop, FaSave, FaTrash } from 'react-icons/fa';

// Add type definitions for the Web Speech API
interface Window {
  SpeechRecognition?: typeof SpeechRecognition;
  webkitSpeechRecognition?: typeof SpeechRecognition;
}

interface SpeechRecorderProps {
  onTranscriptionComplete: (text: string) => void;
}

export default function SpeechRecorder({ onTranscriptionComplete }: SpeechRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if Speech Recognition is supported
    if (!('webkitSpeechRecognition' in window) && 
        !('SpeechRecognition' in window)) {
      setIsSpeechRecognitionSupported(false);
    }
    
    return () => {
      // Cleanup on component unmount
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = () => {
    try {
      // Initialize speech recognition with type assertion to avoid TypeScript errors
      const SpeechRecognition: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(finalTranscript || interimTranscript);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        stopRecording();
      };
      
      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      alert('Could not start speech recognition. Please check your browser permissions.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const saveTranscription = () => {
    if (transcript) {
      onTranscriptionComplete(transcript);
    }
  };

  const discardTranscription = () => {
    setTranscript('');
  };

  if (!isSpeechRecognitionSupported) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        Your browser does not support the Speech Recognition API. 
        Please try using Chrome, Edge, or Safari.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
      <div className="flex space-x-4 mb-4">
        {!isRecording && !transcript && (
          <button
            onClick={startRecording}
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            aria-label="Start recording"
          >
            <FaMicrophone className="w-5 h-5" />
          </button>
        )}
        
        {isRecording && (
          <button
            onClick={stopRecording}
            className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            aria-label="Stop recording"
          >
            <FaStop className="w-5 h-5" />
          </button>
        )}
        
        {transcript && !isRecording && (
          <>
            <button
              onClick={saveTranscription}
              className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
              aria-label="Save transcription"
            >
              <FaSave className="w-5 h-5" />
            </button>
            
            <button
              onClick={discardTranscription}
              className="p-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
              aria-label="Discard transcription"
            >
              <FaTrash className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
      
      {transcript && (
        <div className="w-full mt-4">
          <div className="bg-white p-3 rounded-lg border border-gray-300 min-h-[100px] max-h-[200px] overflow-y-auto">
            {transcript}
          </div>
        </div>
      )}
      
      {isRecording && (
        <div className="mt-2 text-sm text-gray-600">
          Speaking... (click stop when finished)
        </div>
      )}
    </div>
  );
} 