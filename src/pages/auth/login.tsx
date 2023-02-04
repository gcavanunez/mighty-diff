import { AppButton, AppLink } from "@/components/app-button";
import { CommonCard } from "@/components/app-cards";
import { FormInput, FormInputError, FormLabel } from "@/components/app-forms";
import { getLayout } from "@/components/shells/auth-layout";
import { trpc } from "@/utils/trpc";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type { FormEvent } from "react";

const Page = () => {
  const { isLoading, mutate, error } = trpc.auth.login.useMutation();
  const router = useRouter();
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const form = Object.fromEntries(data.entries());
    if (form.email && form.password) {
      const remember = form.remember === "on";
      mutate(
        {
          email: String(form.email),
          password: String(form.password),
          remember,
        },
        {
          onSuccess: ({ redirectPath }) => {
            console.log(redirectPath);
            router.push(redirectPath);
          },
        }
      );
    }
  };
  return (
    <>
      <Head>
        <title>Create T3 App - Login</title>
      </Head>
      <div className="absolute top-4 left-4 inline-flex">
        <AppLink href="/" size={"small"} intent="tertiary">
          <ChevronLeftIcon className="mr-1.5 h-4 w-4" strokeWidth={2} /> Back
        </AppLink>
      </div>
      <CommonCard>
        <form onSubmit={onSubmit}>
          <div>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormInput
              id="email"
              type="email"
              name="email"
              className="mt-1 block w-full"
              required
              autoFocus
            />
            <FormInputError
              messages={error?.data?.zodError?.fieldErrors["email"] || []}
              className="mt-2"
            />
          </div>

          <div className="mt-4">
            <FormLabel htmlFor="password">Password</FormLabel>
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
          {/* Remember Me */}
          <div className="mt-4  flex items-center justify-between">
            <label htmlFor="remember_me" className="inline-flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                name="remember"
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />

              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Link
              className="text-sm text-gray-500 hover:text-gray-900"
              href="/auth/forget-password"
            >
              Forgot password?
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-end">
            <AppButton type="submit" disabled={isLoading}>
              Login
            </AppButton>
          </div>
          <div className="mt-4 text-center">
            <Link
              className="text-sm text-gray-500 hover:text-gray-900"
              href="/auth/register"
            >
              Don't have an account yet? Create one here
            </Link>
          </div>
        </form>
      </CommonCard>
    </>
  );
};
Page.getLayout = getLayout;
export default Page;
