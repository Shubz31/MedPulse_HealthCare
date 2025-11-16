"use server";

import { ID, Query } from "node-appwrite";
import {
  users,
  storage,
  databases,
  BUCKET_ID,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  ENDPOINT,
  PROJECT_ID,
} from "../appwrite.config";

import { InputFile } from "node-appwrite/file";

const parseStringify = (obj: any) => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    return obj;
  }
};

export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(ID.unique(), user.email, user.phone, undefined, user.name);
    return parseStringify(newUser);
  } catch (error: any) {
  
    if (error?.code === 409) {
      const existing = await users.list([Query.equal("email", [user.email])]);
      if (existing?.users?.length) return parseStringify(existing.users[0]);
    }
    throw error;
  }
};

export const getUser = async (userId: string) => {
  if (!userId) {
    console.error("getUser called without userId");
    return null;
  }
  try {
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (error) {
    console.log(" getUser ERROR:", error);
    return null;
  }
};

export const getPatient = async (userId: string) => {
  if (!userId) {
    console.error("getPatient called without userId");
    return null;
  }

  if (!DATABASE_ID || !PATIENT_COLLECTION_ID) {
    console.error("Database configuration is missing");
    return null;
  }

  try {
    const patients = await databases.listDocuments(DATABASE_ID, PATIENT_COLLECTION_ID, [
      Query.equal("userId", [userId]),
    ]);

    if (!patients || patients.documents.length === 0) return null;
    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.log(" getPatient ERROR:", error);
    return null;
  }
};

export const registerPatient = async ({ identificationDocument, ...patient }: RegisterUserParams) => {
  try {
    let uploadedFile = null;

    if (identificationDocument instanceof FormData) {
      const blob = identificationDocument.get("blobFile") as Blob | null;
      const fileName = identificationDocument.get("fileName") as string | null;

      if (blob && fileName && BUCKET_ID) {
        const buffer = Buffer.from(await blob.arrayBuffer());
        const inputFile = InputFile.fromBuffer(buffer, fileName);
        uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), inputFile);
      }
    }

    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        ...patient,
        userId: patient.userId,
        identificationDocumentId: uploadedFile?.$id || null,
        identificationDocumentUrl: uploadedFile
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${uploadedFile.$id}/view?project=${PROJECT_ID}`
          : null,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.log("registerPatient ERROR:", error);
    return null;
  }
};
