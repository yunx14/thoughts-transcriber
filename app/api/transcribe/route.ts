import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header which should contain the user's JWT
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the token and get the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }
    
    const userId = user.id;
    const data = await request.json();
    const { title, content } = data;
    
    if (!content) {
      return NextResponse.json(
        { error: 'No content provided' },
        { status: 400 }
      );
    }

    const thoughtId = uuidv4();
    
    // Create a new supabase client with the user's token to respect RLS policies
    const supabaseWithAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );
    
    // Store the thought in Supabase with the user ID
    const { error } = await supabaseWithAuth.from('thoughts').insert({
      id: thoughtId,
      title,
      content,
      created_at: new Date().toISOString(),
      user_id: userId,
    });
    
    if (error) {
      console.error('Error saving to Supabase:', error);
      return NextResponse.json(
        { error: `Failed to save thought: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      id: thoughtId,
      title,
      content,
      user_id: userId,
    });
  } catch (error) {
    console.error('Error in thought API route:', error);
    return NextResponse.json(
      { error: 'Failed to process thought' },
      { status: 500 }
    );
  }
} 