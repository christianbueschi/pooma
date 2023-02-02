import { createClient } from '@supabase/supabase-js';
import { Database } from '../../supabase/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || '';

export const client = createClient<Database>(supabaseUrl, supabaseKey);
