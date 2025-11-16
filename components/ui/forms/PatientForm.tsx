"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.action";


export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phone-input",
  CHECKBOX = "checkbox",
  SELECT = "select",
  DATE_PICKER = "date-picker",
  SKELETON = "skeleton",
}



const PatientForm = () => {

  const router = useRouter();

  const [isLoading, setisLoading] = React.useState(false)


  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
    mode: "all",
    reValidateMode: "onChange",
  });

  async function onSubmit({ name, email, phone }: z.infer<typeof UserFormValidation>) {
    setisLoading(true);

    try {
      const userData = {
        name,
        email,
        phone,
      }

      const user = await createUser(userData);
      
      if(user) router.push(`/patients/${user.$id}/register`)

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="text-xl font-semibold">Hi there 👋🏻</h1>
          <p className="text-dark-700">Schedule your first appointment.</p>
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

        <SubmitButton isLoading={isLoading}>
          Get Started
        </SubmitButton>
      </form>
    </Form>
  );
};

export default PatientForm;
