import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sua-url-do-supabase-aqui.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sbpublishable-GyaCHNx-tjmMKeYyD_8WQ_drDWJgkh';

export const supabase = createClient(supabaseUrl, supabaseKey);
