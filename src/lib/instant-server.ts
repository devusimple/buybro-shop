import { init, id } from '@instantdb/admin';
import schema from '../../schema';

const APP_ID = process.env.INSTANT_APP_ID || process.env.NEXT_PUBLIC_INSTANT_APP_ID || '15965306-4c1b-425f-ab5b-8b8a41ffcb39';
const ADMIN_TOKEN = process.env.INSTANT_APP_ADMIN_TOKEN || 'c89d31dd-c2fb-41fe-9e67-c0946668be33';

// Initialize InstantDB with admin token for server-side operations
export const db = init({
  appId: APP_ID,
  schema,
  adminToken: ADMIN_TOKEN,
  useDateObjects: true,
});

// Export ID generator
export { id };

// Admin API for server-side operations
const INSTANT_API = 'https://api.instantdb.com';

// Server-side query function using admin API
export async function queryDB(query: object): Promise<{ result: Record<string, unknown[]> | null; error: string | null }> {
  try {
    console.log('[InstantDB] Querying:', JSON.stringify(query));
    const result = await db.query(query);
    console.log('[InstantDB] Query result:', result);

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
    console.log('[InstantDB] Query response status:', response.status);
    
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
  linked?: { entity: string; id: string }[];
}>): Promise<{ success: boolean; error: string | null }> {
  try {
    // Convert operations to InstantDB push format
    const steps: unknown[] = [];
    
    for (const op of operations) {
      if (op.action === 'update') {
        steps.push(['update', op.namespace, op.id, op.data]);
        // Add links if provided
        if (op.linked) {
          for (const link of op.linked) {
            steps.push(['link', op.namespace, op.id, link.entity, link.id]);
          }
        }
      } else if (op.action === 'delete') {
        steps.push(['delete', op.namespace, op.id]);
      } else if (op.action === 'link') {
        if (op.data) {
          steps.push(['link', op.namespace, op.id, op.data]);
        }
      } else if (op.action === 'unlink') {
        if (op.data) {
          steps.push(['unlink', op.namespace, op.id, op.data]);
        }
      }
    }

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
export function updateOp(namespace: string, entityId: string, data: object, linked?: { entity: string; id: string }[]) {
  return { action: 'update' as const, namespace, id: entityId, data, linked };
}

// Helper to create delete operation
export function deleteOp(namespace: string, entityId: string) {
  return { action: 'delete' as const, namespace, id: entityId };
}

// Helper to create link operation
export function linkOp(namespace: string, entityId: string, linkedEntity: string, linkedId: string) {
  return { action: 'link' as const, namespace, id: entityId, data: { entity: linkedEntity, id: linkedId } };
}

// Helper to create unlink operation
export function unlinkOp(namespace: string, entityId: string, linkedEntity: string, linkedId: string) {
  return { action: 'unlink' as const, namespace, id: entityId, data: { entity: linkedEntity, id: linkedId } };
}

// Utility function to generate unique slugs
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Utility function to generate order numbers
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}
