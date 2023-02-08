import { zonedTimeToUtc } from "date-fns-tz";
import { useEffect, useReducer, useRef, useState } from "react";
import { AppButton } from "@/components/app-button";
import {
  FormInput,
  FormInputError,
  FormLabel,
  FormTextarea,
} from "@/components/app-forms";
import { getLayout } from "@/components/shells/app-layout";
import { trpc } from "@/utils/trpc";
import Head from "next/head";
import type { FormEvent, FocusEvent, ChangeEvent, Dispatch } from "react";
import { useRouter } from "next/router";
import * as Papa from "papaparse";
import { nanoid } from "nanoid";
import type { entryShapes, Json } from "@/utils/zod-shapes";
import type { z } from "zod";
// import { DatePicker, Provider, defaultTheme } from "@adobe/react-spectrum";

function myTz() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

const ContentBlock = ({
  rowId,
  setFormState,
}: {
  rowId: string;
  setFormState: SetRowState;
}) => {
  const [raw, setRaw] = useState({});
  const inputFile = useRef<HTMLInputElement | null>(null);
  const parseCsv = () => {
    if (inputFile.current) {
      inputFile.current.click();
    }
  };
  const updateRaw = (text: string) => {
    const data = Papa.parse(text, { header: true });
    setRaw(data);

    const json = data.data as Json;
    setFormState(rowId, {
      data: json,
    });
  };
  const parseChunk = (event: FocusEvent<HTMLTextAreaElement>) => {
    if (event.currentTarget.value) {
      updateRaw(event.currentTarget.value);
    }
  };
  const onChangeFile = async (event: FormEvent<HTMLInputElement>) => {
    // event.stopPropagation();
    // event.preventDefault();
    if (event.currentTarget.files?.length) {
      console.log(event.currentTarget.files[0]);
      const file = event.currentTarget.files[0];

      if (file) {
        const csvAsText = await file.text();
        updateRaw(csvAsText);
      }
    }
  };
  return (
    <>
      <div className="mt-4 w-full">
        <div className="flex items-center justify-between">
          <FormLabel htmlFor="identifier">Content</FormLabel>
          <div>
            <input
              id="file-upload"
              ref={inputFile}
              onChange={onChangeFile}
              name="file-upload"
              type="file"
              className="sr-only"
            />
            <AppButton
              intent="white"
              type="button"
              size="small"
              onClick={parseCsv}
            >
              Upload csv
            </AppButton>
          </div>
        </div>
        <FormTextarea
          id="identifier"
          type="text"
          name="identifier"
          onBlur={parseChunk}
          className="mt-3 block h-64 w-full text-xs"
          required
        />
      </div>
      <div className="mt-4">
        <pre className="max-h-64  overflow-x-scroll overflow-y-scroll rounded-lg bg-gray-50 p-2 text-xs shadow-inner">
          {JSON.stringify(raw, null, 2)}
        </pre>
      </div>
    </>
  );
};
const EntryKey = ({
  rowId,
  removeKey,
  setFormState,
}: {
  rowId: string;
  removeKey: () => void;
  setFormState: SetRowState;
}) => {
  return (
    <li className="p-1" data-draggable="true">
      <div className="flex justify-start">
        <div className="flex flex-shrink-0 flex-col space-y-3">
          <span className="inline-flex rounded-full shadow-sm">
            <button
              className="handle inline-flex items-center rounded-full border border-gray-300 bg-white p-1.5 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              type="button"
            >
              <span className="flex justify-center opacity-100 transition duration-200 ease-in">
                <div className="inline-flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </span>
              {/**/}
            </button>
            {/**/}
          </span>
          <span className="inline-flex rounded-full shadow-sm">
            <button
              className="inline-flex items-center rounded-full border border-transparent bg-white p-1.5 text-red-600 shadow-sm hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={() => removeKey()}
              type="button"
            >
              <span className="flex justify-center opacity-100 transition duration-200 ease-in">
                <div className="inline-flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </span>
              {/**/}
            </button>
            {/**/}
          </span>
        </div>
        <div className="ml-3 flex-1">
          <div className="flex justify-between">
            <div className="w-full max-w-xs">
              <div className="w-full">
                <FormLabel htmlFor="key">Key</FormLabel>
                <FormInput
                  id="key"
                  autoFocus
                  type="text"
                  name="key"
                  onChange={(e) => {
                    setFormState(rowId, { key: e.currentTarget.value.trim() });
                  }}
                  className="mt-1 block w-full"
                  required
                />
              </div>
            </div>
          </div>
          <div className="mt-2 border-l border-gray-200 p-4">
            <div className="mt-1">
              <ContentBlock rowId={rowId} setFormState={setFormState} />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

type KeyType = {
  id: string;
};

type EntryForm = z.infer<typeof entryShapes.create>;
// type SetFormState = Dispatch<Partial<EntryForm>>;
type SetRowState = (
  rowId: string,
  data: Partial<{
    key: string;
    data: Json;
  }>
) => void;

const FormSection = () => {
  const router = useRouter();
  const [formState, setFormState] = useReducer(
    (state: EntryForm, partialState: Partial<EntryForm>) => {
      const nextState = {
        ...state,
        ...partialState,
      };
      return nextState;
    },
    {
      entry_at: "",
      diffable_id: "",
      content: [],
    }
  );

  const { isLoading, mutate, error } = trpc.entries.create.useMutation();

  const [keys, setKeys] = useState<KeyType[]>([]);
  const removeKey = (key: KeyType) => {
    const elementPos = keys.map((x) => x.id).indexOf(key.id);
    // const elementPos = keys.findIndex(x=> x.id === key.id);

    const filteredSet = keys.filter((row) => row.id !== key.id);
    const filteredContent = formState.content.filter(
      (row, index) => index !== elementPos
    );
    setFormState({
      content: filteredContent,
    });
    setKeys(filteredSet);
  };

  const addNewKey = () => {
    setKeys((prev) => [...prev, { id: nanoid() }]);
    setFormState({
      content: [...formState.content, { key: "", data: {} }],
    });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate(formState, {
      onSuccess: () => {
        router.push("/dashboard/diffables");
      },
    });
  };
  const onChangeEntryAt = (e: ChangeEvent<HTMLInputElement>) => {
    const entry_at = zonedTimeToUtc(
      e.currentTarget.value,
      myTz()
    ).toISOString();
    setFormState({
      entry_at,
    });
  };

  const setRowState: SetRowState = (rowId, data) => {
    const elementPos = keys.findIndex((x) => x.id === rowId);
    const content = formState.content.map((lilData, index) => {
      if (elementPos !== index) {
        return lilData;
      }
      return { ...lilData, ...data };
    });
    setFormState({
      content,
    });
  };

  useEffect(() => {
    setFormState({
      diffable_id: String(router.query.id),
    });
  }, [router.query.id]);
  useEffect(() => {
    console.log(formState);
  }, [formState.entry_at]);
  return (
    <form onSubmit={onSubmit}>
      <div className="w-full bg-white shadow sm:overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2
            id="additional-info-title"
            className="text-lg font-medium leading-6 text-gray-900"
          >
            Entry
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            manually add a checkpoint to track information about the diffable
            entity
          </p>
        </div>
        <div className="border-t border-gray-200 px-3 py-4 sm:px-5">
          <div className="max-w-md">
            <FormLabel htmlFor="label">Time stamp</FormLabel>
            <div className="flex gap-4">
              <FormInput
                id="label"
                autoFocus
                type="datetime-local"
                name="label"
                onChange={onChangeEntryAt}
                className="mt-1 block w-full"
                required
              />
            </div>
            <FormInputError
              messages={error?.data?.zodError?.fieldErrors["entry_at"] || []}
              className="mt-2"
            />
          </div>
          {/* <ContentBlock /> */}
          <ul className="mt-4 space-y-4">
            {!!keys.length || (
              <li>
                <div className="bg-white py-6 px-4 text-center">
                  <h2 className="mb-2 font-semibold text-gray-900">
                    Add a trackable criteria
                  </h2>
                </div>
              </li>
            )}
            {!!keys.length &&
              keys.map((row) => (
                <EntryKey
                  key={row.id}
                  removeKey={() => removeKey(row)}
                  rowId={row.id}
                  setFormState={setRowState}
                />
              ))}
          </ul>
          <div className="">
            <div className="flex justify-end space-x-3">
              <div>
                <AppButton
                  intent="white"
                  size="small"
                  type="button"
                  onClick={addNewKey}
                >
                  Add key
                </AppButton>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end border-t border-gray-200 bg-slate-50 px-4 py-5 sm:px-6">
          <div>
            <AppButton disabled={isLoading} type="submit">
              Create
            </AppButton>
          </div>
        </div>
      </div>
      {/* <div className="shadow sm:overflow-hidden sm:rounded-md">
        <div className=" bg-white py-6 px-4 sm:p-6">
          <div className="col-span-2"></div>
        </div>
        <div className="flex justify-end border-t  bg-slate-50 px-4 py-3 text-right sm:px-6">
          <div className="">
            <AppButton disabled={isLoading} type="submit">
              Create
            </AppButton>
          </div>
        </div>
      </div> */}
    </form>
  );
};

const Dashboard = () => {
  return (
    <>
      <Head>
        <title>Laravel - Dashboard</title>
      </Head>

      <div className="py-12">
        <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">
          {/* <Provider theme={defaultTheme}> */}
          <FormSection />
          {/* </Provider> */}
        </div>
      </div>
    </>
  );
};

Dashboard.getLayout = getLayout;

export default Dashboard;
