import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vnhvmfczkbshtcuyfkeu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuaHZtZmN6a2JzaHRjdXlma2V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk3ODc2NDMsImV4cCI6MjAxNTM2MzY0M30.87jrP2V0g7cX6f7gOXphsSpwr9crz3AnQNo0aBIs0W0'

export const supabase = createClient(supabaseUrl, supabaseKey);