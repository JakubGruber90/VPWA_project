import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zamztqioizjruabirjki.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphbXp0cWlvaXpqcnVhYmlyamtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkxMjA0NjksImV4cCI6MjAxNDY5NjQ2OX0.wM83yC4RLtV2UT7qmQeFyv8eCFhAScFRO_N_lc0Yc6c'

export const supabase = createClient(supabaseUrl, supabaseKey);