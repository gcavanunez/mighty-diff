import { AppButton } from "@/components/app-button";
import { FormInput, FormInputError, FormLabel } from "@/components/app-forms";
import { getLayout } from "@/components/shells/account-settings-layout";
import { useAuth } from "@/utils/auth";
import Head from "next/head";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { trpc } from "@/utils/trpc";
import { ConfirmationDialog } from "@/components/app-confirm-dialog";
import { useRouter } from "next/router";

const ProfileInformationSection = () => {
  const { user } = useAuth({ middleware: "auth" });
  const { isLoading, mutate, error } = trpc.profile.updateProfile.useMutation();
  const context = trpc.useContext();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  useEffect(() => {
    if (user) {
      setName(String(user?.user.name) || "");
      setEmail(String(user?.user.email) || "");
    }
  }, [user]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const form = Object.fromEntries(data.entries());
    if (form.email && form.name) {
      mutate(
        {
          email: String(form.email),
          name: String(form.name),
        },
        {
          onSuccess: (payload) => {
            if (payload) {
              context.auth.getUser.setData(undefined, () => {
                return payload;
              });
            }
          },
        }
      );
    }
  };
  return (
    <form onSubmit={onSubmit}>
      <div className="shadow sm:overflow-hidden sm:rounded-md">
        <div className="bg-white py-6 px-4 sm:p-6">
          <div>
            <h1 className="text-lg font-medium text-gray-900">
              Profile Information
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Update your account's profile information and email address.
            </p>
          </div>
          <div className="mt-6">
            <div className="max-w-md">
              <FormLabel htmlFor="name">Name</FormLabel>
              <FormInput
                id="name"
                autoFocus
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                className="mt-1 block w-full"
                required
              />
              <FormInputError
                messages={error?.data?.zodError?.fieldErrors["name"] || []}
                className="mt-2"
              />
            </div>
            <div className="mt-4 max-w-md">
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormInput
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                className="mt-1 block w-full"
                required
              />
              <FormInputError
                messages={error?.data?.zodError?.fieldErrors["email"] || []}
                className="mt-2"
              />
            </div>
          </div>
        </div>
        <div className="flex border-t bg-slate-50  px-4 py-3 text-right sm:px-6">
          <div className=" ">
            <AppButton disabled={isLoading} type="submit">
              Save
            </AppButton>
          </div>
        </div>
      </div>
    </form>
  );
};

const DeleteAccountSection = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { mutate } = trpc.profile.deleteMe.useMutation();
  const confirmDeletion = () => {
    mutate(undefined, {
      onSuccess() {
        router.push("/auth/login");
      },
    });
  };
  return (
    <div>
      <div className="shadow sm:overflow-hidden sm:rounded-md">
        <div className="bg-white py-6 px-4 sm:p-6">
          <div>
            <h1 className="text-lg font-medium text-gray-900">
              Delete Account
            </h1>
            <p className="max-w-xl text-sm text-gray-600">
              Permanently delete your account.
            </p>
          </div>
          <p className="mt-6 max-w-xl text-sm text-gray-600">
            Once your account is deleted, all of its resources and data will be
            permanently deleted. Before deleting your account, please download
            any data or information that you wish to retain.
          </p>
          <div className="mt-4 flex">
            <div>
              <AppButton
                type="button"
                intent={"danger"}
                onClick={() => setOpen(true)}
              >
                Delete Account
              </AppButton>
              {/* <!-- Delete User Confirmation Modal --> */}
              <ConfirmationDialog
                // visible={visible}
                // onClose={() => setVisible(false)}
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
                      <AppButton
                        type="button"
                        intent="danger"
                        onClick={confirmDeletion}
                      >
                        Delete Account
                      </AppButton>
                    </div>
                  </div>
                }
                open={open}
                setOpen={setOpen}
                title={"Delete Account"}
              >
                Are you sure you want to delete your account? Once your account
                is deleted, all of its resources and data will be permanently
                deleted. Please enter your password to confirm you would like to
                permanently delete your account.
              </ConfirmationDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const ProfilePage = () => {
  return (
    <>
      <Head>
        <title>Laravel - ProfilePage</title>
      </Head>
      <div className="flex-1 space-y-6">
        <div className="w-full rounded-lg bg-white shadow-sm">
          <ProfileInformationSection />
        </div>
        <div className="w-full rounded-lg bg-white shadow-sm">
          <DeleteAccountSection />
        </div>
      </div>
    </>
  );
};
const Header = () => {
  return (
    <h2 className="text-xl font-semibold leading-tight text-gray-800">
      Profile
    </h2>
  );
};
ProfilePage.getLayout = (page: React.ReactElement) => {
  return getLayout(page, <Header />);
};

export default ProfilePage;
