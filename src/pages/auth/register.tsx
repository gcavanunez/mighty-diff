import Head from "next/head";
import Link from "next/link";
import type { FormEvent } from "react";
import { getLayout } from "@/components/shells/auth-layout";
import { CommonCard } from "@/components/app-cards";
import { FormInput, FormInputError, FormLabel } from "@/components/app-forms";
import { AppButton } from "@/components/app-button";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
const Page = () => {
  const router = useRouter();
  const { isLoading, mutate, error } = trpc.auth.register.useMutation();
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const { email, password, password_confirm, name } = Object.fromEntries(
      data.entries()
    );
    if (email && password && password_confirm && name) {
      mutate(
        {
          email: String(email),
          password: String(password),
          password_confirm: String(password_confirm),
          name: String(name),
        },
        {
          onSuccess: () => {
            router.push("/auth/login");
          },
        }
      );
    }
  };
  return (
    <>
      <Head>
        <title>Create T3 App - Register</title>
      </Head>
      <CommonCard>
        <form onSubmit={onSubmit}>
          <div>
            <FormLabel htmlFor="name">Name</FormLabel>
            <FormInput
              id="name"
              autoFocus
              type="text"
              name="name"
              className="mt-1 block w-full"
              required
            />
          </div>
          <div className="mt-4">
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormInput
              id="email"
              type="email"
              name="email"
              className="mt-1 block w-full"
              required
            />
            <FormInputError
              messages={error?.data?.zodError?.fieldErrors["email"] || []}
              className="mt-2"
            />
          </div>

          <div className="mt-4">
            <FormLabel htmlFor="password"> Password</FormLabel>

            <FormInput
              id="password"
              type="password"
              name="password"
              className="mt-1 block w-full"
              required
            />
            <FormInputError
              messages={error?.data?.zodError?.fieldErrors["password"] || []}
              className="mt-2"
            />
          </div>
          <div className="mt-4">
            <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
            <FormInput
              id="confirm-password"
              type="password"
              name="password_confirm"
              className="mt-1 block w-full"
              required
            />
            <FormInputError
              messages={
                error?.data?.zodError?.fieldErrors["password_confirm"] || []
              }
              className="mt-2"
            />
          </div>

          <div className="mt-8 flex items-center justify-end">
            <AppButton disabled={isLoading} type="submit">
              Register
            </AppButton>
          </div>
          <div className="mt-4 text-center">
            <Link
              className="text-sm text-gray-500 hover:text-gray-900"
              href="/auth/login"
            >
              Already have an account? Sign In
            </Link>
          </div>
        </form>
      </CommonCard>
    </>
  );
};
Page.getLayout = getLayout;
export default Page;
