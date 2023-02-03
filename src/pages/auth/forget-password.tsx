import { trpc } from "@/utils/trpc";
import Head from "next/head";
import type { FormEvent } from "react";
import { getLayout } from "@/components/shells/auth-layout";
import { CommonCard } from "@/components/app-cards";
import { FormInput, FormLabel } from "@/components/app-forms";
import { AppButton } from "@/components/app-button";
import Link from "next/link";

const Page = () => {
  const { isLoading, mutate, data } = trpc.auth.passwordEmail.useMutation();
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const form = Object.fromEntries(data.entries());
    if (form.email) {
      const currentTargetRef = event.currentTarget;
      mutate(
        { email: String(form.email) },
        {
          onSuccess() {
            currentTargetRef.reset();
          },
        }
      );
    }
  };
  return (
    <>
      <Head>
        <title>Create T3 App - Forget Password</title>
      </Head>
      <CommonCard>
        <div className="mb-4 text-sm text-gray-600">
          If you can't remember your password, please provide your email address
          and we will send you a link which you may use to change your password.
        </div>
        {data?.message && (
          <div className="mb-4 text-sm font-medium text-green-600">
            {data?.message}
          </div>
        )}
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
          </div>

          <div className="mt-4 flex items-center justify-end">
            <AppButton disabled={isLoading}>
              Email Password Reset Link
            </AppButton>
          </div>
          <div className="mt-4 text-center">
            <Link
              className="text-sm text-gray-500 hover:text-gray-900"
              href="/auth/login"
            >
              Back to login
            </Link>
          </div>
        </form>
      </CommonCard>
    </>
  );
};

Page.getLayout = getLayout;
export default Page;
