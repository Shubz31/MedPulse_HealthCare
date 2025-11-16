import { Button } from "@/components/ui/button";
import PatientForm from "@/components/ui/forms/PatientForm";
import Link from "next/link";
import Image from "next/image";
import PasskeyModal from "@/components/PasskeyModal";

export default async function Home({ searchParams }: SearchParamProps) {

  const params = await searchParams;
  const isAdmin = params?.admin === "true";

  return (
    <div className="flex h-screen max-h-screen">

      {isAdmin && <PasskeyModal />}

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">

          <Image
            src="/assets/icons/MedPulse_logo.png"
            height={1000}
            width={1000}
            alt="MedPulse Logo"
            className="mb-15 h-20 w-fit"
          />

          <PatientForm />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2025 MedPulse. All rights reserved.
            </p>

            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>

          </div>
        </div>
      </section>

      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />
    </div>
  );
}
