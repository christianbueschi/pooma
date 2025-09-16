import { Database } from '../supabase/types';

export type Team = Database['public']['Tables']['teams']['Row'] & {
  members?: Member[];
};
export type Member = Database['public']['Tables']['members']['Row'];

export type TeamInsert = Database['public']['Tables']['teams']['Insert'];
export type TeamUpdate = Database['public']['Tables']['teams']['Update'];

export type MemberInsert = Database['public']['Tables']['members']['Insert'];
export type MemberUpdate = Database['public']['Tables']['members']['Update'];
