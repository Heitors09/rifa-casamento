import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hxhfvmonnakiyjswjmid.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4aGZ2bW9ubmFraXlqc3dqbWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNDc5NDIsImV4cCI6MjA4ODgyMzk0Mn0.YPYnjLOxAgCVa6lKKTSuDrTv0-w-q_jWOy6VefcdIS0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Testing 'User' table...");
  const { data, error, status, statusText } = await supabase.from('User').select('*');
  console.log("Status:", status, statusText);
  console.log("Data:", data);
  console.log("Error object map:", JSON.stringify(error, null, 2));
}
run();
