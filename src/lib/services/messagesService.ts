

import { z } from 'zod';
import { format } from 'date-fns';
import { ObjectId } from 'mongodb';

import clientPromise from '@/lib/mongodb';
import type { MessageData } from '@/lib/data/messages-data';
import { addMessageDataSchema } from '@/lib/data/messages-data';

type MessageFormValues = z.infer<typeof addMessageDataSchema>;

async function getMessagesCollection() {
  const client = await clientPromise;
  const db = client.db("biztrack-pro");
  return db.collection<Omit<MessageData, 'id'>>('messages');
}

export async function addOrUpdateMessageData(data: MessageFormValues): Promise<MessageData> {
    const collection = await getMessagesCollection();
    const dateString = format(data.date, "yyyy-MM-dd");

    const result = await collection.findOneAndUpdate(
        { sourceId: data.sourceId, date: dateString },
        { $set: { messages: data.messages } },
        { upsert: true, returnDocument: 'after' }
    );
    
    if (!result) {
        // This should theoretically not be hit due to upsert: true, but as a fallback
        const newDoc = await collection.findOne({ sourceId: data.sourceId, date: dateString });
        if (!newDoc) throw new Error("Failed to create or update message data.");
        return { ...newDoc, id: newDoc._id.toString() };
    }

    return {
        ...result,
        id: result._id.toString(),
    };
}
