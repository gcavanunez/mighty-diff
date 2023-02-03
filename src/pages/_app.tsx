import { type AppType } from "next/app";
import type { AppProps } from "next/app";

import { trpc } from "../utils/trpc";
import "../styles/globals.css";
import React from "react";
import { type NextComponentType } from "next";
import GuestLayout from "@/components/shells/guest-layout";

type CustomAppProps = AppProps & {
  Component: NextComponentType & {
    getLayout?: (page: React.ReactNode) => JSX.Element;
  };
};
// Persistent Layout Patterns in Next.js – Adam Wathan
// https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/
const MyApp: AppType = ({ Component, pageProps }: CustomAppProps) => {
  // return <Component {...pageProps} />;

  const getLayout =
    Component.getLayout ||
    ((page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>);

  return getLayout(<Component {...pageProps} />);
};

export default trpc.withTRPC(MyApp);
