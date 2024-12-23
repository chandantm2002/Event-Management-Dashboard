import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useChat() {
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string) => {
    try {
      setLoading(true);
      
      // Call your backend API endpoint that handles OpenAI communication
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message }
      });

      if (error) throw error;
      return data.response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
}