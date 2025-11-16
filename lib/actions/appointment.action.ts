"use server";

import { ID, Query } from "node-appwrite";
import { 
  APPOINTMENT_COLLECTION_ID, 
  DATABASE_ID, 
  PATIENT_COLLECTION_ID, 
  databases,
  messaging
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment, Patient } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";
import { send } from "node:process";

export const createAppointment = async (appointment: CreateAppointmentParams) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );

    return parseStringify(newAppointment);
  } catch (error) {
    console.log(error);
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID,
      appointmentId
    );

    return parseStringify(appointment);
  } catch (error) {
    console.log(error);
  }
};

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

 
    const enrichedAppointments = await Promise.all(
      appointments.documents.map(async (appointment: any) => {
        try {
          const patient = await databases.getDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,  
            appointment.patient         
          );

          return {
            ...appointment,
            patient, 
          };
        } catch (err) {
          console.log("Failed to fetch patient:", err);
          return appointment; 
        }
      })
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    enrichedAppointments.forEach((a: any) => {
      if (a.status === "scheduled") initialCounts.scheduledCount++;
      if (a.status === "pending") initialCounts.pendingCount++;
      if (a.status === "cancelled") initialCounts.cancelledCount++;
    });

    return parseStringify({
      totalCount: appointments.total,
      ...initialCounts,
      documents: enrichedAppointments,
    });

  } catch (error) {
    console.log(error);
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) {
      throw new Error("Appointment not found");
    }

    const smsMessage = `
      Hi, it's MedPulse.
      ${type === 'schedule' 
        ? `Your appointment has been scheduled for ${formatDateTime(appointment.schedule!).dateTime} 
        with Dr. ${appointment.primaryPhysician}.` 
        : `We regret to inform you that your appointment has been cancelled for the following reason: 
        ${appointment.cancellationReason}`}
      `
    await sendSMSNotification(userId, smsMessage);
    revalidatePath("/admin");

    return parseStringify(updatedAppointment);
  } catch (error) {
    console.log(error);
  }
};

export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId]
    )

    return parseStringify(message);
  } catch (error) {
    console.log(error)
  }
}
