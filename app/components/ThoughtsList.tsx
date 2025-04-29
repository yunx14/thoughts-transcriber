'use client';

import React from 'react';
import { Thought } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';

interface ThoughtsListProps {
  thoughts: Thought[];
}

export default function ThoughtsList({ thoughts }: ThoughtsListProps) {
  if (!thoughts || thoughts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No thoughts recorded yet. Start by speaking your thoughts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {thoughts.map((thought) => (
        <div
          key={thought.id}
          className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-medium">{thought.title}</h3>
          <p className="text-gray-600 mt-2">{thought.content}</p>
          <div className="mt-2 text-sm text-gray-500">
            {thought.created_at && formatDistanceToNow(new Date(thought.created_at), { addSuffix: true })}
          </div>
        </div>
      ))}
    </div>
  );
} 