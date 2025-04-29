import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('thoughts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching thoughts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch thoughts' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET thoughts API:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve thoughts' },
      { status: 500 }
    );
  }
} 