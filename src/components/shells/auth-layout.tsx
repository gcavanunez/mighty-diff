// import { useAuth } from "@/utils/auth";
import type { PropsWithChildren } from "react";
import GuestLayout from "./guest-layout";

const AuthLayout: React.FC<PropsWithChildren> = ({ children }) => {
  // useAuth({ middleware: "guest", redirectIfAuthenticated: "/dashboard" });
  return (
    <GuestLayout>
      <main className="flex min-h-screen items-center justify-center bg-slate-100 ">
        {children}
      </main>
    </GuestLayout>
  );
};

export const getLayout = (page: React.ReactNode) => (
  <AuthLayout>{page}</AuthLayout>
);

export default AuthLayout;
