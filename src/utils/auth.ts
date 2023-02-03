import { trpc } from "./trpc";
import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";

type HookProps = {
  middleware: "guest" | "auth";
  redirectIfAuthenticated?: string;
};

export const useAuth = ({ middleware, redirectIfAuthenticated }: HookProps) => {
  const router = useRouter();

  const {
    data: user,

    error,
    isLoading,
  } = trpc.auth.getUser.useQuery(undefined, {
    staleTime: 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const { mutate } = trpc.auth.logout.useMutation({
    // staleTime: 1000,
    retry: false,
  });

  // ('/api/user', () =>
  //     axios
  //         .get('/api/user')
  //         .then(res => res.data)
  //         .catch(error => {
  //             if (error.response.status !== 409) throw error

  //             router.push('/verify-email')
  //         }),
  // )

  // const csrf = () => axios.get('/sanctum/csrf-cookie')

  // const register = async ({ setErrors, ...props }) => {
  //     await csrf()

  //     setErrors([])

  //     axios
  //         .post('/register', props)
  //         .then(() => mutate())
  //         .catch(error => {
  //             if (error.response.status !== 422) throw error

  //             setErrors(error.response.data.errors)
  //         })
  // }

  // const login = async ({ setErrors, setStatus, ...props }) => {
  //     await csrf()

  //     setErrors([])
  //     setStatus(null)

  //     axios
  //         .post('/login', props)
  //         .then(() => mutate())
  //         .catch(error => {
  //             if (error.response.status !== 422) throw error

  //             setErrors(error.response.data.errors)
  //         })
  // }

  // const forgotPassword = async ({ setErrors, setStatus, email }) => {
  //     await csrf()

  //     setErrors([])
  //     setStatus(null)

  //     axios
  //         .post('/forgot-password', { email })
  //         .then(response => setStatus(response.data.status))
  //         .catch(error => {
  //             if (error.response.status !== 422) throw error

  //             setErrors(error.response.data.errors)
  //         })
  // }

  // const resetPassword = async ({ setErrors, setStatus, ...props }) => {
  //     await csrf()

  //     setErrors([])
  //     setStatus(null)

  //     axios
  //         .post('/reset-password', { token: router.query.token, ...props })
  //         .then(response =>
  //             router.push('/login?reset=' + btoa(response.data.status)),
  //         )
  //         .catch(error => {
  //             if (error.response.status !== 422) throw error

  //             setErrors(error.response.data.errors)
  //         })
  // }

  // const resendEmailVerification = ({ setStatus }) => {
  //     axios
  //         .post('/email/verification-notification')
  //         .then(response => setStatus(response.data.status))
  // }

  const logout = useCallback(async () => {
    if (!error) {
      // await axios.post('/logout').then(() => mutate())
      mutate(undefined, {
        onSuccess: () => {
          router.push("/auth/login");
        },
      });
      return;
    }

    // window.location.pathname = '/login'
    router.push("/auth/login");
  }, [error, router, mutate]);

  useEffect(() => {
    if (middleware === "guest" && redirectIfAuthenticated && user)
      router.push(redirectIfAuthenticated);
    // if (window.location.pathname === "/verify-email" && user?.email_verified_at)
    //   router.push(redirectIfAuthenticated);
    if (middleware === "auth" && error) logout();
  }, [user, error, logout, router, middleware, redirectIfAuthenticated]);
  console.log("---Auth hook---");
  return {
    user,
    // register,
    // login,
    // forgotPassword,
    // resetPassword,
    // resendEmailVerification,
    logout,
    isLoading,
  };
};
