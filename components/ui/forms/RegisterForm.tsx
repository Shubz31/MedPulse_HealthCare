// components/ui/forms/RegisterForm.tsx
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "@/components/ui/CustomFormField";
import SubmitButton from "@/components/ui/SubmitButton";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { registerPatient } from "@/lib/actions/patient.action";
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import Image from "next/image";
import FileUploader from "@/components/FileUploader";

type Props = {
  user: User | null;
};

const RegisterForm = ({ user }: Props) => {
  const router = useRouter();
  const [isLoading, setisLoading] = React.useState(false);

const form = useForm<z.infer<typeof PatientFormValidation>>({
  resolver: zodResolver(PatientFormValidation),
  defaultValues: {
    ...PatientFormDefaultValues,

    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",

    birthDate: new Date(),
  },

});


  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setisLoading(true);

    let formData: FormData | undefined;

    if (values.identificationDocument && values.identificationDocument.length > 0) {
      const first = values.identificationDocument[0];
      formData = new FormData();
      formData.append("blobFile", first);
      formData.append("fileName", first.name);
    }

    try {
      const patientData = {
        ...values,
        userId: user?.$id ?? "",
        birthDate: new Date(values.birthDate as string | Date),
        identificationDocument: formData,
      };

      // server action
      // @ts-ignore - server action typing may vary in your setup
      const patient = await registerPatient(patientData);

      if (patient) router.push(`/patients/${user?.$id}/new-appointment`);
    } catch (error) {
      console.error("register submit error:", error);
    } finally {
      setisLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="space-y-4">
          <h1 className="header">Welcome 👋🏻</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h1 className="sub-header">Personal Information</h1>
          </div>
        </section>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="name"
          label="Full name"
          placeholder="Shubz"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user icon"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="email"
            label="Email"
            placeholder="shubz@gmail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.PHONE_INPUT}
            name="phone"
            label="Phone number"
            placeholder="(555) 555-5555"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField control={form.control} fieldType={FormFieldType.DATE_PICKER} name="birthDate" label="Date of Birth" />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SKELETON}
            name="gender"
            label="Gender"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup className="flex h-11 gap-6 xl:justify-between" onValueChange={field.onChange} defaultValue={field.value}>
                  {GenderOptions.map((option) => (
                    <div key={option} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name="address" label="Address" placeholder="123 Main St, City, State" />
          <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name="occupation" label="Occupation" placeholder="Software Engineer" />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name="emergencyContactName" label="Emergency Contact Name" placeholder="Guardian's Name" />
          <CustomFormField control={form.control} fieldType={FormFieldType.PHONE_INPUT} name="emergencyContactNumber" label="Emergency Contact Number" placeholder="(555) 555-5555" />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h1 className="sub-header">Medical Information</h1>
          </div>
        </section>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField control={form.control} fieldType={FormFieldType.SELECT} name="primaryPhysician" label="Primary Physician" placeholder="Select a physician">
            {Doctors.map((doctor) => (
              <SelectItem key={doctor.name} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image src={doctor.image} width={32} height={32} alt={doctor.name} className="rounded-full border border-dark-500" />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name="insuranceProvider" label="Insurance provider" placeholder="LIC Life Insurance" />
          <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name="insurancePolicyNumber" label="Insurance Policy Number" placeholder="XYZ123456789" />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField control={form.control} fieldType={FormFieldType.TEXTAREA} name="allergies" label="Allergies (if any)" placeholder="Peanuts, Pollen, Dust etc." />
          <CustomFormField control={form.control} fieldType={FormFieldType.TEXTAREA} name="currentMedication" label="Current Medications (if any)" placeholder="Ibuprofen 500mg, Paracetamol 500mg etc." />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField control={form.control} fieldType={FormFieldType.TEXTAREA} name="familyMedicalHistory" label="Family Medical History" placeholder="Mother: Cancer, Father: Heart disease etc." />
          <CustomFormField control={form.control} fieldType={FormFieldType.TEXTAREA} name="pastMedicalHistory" label="Past Medical History" placeholder="Dengue, Chickenpox etc." />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h1 className="sub-header">Identification and Verification</h1>
          </div>
        </section>

        <CustomFormField control={form.control} fieldType={FormFieldType.SELECT} name="identificationType" label="Identification Type" placeholder="Select and Identification Type">
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name="identificationNumber" label="Identification Number" placeholder="123456789" />

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.SKELETON}
          name="identificationDocument"
          label="Upload Identification Document"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h1 className="sub-header">Consent and Privacy</h1>
          </div>
        </section>

        <CustomFormField fieldType={FormFieldType.CHECKBOX} control={form.control} name="treatmentConsent" label="I consent to treatment" />

        <CustomFormField fieldType={FormFieldType.CHECKBOX} control={form.control} name="disclosureConsent" label="I consent to disclosure of information" />

        <CustomFormField fieldType={FormFieldType.CHECKBOX} control={form.control} name="privacyConsent" label="I consent to the privacy policy" />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
