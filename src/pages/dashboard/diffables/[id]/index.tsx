import { AppButton, AppLink } from "@/components/app-button";
import { getLayout } from "@/components/shells/app-layout";
import { trpc } from "@/utils/trpc";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const router = useRouter();
  const { data } = trpc.diffables.show.useQuery(
    { id: String(router.query.id) },
    {
      enabled: router.isReady,
    }
  );
  useEffect(() => {
    console.log("id =>", router.query.id);
  }, [router.query.id]);

  return (
    <>
      <Head>
        <title>Laravel - Dashboard</title>
      </Head>

      <div className="py-12">
        <div className="mx-auto   max-w-3xl   space-y-6 sm:px-6  lg:max-w-7xl ">
          <div className="space-y-6 ">
            <section aria-labelledby="applicant-information-title">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="flex justify-between px-4 py-5 sm:px-6">
                  <div>
                    <h2
                      id="applicant-information-title"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Diffable
                    </h2>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Highlevel details about the trace being tracked
                    </p>
                  </div>
                  <div>
                    <AppLink
                      intent="white"
                      href={`/dashboard/diffables/${router.query.id}/edit`}
                    >
                      Edit
                    </AppLink>
                  </div>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Label
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {data?.diffable.label}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Identifier
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {data?.diffable.identifier}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </section>
          </div>
          <section
            aria-labelledby="timeline-title"
            className="lg:col-span-1 lg:col-start-3"
          >
            <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
              <div className="flex items-center justify-between">
                <h2
                  id="timeline-title"
                  className="text-lg font-medium text-gray-900"
                >
                  Timeline
                </h2>
                <div>
                  <AppLink
                    href={`/dashboard/diffables/${router.query.id}/entries/create`}
                  >
                    Add entry
                  </AppLink>
                </div>
              </div>
              <div className="mt-6 flow-root">
                <ul role="list" className="-mb-8">
                  <li>
                    <div className="relative pb-8"></div>
                  </li>
                </ul>
              </div>
              {/* <div className="justify-stretch mt-6 flex flex-col">
                <AppLink
                  href={`/dashboard/diffables/${router.query.id}/entries/create`}
                >
                  Add entry
                </AppLink>
              </div> */}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

Dashboard.getLayout = getLayout;

export default Dashboard;
