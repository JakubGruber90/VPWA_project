const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pvzqpyfelogrblmfwypb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2enFweWZlbG9ncmJsbWZ3eXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkwNDI3OTIsImV4cCI6MjAxNDYxODc5Mn0.BR15iKYpZaYBTZGFGmW3NJvC6EoBETYH7fd58_WwAJs'

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };