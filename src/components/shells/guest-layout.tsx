import Head from "next/head";
import type { PropsWithChildren } from "react";

const GuestLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <Head>
        <title>Laravel</title>
      </Head>
      <div className="font-sans text-gray-900 antialiased">{children}</div>
    </div>
  );
};

export const getLayout = (page: React.ReactNode) => (
  <GuestLayout>{page}</GuestLayout>
);

export default GuestLayout;
