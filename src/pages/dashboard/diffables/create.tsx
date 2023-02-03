import { useState } from "react";
import { AppButton } from "@/components/app-button";
import { FormInput, FormInputError, FormLabel } from "@/components/app-forms";
import { getLayout } from "@/components/shells/app-layout";
import { trpc } from "@/utils/trpc";
import Head from "next/head";
import type { FormEvent } from "react";
import { useRouter } from "next/router";

const ProfileInformationSection = () => {
  const { isLoading, mutate, error } = trpc.diffables.create.useMutation();
  const router = useRouter();
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const form = Object.fromEntries(data.entries());
    if (form.label && form.identifier) {
      mutate(
        {
          label: String(form.label),
          identifier: String(form.identifier),
        },
        {
          onSuccess: () => {
            router.push("/dashboard/diffables");
          },
        }
      );
    }
  };
  return (
    <form onSubmit={onSubmit}>
      <div className="shadow sm:overflow-hidden sm:rounded-md">
        <div className="grid grid-cols-3 gap-x-12 bg-white py-6 px-4 sm:p-6">
          <div>
            <h1 className="text-lg font-medium text-gray-900">
              Profile Information
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Update your account's profile information and email address.
            </p>
          </div>
          <div className="col-span-2">
            <div className="max-w-md">
              <FormLabel htmlFor="label">Label</FormLabel>
              <FormInput
                id="label"
                autoFocus
                type="text"
                name="label"
                className="mt-1 block w-full"
                required
              />
              <FormInputError
                messages={error?.data?.zodError?.fieldErrors["label"] || []}
                className="mt-2"
              />
            </div>
            <div className="mt-4 max-w-md">
              <FormLabel htmlFor="identifier">identifier</FormLabel>
              <FormInput
                id="identifier"
                type="text"
                name="identifier"
                className="mt-1 block w-full"
                required
              />
              <FormInputError
                messages={
                  error?.data?.zodError?.fieldErrors["identifier"] || []
                }
                className="mt-2"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end border-t  bg-slate-50 px-4 py-3 text-right sm:px-6">
          <div className="">
            <AppButton disabled={isLoading} type="submit">
              Create
            </AppButton>
          </div>
        </div>
      </div>
    </form>
  );
};

const Dashboard = () => {
  return (
    <>
      <Head>
        <title>Laravel - Dashboard</title>
      </Head>

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="w-full rounded-lg bg-white shadow-sm">
            <ProfileInformationSection />
          </div>
        </div>
      </div>
    </>
  );
};

Dashboard.getLayout = getLayout;

export default Dashboard;
