
/**
 * @fileoverview Service for managing client data.
 * This service abstracts the data access layer for clients.
 */
import { z } from 'zod';
import clientPromise from '@/lib/mongodb';
import { type Client, type ClientFormValues } from '@/lib/data/clients-data';
import { ObjectId } from 'mongodb';
import { format } from 'date-fns';

async function getClientsCollection() {
  const client = await clientPromise;
  const db = client.db("biztrack-pro");
  return db.collection<Omit<Client, 'id'>>('clients');
}

/**
 * Retrieves all clients from the database, aggregating their order data in real-time.
 * @returns A promise that resolves to an array of all clients with up-to-date stats.
 */
export async function getClients(): Promise<Client[]> {
  try {
    const clientsCollection = await getClientsCollection();
    
    const aggregationPipeline = [
      // Stage 1: Lookup orders for each client
      {
        '$lookup': {
          'from': 'orders', 
          'localField': 'username', 
          'foreignField': 'clientUsername', 
          'as': 'orders'
        }
      },
      // Stage 2: Add fields to calculate totals and last order date
      {
        '$addFields': {
          'totalOrders': { '$size': '$orders' }, 
          'totalEarning': { '$sum': '$orders.amount' }, 
          'lastOrder': { '$max': '$orders.date' },
          'clientSince': { 
            '$ifNull': [ 
              '$clientSince', 
              { '$dateToString': { 'format': '%Y-%m-%d', 'date': '$_id' } }
            ] 
          }
        }
      },
       // Stage 3: Add clientType based on order count
      {
        '$addFields': {
            'clientType': {
                '$cond': {
                    'if': { '$gt': ['$totalOrders', 1] },
                    'then': 'Repeat',
                    'else': 'New'
                }
            }
        }
      },
      // Stage 4: Project the final fields to match the Client interface
      {
        '$project': {
          '_id': 1,
          'username': 1,
          'name': 1,
          'email': 1,
          'avatarUrl': 1,
          'source': 1,
          'socialLinks': 1,
          'notes': 1,
          'tags': 1,
          'isVip': 1,
          'clientSince': 1,
          'totalOrders': 1,
          'totalEarning': 1,
          'clientType': 1,
          'lastOrder': { '$ifNull': ['$lastOrder', 'N/A'] } // Handle clients with no orders
        }
      }
    ];

    const clients = await clientsCollection.aggregate(aggregationPipeline).toArray();
    
    return clients.map((client: any) => ({
      ...client,
      id: client._id.toString(),
    } as Client));
  } catch (error) {
    console.error('Error fetching clients from DB:', error);
    return [];
  }
}

/**
 * Retrieves a single client by their username.
 * @param username - The username of the client to fetch.
 * @returns The client object, or null if not found.
 */
export async function getClientByUsername(username: string): Promise<Client | null> {
    const clientsCollection = await getClientsCollection();
    const client = await clientsCollection.findOne({ username });

    if (!client) {
        return null;
    }

    return {
        ...client,
        id: client._id.toString(),
    } as Client;
}

/**
 * Adds a new client to the database.
 * @param clientData - The data for the new client, validated against the form schema.
 * @returns The newly created client object.
 */
export async function addClient(clientData: ClientFormValues): Promise<Client> {
    const clientsCollection = await getClientsCollection();
    const _id = new ObjectId();

    const newClientDocument: Omit<Client, 'id' > = {
        _id: _id,
        username: clientData.username,
        name: clientData.name || clientData.username,
        email: clientData.email || '',
        avatarUrl: clientData.avatarUrl || '',
        source: clientData.source,
        socialLinks: clientData.socialLinks || [],
        notes: clientData.notes || '',
        tags: clientData.tags ? clientData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        isVip: clientData.isVip || false,
        clientType: 'New',
        clientSince: format(new Date(), 'yyyy-MM-dd'),
        totalOrders: 0,
        totalEarning: 0,
        lastOrder: 'N/A',
    };

    const result = await clientsCollection.insertOne(newClientDocument as any);
    if (!result.insertedId) {
        throw new Error('Failed to insert new client.');
    }

    return {
        ...newClientDocument,
        id: result.insertedId.toString(),
    };
}

/**
 * Updates an existing client in the database by their ID.
 * @param clientId - The ID of the client to update.
 * @param clientData - The new data for the client.
 * @returns The updated client object, or null if not found.
 */
export async function updateClient(clientId: string, clientData: ClientFormValues): Promise<Client | null> {
    const clientsCollection = await getClientsCollection();
    const _id = new ObjectId(clientId);

    const updateData = {
        ...clientData,
        tags: clientData.tags ? clientData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
    
    const result = await clientsCollection.findOneAndUpdate(
        { _id },
        { $set: updateData },
        { returnDocument: 'after' }
    );

    if (!result) {
        return null;
    }

    // Convert the returned document to the Client type
    const { _id: newId, ...rest } = result;
    return {
        _id: newId,
        id: newId.toString(),
        ...rest,
    } as Client;
}

/**
 * Deletes a client from the database by their ID.
 * @param clientId - The ID of the client to delete.
 * @returns A boolean indicating whether the deletion was successful.
 */
export async function deleteClient(clientId: string): Promise<boolean> {
    const clientsCollection = await getClientsCollection();
    const _id = new ObjectId(clientId);

    const result = await clientsCollection.deleteOne({ _id });
    return result.deletedCount === 1;
}
