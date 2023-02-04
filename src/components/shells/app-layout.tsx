// import { useAuth } from "@/utils/auth";
import type { PropsWithChildren } from "react";
import JetNavigation from "./navigation";

const AppLayout: React.FC<
  PropsWithChildren & { header?: React.ReactNode | undefined }
> = ({ header, children }) => {
  // const { user, logout } = useAuth({ middleware: "auth" });

  return (
    <div className="flex  h-full flex-col bg-slate-100">
      {/* <Navigation user={user} /> */}
      {/* Page Heading */}
      {/* <div className="text-primary relative z-40 border-b bg-white px-3 sm:px-6 lg:px-8">
        <header className="relative mx-auto max-w-7xl  px-4 sm:px-6 lg:px-8">
          <div className="flex items-center pt-3 pb-2 md:pt-4 md:pb-3">
            <div className="mr-1 flex shrink-0 items-center">
              <Link
                className="text-primary rounded"
                aria-label="Go to dashboard"
                href="/"
              >
                <img src={"/static/next.svg"} className="h-10 w-full" />
              </Link>
            </div>
            <div className="flex flex-grow items-center">
            
            </div>
            <div className="flex flex-none items-center">
              <details className="Menu_menu__Acgsz">
                <summary
                  className="focus-ring inline-flex cursor-pointer rounded rounded-full"
                  aria-haspopup="true"
                >
                  <div
                    title="Guillermo Antony Cava Nuñez"
                    className="relative inline-flex flex-shrink-0 rounded-full align-top"
                  >
                    <div className="grid">
                      <div className="col-start-1 col-end-1 row-start-1 row-end-1 flex">
                        <img
                          src="/api/avatar?name=Guillermo%20Antony%20Cava%20Nu%C3%B1ez"
                          alt="Guillermo Antony Cava Nuñez"
                          width="32"
                          height="32"
                        />
                      </div>
                      <div className="relative col-start-1 col-end-1 row-start-1 row-end-1 flex items-center justify-center">
                        <img src="/letters/g.svg" className="h-2 w-2" alt="" />
                      </div>
                    </div>
                  </div>
                </summary>
                <div className="bg-primary ring-gray-400/15 absolute right-0 z-40 mt-1 w-60 origin-top-right rounded-md shadow-lg ring-1 dark:shadow-black dark:ring-gray-400/20">
                  <ul className="py-1">
                    <li>
                      <a
                        className="text-primary hover:bg-secondary block px-3 py-1"
                        href="/settings/account"
                      >
                        Settings
                      </a>
                    </li>
                    <li>
                      <div>
                        <button
                          type="button"
                          className="focus-ring text-primary hover:bg-secondary block w-full rounded-none px-3 py-1 text-left"
                        >
                          Create new organization
                        </button>
                      </div>
                    </li>
                    <li>
                      <a
                        href="https://planetscale.com/docs"
                        className="text-primary hover:bg-secondary block px-3 py-1"
                      >
                        Documentation
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://planetscale.com/support"
                        className="text-primary hover:bg-secondary block px-3 py-1"
                      >
                        Support
                      </a>
                    </li>
                    <li>
                      <div className="text-base font-normal">
                        <div>
                          <button
                            type="button"
                            className="focus-ring text-primary hover:bg-secondary block w-full rounded-none px-3 py-1 text-left"
                          >
                            Send feedback
                          </button>
                        </div>
                      </div>
                    </li>
                    <li>
                      <hr className="my-sm" />
                    </li>
                    <li>
                      <form
                        action="https://api.planetscale.com/internal/sessions"
                        method="post"
                      >
                        <button
                          type="submit"
                          className="focus-ring text-primary hover:bg-secondary block w-full rounded-none px-3 py-1 text-left"
                        >
                          Sign out
                        </button>
                      </form>
                    </li>
                  </ul>
                  <div className="bg-secondary rounded-b border-t py-1.5 px-3">
                    <div className="focus-within-ring border-secondary text-primary flex h-4 items-stretch rounded border shadow-sm">
                      <label className="border-secondary bg-secondary mb-0 flex select-none items-center space-x-1 whitespace-nowrap rounded-l rounded-r-none border-r px-1.5 font-medium">
                        <span>Theme</span>
                      </label>
                      <select className="focus-ring border-secondary bg-primary block inline-block h-4 h-auto w-full rounded border border-t-0 border-l-0 border-b-0 border-r-0 py-0 pl-1.5 pr-4 pl-2 shadow-sm !shadow-none !ring-0">
                        <option value="system">System</option>
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                      </select>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </header>
      </div> */}
      <JetNavigation />
      {header && (
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
            {header}
          </div>
        </header>
      )}
      {/* Page Content */}
      <main className="flex flex-1 flex-col bg-slate-100">{children}</main>
    </div>
  );
};

export const getLayout = (page: React.ReactNode, header?: React.ReactNode) => (
  <AppLayout header={header}>{page}</AppLayout>
);

export default AppLayout;
