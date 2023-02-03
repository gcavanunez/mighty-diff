import { getLayout } from "@/components/shells/auth-layout";
import { AppButton } from "@/components/app-button";
import { FormInput, FormInputError, FormLabel } from "@/components/app-forms";
import { CommonCard } from "@/components/app-cards";

import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const { isLoading, mutate, error } = trpc.auth.passwordReset.useMutation();
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const { email, password, password_confirm } = Object.fromEntries(
      data.entries()
    );
    if (email && password && password_confirm) {
      const token = String(router.query.token);
      mutate(
        {
          email: String(email),
          password: String(password),
          password_confirm: String(password_confirm),
          token,
        },
        {
          onSuccess: () => {
            router.push("/auth/login");
          },
        }
      );
    }
  };

  useEffect(() => {
    setEmail(String(router.query.email) || "");
  }, [router.query.email]);

  return (
    <CommonCard>
      <form onSubmit={onSubmit}>
        {/* Email Address */}
        <div>
          <FormLabel htmlFor="email">Email</FormLabel>
          <FormInput
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
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

        <div className="mt-4 flex">
          <AppButton disabled={isLoading}>Reset Password</AppButton>
        </div>
      </form>
    </CommonCard>
  );
};
Page.getLayout = getLayout;
export default Page;
