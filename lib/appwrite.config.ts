import * as sdk from "node-appwrite";

const client = new sdk.Client();

client
  .setEndpoint(process.env.ENDPOINT!)        // https://cloud.appwrite.io/v1
  .setProject(process.env.PROJECT_ID!)
  .setKey(process.env.API_KEY!);

// Appwrite services
export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);

// Export IDs
export const ENDPOINT = process.env.ENDPOINT!;
export const PROJECT_ID = process.env.PROJECT_ID!;
export const API_KEY = process.env.API_KEY!;
export const DATABASE_ID = process.env.DATABASE_ID!;
export const PATIENT_COLLECTION_ID = process.env.PATIENTS_COLLECTION_ID!;
export const APPOINTMENT_COLLECTION_ID = process.env.APPOINTMENTS_COLLECTION_ID!;
export const BUCKET_ID = process.env.BUCKET_ID!;
