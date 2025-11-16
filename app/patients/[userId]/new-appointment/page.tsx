// app/patients/[userId]/new-appointment/page.tsx
import Image from "next/image";
import AppointmentForm from "@/components/ui/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.action";

interface Props {
  params: Promise<{ userId: string }> | { userId: string };
}

export default async function NewAppointment(props: Props) {
  const { userId } = (await props.params) as { userId: string };

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-screen text-red-400">
        Invalid route: userId is missing.
      </div>
    );
  }

  const patient = await getPatient(userId);

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-screen text-red-400">
        Patient not found. Please complete registration first.
      </div>
    );
  }

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/MedPulse_logo.png"
            height={1000}
            width={1000}
            alt="MedPulse Logo"
            className="mb-15 h-20 w-fit"
          />

          <AppointmentForm type="create" userId={userId} patientId={patient.$id} />

          <p className="copyright mt-10 py-12">
            © 2025 MedPulse. All rights reserved.
          </p>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1000}
        width={1000}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}
