// app/patients/[userId]/register/page.tsx
import React from "react";
import Image from "next/image";
import RegisterForm from "@/components/ui/forms/RegisterForm";
import { getUser } from "@/lib/actions/patient.action";

interface Props {
  params: Promise<{ userId: string }> | { userId: string };
}

export default async function RegisterPage(props: Props) {
  // Next.js may give params as a Promise — await it to be safe.
  const { userId } = (await props.params) as { userId: string };

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-screen text-red-400">
        Invalid route: missing userId
      </div>
    );
  }

  const user = await getUser(userId);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/icons/MedPulse_logo.png"
            height={1000}
            width={1000}
            alt="MedPulse Logo"
            className="mb-15 h-20 w-fit"
          />

          <RegisterForm user={user ?? null} />

          <p className="copyright py-12">© 2025 MedPulse. All rights reserved.</p>
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
}
