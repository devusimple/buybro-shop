import { init, id } from '@instantdb/core';

const APP_ID = process.env.INSTANT_APP_ID || '15965306-4c1b-425f-ab5b-8b8a41ffcb39';
const ADMIN_TOKEN = process.env.INSTANT_APP_ADMIN_TOKEN || '';

// Initialize InstantDB
export const db = init({
  appId: APP_ID,
  __adminToken: ADMIN_TOKEN,
});

// Export ID generator
export { id };

// Admin API for server-side operations
const INSTANT_API = 'https://api.instantdb.com';

interface AdminQueryResponse {
  [key: string]: unknown;
}

// Server-side query function using admin API
export async function queryDB(query: object): Promise<{ result: AdminQueryResponse | null; error: string | null }> {
  try {
    console.log('[InstantDB] Querying:', JSON.stringify(query));
    
    const response = await fetch(`${INSTANT_API}/admin/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'App-Id': APP_ID,
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify({
        query,
      }),
    });

    const data = await response.json();
    console.log('[InstantDB] Query response:', JSON.stringify(data).substring(0, 500));
    
    if (!response.ok) {
      console.error('[InstantDB] Query error:', data);
      return { result: null, error: data.message || 'Query failed' };
    }

    return { result: data, error: null };
  } catch (error) {
    console.error('[InstantDB] Query error:', error);
    return { result: null, error: String(error) };
  }
}

// Server-side transaction function using push API
export async function transactDB(operations: Array<{
  action: 'update' | 'delete' | 'link' | 'unlink';
  namespace: string;
  id: string;
  data?: object;
}>): Promise<{ success: boolean; error: string | null }> {
  try {
    // Convert operations to InstantDB push format
    const steps = operations.map(op => {
      if (op.action === 'update') {
        return ['update', op.namespace, op.id, op.data];
      } else if (op.action === 'delete') {
        return ['delete', op.namespace, op.id];
      } else if (op.action === 'link') {
        return ['link', op.namespace, op.id, op.data];
      } else {
        return ['unlink', op.namespace, op.id, op.data];
      }
    });

    console.log('[InstantDB] Pushing transaction:', JSON.stringify(steps).substring(0, 500));

    const response = await fetch(`${INSTANT_API}/runtime/push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify({
        'app-id': APP_ID,
        steps,
      }),
    });

    const responseText = await response.text();
    console.log('[InstantDB] Push response status:', response.status);
    console.log('[InstantDB] Push response:', responseText.substring(0, 500));

    if (!response.ok) {
      console.error('[InstantDB] Transaction error:', responseText);
      return { success: false, error: responseText || 'Transaction failed' };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('[InstantDB] Transaction error:', error);
    return { success: false, error: String(error) };
  }
}

// Helper to create update operation
export function updateOp(namespace: string, id: string, data: object) {
  return { action: 'update' as const, namespace, id, data };
}

// Helper to create delete operation
export function deleteOp(namespace: string, id: string) {
  return { action: 'delete' as const, namespace, id };
}

// Helper to create link operation
export function linkOp(namespace: string, id: string, data: object) {
  return { action: 'link' as const, namespace, id, data };
}

// Helper to create unlink operation
export function unlinkOp(namespace: string, id: string, data: object) {
  return { action: 'unlink' as const, namespace, id, data };
}
