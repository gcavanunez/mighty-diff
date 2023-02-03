import Link from "next/link";
import { getLayout as getSiteLayout } from "./app-layout";
import { useRouter } from "next/router";
import type { PropsWithChildren } from "react";
import React from "react";
import { Cog8ToothIcon, LockClosedIcon } from "@heroicons/react/24/outline";

const ActiveLink = ({
  children,
  href,
  className,
}: {
  children: ({}: { isActive: boolean; iconClasses: string }) => React.ReactNode;
  href: string;
  className?: string;
}) => {
  const router = useRouter();
  const isActive = router.pathname === href;
  const iconClasses = isActive
    ? "-ml-1 mr-3 h-6 w-6 flex-shrink-0 text-indigo-500 "
    : "-ml-1 mr-3 h-6 w-6 flex-shrink-0 text-slate-400 group-hover:text-gray-500";
  return (
    <Link
      href={href}
      scroll={false}
      className={`${
        isActive
          ? "bg-white text-indigo-600 shadow-sm hover:bg-white"
          : "text-slate-900 hover:bg-slate-50 hover:text-slate-900"
      } ${className} group flex items-center rounded-md  px-3 py-2 text-sm font-medium `}
    >
      {children({ isActive, iconClasses })}
    </Link>
  );
};

const AccountSettingsLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="mx-auto w-full flex-1  px-3 py-4 sm:py-10  sm:px-6 lg:px-8">
      <div className="mx-auto h-full max-w-7xl px-4 sm:px-6 lg:pr-8">
        <div className="flex h-full flex-col lg:flex-row lg:space-x-5">
          <div className="w-full shrink-0 lg:w-1/5">
            <div className="-mt-1 hidden flex-col space-y-1 pr-2 lg:flex">
              <ActiveLink href="/dashboard/profile">
                {({ iconClasses }) => (
                  <>
                    <Cog8ToothIcon className={iconClasses} />
                    <span>Profile</span>
                  </>
                )}
              </ActiveLink>
              <ActiveLink href="/dashboard/profile-password">
                {({ iconClasses }) => (
                  <>
                    <LockClosedIcon className={iconClasses} />
                    <span>Password</span>
                  </>
                )}
              </ActiveLink>
            </div>
            <select
              aria-label="Navigation items"
              name="side_nav"
              className=" mb-4 rounded-md border-gray-300  font-semibold shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 lg:hidden"
            >
              <option value="/dashboard/profile">Profile</option>
              <option value="/dashboard/profile-password">Password</option>
            </select>
          </div>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

export const getLayout = (page: React.ReactNode, header?: React.ReactNode) =>
  getSiteLayout(<AccountSettingsLayout>{page}</AccountSettingsLayout>, header);

export default AccountSettingsLayout;
