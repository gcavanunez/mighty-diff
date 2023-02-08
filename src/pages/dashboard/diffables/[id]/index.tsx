import { AppLink } from "@/components/app-button";
import { getLayout } from "@/components/shells/app-layout";
import { trpc } from "@/utils/trpc";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import diff from "microdiff";
import type { DiffableEntry } from "@prisma/client";
import type { Json } from "@/utils/zod-shapes";
import clsx from "clsx";
type Unarray<T> = T extends Array<infer U> ? U : T;
type GroupedDiffEntry = {
  diff: Record<string, ReturnType<typeof diff>>;
  currentContent: LilJson[];
  current: DiffableEntry;
  prev?: DiffableEntry;
};
type LilJson = {
  key: string;
  data: Json;
};
const tranformToReadable = (someString: string) => {
  if (someString.length === 18 && someString.includes("x")) {
    return new Date(parseInt(someString, 16)).toUTCString();
  }
  return someString;
};
function getDiff(currentContent: LilJson[], previousContent?: LilJson[]) {
  return currentContent.reduce((acc, curr) => {
    const { key } = curr;
    const prevValue = previousContent?.find((row) => row.key === key);
    acc[key] = diff(
      prevValue?.data ? (prevValue?.data as any) : [],
      curr.data as any
    );
    return acc;
  }, {} as Record<string, ReturnType<typeof diff>>);
}

const RenderDiff = ({
  diffable_entries,
}: {
  diffable_entries: DiffableEntry[];
}) => {
  const prevAndNext = diffable_entries.reduce((acc, curr, index) => {
    let prev: LilJson[] | undefined = undefined;
    let literalLast: DiffableEntry | undefined = undefined;

    if (diffable_entries[index - 1]) {
      prev = diffable_entries[index - 1]?.content as LilJson[];
      literalLast = diffable_entries[index - 1];
    }
    const content = curr.content as LilJson[];
    const findDiffBetweenKeys = getDiff(content, prev);
    console.log("currentContent", curr.content);
    console.log(findDiffBetweenKeys);
    const currentIteration = {
      currentContent: curr.content as LilJson[],
      diff: findDiffBetweenKeys,
      current: curr,
      prev: literalLast,
    };
    acc.push(currentIteration);
    return acc;
  }, [] as GroupedDiffEntry[]);
  // return {}

  return (
    <ul role="list" className=" space-y-8">
      {prevAndNext.map((diffRow, index) => {
        return (
          <li key={index} className="rounded-sm bg-slate-50 shadow-sm ">
            {diffRow.current.id} -{" "}
            {new Date(diffRow.current.created_at).toUTCString()}
            <div>
              {diffRow.currentContent.map((row, index) => {
                const jsondata = row.data as Record<string, string>[];
                const keyDiffs = diffRow.diff[row.key];
                const diffLookUp = keyDiffs?.length
                  ? keyDiffs.reduce((diffAcc, currDiffOfKey) => {
                      const diffKey = currDiffOfKey.path.reduce(
                        (pathKey, currentPath) => pathKey + `${currentPath}`,
                        ""
                      );
                      diffAcc[diffKey] = currDiffOfKey;
                      return diffAcc;
                    }, {} as Record<string, Unarray<ReturnType<typeof diff>>>)
                  : {};
                return (
                  <div key={index} className="py-2">
                    <div className="underline">{row.key}</div>
                    {!!jsondata.length ? (
                      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                              <thead className="bg-gray-50">
                                <tr>
                                  {Object.keys(jsondata[0]!).map(
                                    (subKey, index) => {
                                      return (
                                        <th
                                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                          key={index}
                                        >
                                          {subKey}
                                        </th>
                                      );
                                    }
                                  )}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {jsondata.map((jsonPoint, jsonRowIndex) => {
                                  const lilDiff = diffLookUp[`${jsonRowIndex}`];
                                  if (lilDiff) {
                                    console.log(lilDiff);
                                  }
                                  return (
                                    <tr
                                      key={jsonRowIndex}
                                      className={clsx({
                                        "bg-green-100": lilDiff,
                                      })}
                                    >
                                      {Object.entries(jsonPoint).map(
                                        ([jsonPointKey, value], valueIndex) => {
                                          const lilDiff =
                                            diffLookUp[
                                              `${jsonRowIndex}${jsonPointKey}`
                                            ];
                                          return (
                                            <td
                                              className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                                              key={valueIndex}
                                            >
                                              {tranformToReadable(value)}
                                              {lilDiff && (
                                                <span className=" ml-3 rounded-full bg-yellow-100 px-3 py-1">
                                                  {lilDiff.type} -{" "}
                                                  {lilDiff.type == "CHANGE" && (
                                                    <span>
                                                      {lilDiff.oldValue} --{" "}
                                                      {lilDiff.value}
                                                    </span>
                                                  )}
                                                </span>
                                              )}
                                            </td>
                                          );
                                        }
                                      )}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="italic">No info</div>
                    )}
                    {/* <table>
                
                </table> */}
                  </div>
                );
              })}
            </div>
          </li>
        );
      })}
      {/* <li>
        {
          <>
            <p>{data?.diffable.diffable_entries[0]?.content[2].key}</p>
            <pre className="overflow-x-scroll overflow-y-scroll rounded-lg bg-gray-50 p-2 text-xs shadow-inner">
              {JSON.stringify(
                diff(
                  data?.diffable.diffable_entries[0]?.content[2].data,
                  data?.diffable.diffable_entries[1]?.content[2].data
                ),
                null,
                2
              )}
            </pre>
          </>
        }
      </li> */}
    </ul>
  );
};
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
  // const tuples = data?.diffable.diffable_entries.reduce((acc,curr)=>{

  // },[])

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
                {!!data && (
                  <RenderDiff
                    key={"sup"}
                    diffable_entries={data.diffable.diffable_entries}
                  />
                )}
                {/* <ul role="list" className="-mb-8">
                  <li>
                    {data && (
                      <>
                        <p>
                          {data?.diffable.diffable_entries[0]?.content[0].key}
                        </p>
                        <pre className="overflow-x-scroll overflow-y-scroll rounded-lg bg-gray-50 p-2 text-xs shadow-inner">
                          {JSON.stringify(
                            diff(
                              data?.diffable.diffable_entries[0]?.content[0]
                                .data,
                              data?.diffable.diffable_entries[1]?.content[0]
                                .data
                            ),
                            null,
                            2
                          )}
                        </pre>
                      </>
                    )}
                  </li>
                </ul> */}
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
