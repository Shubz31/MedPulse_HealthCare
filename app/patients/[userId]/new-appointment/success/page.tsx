import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.action";
import Image from "next/image";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";

import React from "react";
import { Button } from "@/components/ui/button";

interface SearchParamProps {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ appointmentId?: string }>;
}

const Success = async ({ params, searchParams }: SearchParamProps) => {

  const { userId } = await params;
  const { appointmentId } = await searchParams;


  if (!appointmentId) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-white">
        <h2 className="text-xl">Invalid appointment link</h2>
      </div>
    );
  }

  const appointment = await getAppointment(appointmentId);


  const doctor = Doctors.find(
    (doc) => doc.name === appointment.primaryPhysician
  );

  return (
    <div className="flex h-screen w-full items-center justify-center px-[5%]">
      <div className="flex flex-col items-center">
        <Link href="/">
          <Image
            src="/assets/icons/MedPulse_logo.png"
            height={1000}
            width={1000}
            alt="logo"
            className="mb-10 h-20 w-fit"
          />
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
          />

          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>

          <p>We will be in touch shortly to confirm.</p>
        </section>

        <section className="request-details mt-10 w-full max-w-3xl border-t border-white/10 pt-6">
        <p className="font-semibold text-center mb-4">
            Requested appointment details:
        </p>

        <div className="flex items-center justify-center gap-8">

            <div className="flex items-center gap-3">
            {doctor ? (
                <Image
                src={doctor.image}
                alt="doctor"
                width={40}
                height={40}
                className="rounded-full"
                />
            ) : (
                <p className="text-sm text-gray-400">No doctor info</p>
            )}

            <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
            </div>

            <div className="flex items-center gap-2">
            <Image
                src="/assets/icons/calendar.svg"
                height={24}
                width={24}
                alt="calendar"
            />
            <p>{formatDateTime(appointment.schedule).dateTime}</p>
            </div>

        </div>

        <div className="border-t border-white/10 mt-6"></div>
        </section>

        <Button variant="outline" className="shad-primary-btn mt-5" asChild>
            <Link href={`/patients/${userId}/new-appointment`}>
                New Appointment
            </Link>
        </Button>

        <p className="copyright mt-2 py-2">© 2025 MedPulse. All rights reserved.</p>

      </div>
    </div>
  );
};

export default Success;
