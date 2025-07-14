/**
 * @fileoverview Service for managing client data.
 * This service abstracts the data access layer for clients.
 */
import { z } from 'zod';
import clientPromise from '@/lib/mongodb';
import { type Client, type ClientFormValues, initialClients } from '@/lib/data/clients-data';
import { ObjectId } from 'mongodb';
import { format } from 'date-fns';

async function getClientsCollection() {
  const client = await clientPromise;
  const db = client.db("biztrack-pro");
  return db.collection<Omit<Client, 'id'>>('clients');
}

/**
 * Seeds the database with initial data if the collection is empty.
 */
async function seedDatabase() {
    const clientsCollection = await getClientsCollection();
    const count = await clientsCollection.countDocuments();
    if (count === 0) {
        console.log("Seeding 'clients' collection...");
        // initialClients doesn't have _id, so we can insert it directly.
        // MongoDB will auto-generate the _id.
        const clientsToInsert = initialClients.map(({ id, ...client }) => ({
            ...client,
        }));
        await clientsCollection.insertMany(clientsToInsert as any[]);
    }
}

/**
 * Retrieves all clients from the database.
 * @returns A promise that resolves to an array of all clients.
 */
export async function getClients(): Promise<Client[]> {
  try {
    const clientsCollection = await getClientsCollection();
    await seedDatabase();
    // find({}).toArray() returns all documents in the collection
    const clients = await clientsCollection.find({}).sort({ clientSince: -1 }).toArray();
    
    // The _id from MongoDB is an ObjectId, which is not directly serializable for Next.js API routes.
    // We map it to a simple string.
    return clients.map(client => ({
      ...client,
      id: client._id.toString(),
    } as Client));
  } catch (error) {
    console.error('Error fetching clients from DB:', error);
    // In case of an error, return an empty array.
    return [];
  }
}

/**
 * Adds a new client to the database.
 * @param clientData - The data for the new client, validated against the form schema.
 * @returns The newly created client object.
 */
export async function addClient(clientData: ClientFormValues): Promise<Client> {
    const clientsCollection = await getClientsCollection();

    const newClientDocument: Omit<Client, 'id' | '_id'> = {
        ...clientData,
        tags: clientData.tags ? clientData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
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
        _id: result.insertedId,
        id: result.insertedId.toString(),
    };
}

/**
 * Updates an existing client in the database.
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
 * Deletes a client from the database.
 * @param clientId - The ID of the client to delete.
 * @returns A boolean indicating whether the deletion was successful.
 */
export async function deleteClient(clientId: string): Promise<boolean> {
    const clientsCollection = await getClientsCollection();
    const _id = new ObjectId(clientId);

    const result = await clientsCollection.deleteOne({ _id });
    return result.deletedCount === 1;
}
