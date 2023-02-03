/* This example requires Tailwind CSS v2.0+ */
import type { FC, PropsWithChildren } from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
// import { CheckIcon } from "@heroicons/react/outline";
// import { XIcon } from "@heroicons/react/solid";
import { cx } from "class-variance-authority";
import { XMarkIcon } from "@heroicons/react/24/solid";

export type ModalProps = PropsWithChildren<{
  open: boolean;
  setOpen: (value: boolean) => void;
  afterEnter?: () => void;
  maxWidth?: "lg" | "sm";
}>;

export const AppDialog: FC<ModalProps> = ({
  children,
  open,
  setOpen,
  afterEnter,
  maxWidth,
}) => {
  // const [open, setOpen] = useState(true)

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={setOpen}
      >
        <div className=" flex  min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur backdrop-filter   transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            afterEnter={afterEnter}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            {/* <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle"> */}
            <div
              className={cx(
                "pointer-events-none relative inline-block w-full transform rounded-3xl p-6  text-left   align-middle transition-all",
                maxWidth
                  ? { lg: "sm:max-w-7xl", sm: "sm:max-w-3xl" }[maxWidth]
                  : ""
              )}
            >
              <div className="pointer-events-auto absolute top-0 right-0">
                <button
                  type="button"
                  className="rounded-full text-gray-50 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white "
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="pointer-events-auto relative w-full">
                {children}
              </div>
            </div>
            {/* <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Payment successful
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur amet
                      labore.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                  onClick={() => setOpen(false)}
                >
                  Go back to dashboard
                </button>
              </div> */}
            {/* </div> */}
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
