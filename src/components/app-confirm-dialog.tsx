import type { PropsWithChildren, ReactNode } from "react";
import type { ModalProps } from "./app-modal";
import { AppDialog } from "./app-modal";

interface Props extends ModalProps {
  title: string;
  footer?: ReactNode;
  // renderFooter(): JSX.Element;
}

export const ConfirmationDialog = ({
  title,
  children,
  footer,
  ...modalProps
}: PropsWithChildren<Props>) => {
  return (
    <AppDialog maxWidth={"sm"} {...modalProps}>
      <div className="mb-6 transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg
                className="h-6 w-6 text-red-600"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg">{title}</h3>

              <div className="mt-2">{children}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-end bg-gray-100 px-6 py-4 text-right">
          {footer}
          {/* <button
            type="button"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition hover:text-gray-500 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200 active:bg-gray-50 active:text-gray-800 disabled:opacity-25"
          >
            {" "}
            Cancel{" "}
          </button>
          <button
            type="button"
            className="ml-3 inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-500 focus:border-red-700 focus:outline-none focus:ring focus:ring-red-200 active:bg-red-600 disabled:opacity-25"
          >
            {" "}
            Delete Team{" "}
          </button> */}
        </div>
      </div>
      {/* <div className="bg-gray-100 px-6 py-4 text-right">{renderFooter()}</div> */}
    </AppDialog>
  );
};
