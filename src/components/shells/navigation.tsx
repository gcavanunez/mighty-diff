import type {
  Dispatch,
  HTMLAttributes,
  PropsWithChildren,
  SetStateAction,
} from "react";
import React, { forwardRef } from "react";
import { useState } from "react";
import classNames from "clsx";
import { useRouter } from "next/router";

import type { LinkProps } from "next/link";
import Link from "next/link";
import { useAuth } from "@/utils/auth";
import { ConfirmationDialog } from "../app-confirm-dialog";
import { AppButton } from "../app-button";

import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import type { User } from "@prisma/client";

const LogoutAction = ({
  confirmAction,
  children,
}: {
  children: ({}: {
    setOpen: Dispatch<SetStateAction<boolean>>;
    open: boolean;
  }) => React.ReactNode;
  confirmAction: () => Promise<void>;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <>{children({ setOpen, open })}</>
      <ConfirmationDialog
        footer={
          <div className="flex space-x-3">
            <div>
              <AppButton
                type="button"
                intent="white"
                onClick={() => setOpen(false)}
              >
                Cancel
              </AppButton>
            </div>
            <div>
              <AppButton type="button" intent="danger" onClick={confirmAction}>
                Logout
              </AppButton>
            </div>
          </div>
        }
        open={open}
        setOpen={setOpen}
        title={"Are you sure?"}
      >
        Please confirm if you want to logout.
      </ConfirmationDialog>
    </>
  );
};

const UserDropdown = ({
  user,
  logout,
}: {
  user: User;
  logout: () => Promise<void>;
}) => {
  return (
    <LogoutAction confirmAction={logout}>
      {({ setOpen }) => {
        return (
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none focus:ring">
                {user.name}
                <ChevronDownIcon
                  className="ml-2 -mr-0.5 h-4 w-4"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                unmount={false}
              >
                <div className=" py-1">
                  <div className="block px-4 py-2 text-xs text-gray-400">
                    Manage Account
                  </div>
                  <Menu.Item>
                    {({ active }) => (
                      <JetDropdownLink
                        href="/dashboard/profile"
                        active={active}
                      >
                        Settings
                      </JetDropdownLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setOpen(true)}
                        className={classNames(
                          "block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 transition duration-150  ease-in-out focus:outline-none",
                          active
                            ? "bg-gray-100"
                            : "hover:bg-gray-100 focus:bg-gray-100"
                        )}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        );
      }}
    </LogoutAction>
  );
  // </div>
};

interface Props extends LinkProps {
  className?: Pick<HTMLAttributes<HTMLAnchorElement>, "className">;
}

const JetDropdownLink = forwardRef<
  React.ElementRef<typeof Link>,
  PropsWithChildren<Props>
>(function JetDropdownLinkFunc({ className, children, ...props }, ref) {
  return (
    <Link
      ref={ref}
      {...props}
      className={classNames(
        "block px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out  focus:outline-none",
        className,
        props.active ? "bg-gray-100" : "hover:bg-gray-100 focus:bg-gray-100"
      )}
    >
      {children}
    </Link>
  );
});

const jetActiveClass =
  "inline-flex items-center px-1 pt-1 border-b-2 border-indigo-400 text-sm font-medium leading-5 text-gray-900 focus:outline-none focus:border-indigo-700 transition duration-150 ease-in-out";
const jetAnactiveClass =
  "inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out";

interface Props extends LinkProps {
  active?: boolean;
  className?: Pick<HTMLAttributes<HTMLAnchorElement>, "className">;
}

const JetNavigationLink = ({
  children,
  active,
  className,
  ...props
}: PropsWithChildren<Props>) => {
  return (
    <Link
      {...props}
      className={classNames(
        active ? jetActiveClass : jetAnactiveClass,
        className
      )}
    >
      {children}
    </Link>
  );
};

const activeClass =
  "block pl-3 pr-4 py-2 border-l-4 border-indigo-400 text-base font-medium text-indigo-700 bg-indigo-50 focus:outline-none focus:text-indigo-800 focus:bg-indigo-100 focus:border-indigo-700 transition duration-150 ease-in-out";
const inactiveClass =
  "block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out";

interface Props extends LinkProps {
  active?: boolean;
  className?: Pick<HTMLAttributes<HTMLAnchorElement>, "className">;
}

const JetResponsiveNavigationLink = ({
  children,
  className,
  active,
  ...props
}: PropsWithChildren<Props>) => {
  return (
    <Link
      {...props}
      className={classNames(active ? activeClass : inactiveClass, className)}
    >
      {children}
    </Link>
  );
};

export default function JetNavigation() {
  const { user, logout } = useAuth({ middleware: "auth" });

  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link
                className="text-primary rounded"
                aria-label="Go to dashboard"
                href="/"
              >
                <img
                  src={"/static/next.svg"}
                  className="h-8 w-full"
                  alt="Next logo"
                />
              </Link>
            </div>

            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
              <JetNavigationLink
                href={"/dashboard"}
                active={router.pathname === "/dashboard"}
              >
                Dashboard
              </JetNavigationLink>
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="relative ml-3 flex space-x-3">
              {user?.user && <UserDropdown user={user?.user} logout={logout} />}
            </div>
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  className={classNames({
                    hidden: mobileOpen,
                    "inline-flex": !mobileOpen,
                  })}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  className={classNames({
                    hidden: !mobileOpen,
                    "inline-flex": mobileOpen,
                  })}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className={classNames("sm:hidden", {
          block: mobileOpen,
          hidden: !mobileOpen,
        })}
      >
        <div className="space-y-1 pt-2 pb-3">
          {/* "request()->routeIs('dashboard')" */}
          <JetResponsiveNavigationLink
            href={"/"}
            active={router.pathname === "/"}
          >
            Dashboard
          </JetResponsiveNavigationLink>
        </div>

        <div className="border-t border-gray-200 pt-4 pb-1">
          <div className="flex items-center px-4">
            {/* {hasProfilePhotoFeatures && user.profile_photo_url && (
              <div className="mr-3 flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={user.profile_photo_url}
                  alt={user.name}
                />
              </div>
            )} */}

            <div>
              <div className="text-base font-medium text-gray-800">
                {user?.user.name}
              </div>
              <div className="text-sm font-medium text-gray-500">
                {user?.user.email}
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            {/* "request()->routeIs('profile.show')" */}
            <JetResponsiveNavigationLink href="/settings" active={false}>
              Settings
            </JetResponsiveNavigationLink>

            <button
              onClick={logout}
              className={
                "block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 transition duration-150 ease-in-out hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 focus:border-gray-300 focus:bg-gray-50 focus:text-gray-800 focus:outline-none"
              }
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
