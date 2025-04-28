import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zgeyiibklawawnycftcj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZXlpaWJrbGF3YXdueWNmdGNqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTczNTk3OCwiZXhwIjoyMDU3MzExOTc4fQ.7E3_tHVeIxPE3tQWcU26K1jx7cYsyUzWwvfHNpeMGi4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
