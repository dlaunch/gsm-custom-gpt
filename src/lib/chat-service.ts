import { v4 as uuidv4 } from 'uuid';
import { supabase, UserMessage } from './supabase';

// Get environment variables or use fallbacks
const getEnvVariable = (key: string, defaultValue: string = ''): string => {
  // For Vite, environment variables are prefixed with VITE_
  const envValue = import.meta.env[`VITE_${key}`];
  return envValue !== undefined ? envValue : defaultValue;
};

const WEBHOOK_URL = getEnvVariable('WEBHOOK_URL');
const AUTH_USERNAME = getEnvVariable('AUTH_USERNAME');
const AUTH_PASSWORD = getEnvVariable('AUTH_PASSWORD');

export async function sendMessage(
  message: string, 
  sessionId: string, 
  chatModel: string = "OpenAI", 
  modelParams: Record<string, string> = {}
): Promise<boolean> {
  try {
    const requestId = uuidv4();
    
    const payload = [
      {
        sessionId: sessionId,
        action: "sendMessage",
        chatInput: message,
        chatModel: chatModel,
        ...modelParams
      }
    ];
    
    // Create the Basic Authentication header
    const authHeader = 'Basic ' + btoa(`${AUTH_USERNAME}:${AUTH_PASSWORD || ''}`);
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(payload),
    });
    
    console.log('webhook response status:', response.status);
    
    if (!response.ok) {
      console.error('webhook error:', response.statusText);
      return false;
    }
    
    const data = await response.json();
    console.log('webhook response:', data);
    
    // Return true as the success indicator
    // The actual AI response will come through the subscription
    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    return false;
  }
}

export async function getMessages(sessionId: string): Promise<UserMessage[]> {
  const { data, error } = await supabase
    .from('n8n_chat_histories')
    .select('*')
    .eq('session_id', sessionId)
    .order('id', { ascending: true });
  
  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
  
  return data as UserMessage[];
}

export async function getConversations(): Promise<{ session_id: string, title: string }[]> {
  // First get distinct session_ids
  const { data: sessionData, error: sessionError } = await supabase
    .from('n8n_chat_histories')
    .select('session_id')
    .order('id', { ascending: false })
    .limit(50);
  
  if (sessionError || !sessionData) {
    console.error('Error fetching conversations:', sessionError);
    return [];
  }
  
  // Get unique session IDs
  const uniqueSessionIds = Array.from(new Set(sessionData.map(session => session.session_id)));
  
  // For each session ID, get the first human message
  const conversations = await Promise.all(
    uniqueSessionIds.map(async (sessionId) => {
      const { data, error } = await supabase
        .from('n8n_chat_histories')
        .select('*')
        .eq('session_id', sessionId)
        .order('id', { ascending: true })
        .limit(10);
      
      if (error || !data || data.length === 0) {
        return {
          session_id: sessionId,
          title: 'New Conversation'
        };
      }
      
      // Find first human message
      const firstHumanMessage = data.find(msg => msg.message.type === 'human');
      
      // Truncate the title to first 100 characters
      const title = firstHumanMessage 
        ? firstHumanMessage.message.content.substring(0, 100) + (firstHumanMessage.message.content.length > 100 ? '...' : '')
        : 'New Conversation';
      
      return {
        session_id: sessionId,
        title
      };
    })
  );
  
  return conversations;
}

export function subscribeToMessages(sessionId: string, callback: (message: UserMessage) => void) {
  return supabase
    .channel(`public:n8n_chat_histories:session_id=eq.${sessionId}`)
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'n8n_chat_histories',
        filter: `session_id=eq.${sessionId}`
      }, 
      (payload) => {
        callback(payload.new as UserMessage);
      }
    )
    .subscribe();
}
