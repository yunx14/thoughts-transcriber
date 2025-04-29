import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { title, content } = data;
    
    if (!content) {
      return NextResponse.json(
        { error: 'No content provided' },
        { status: 400 }
      );
    }

    const thoughtId = uuidv4();
    
    // Store the thought in Supabase
    const { error } = await supabase.from('thoughts').insert({
      id: thoughtId,
      title,
      content,
      created_at: new Date().toISOString(),
    });
    
    if (error) {
      console.error('Error saving to Supabase:', error);
      return NextResponse.json(
        { error: 'Failed to save thought' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      id: thoughtId,
      title,
      content,
    });
  } catch (error) {
    console.error('Error in thought API route:', error);
    return NextResponse.json(
      { error: 'Failed to process thought' },
      { status: 500 }
    );
  }
} 