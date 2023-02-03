import { getLayout } from "@/components/shells/app-layout";
import Head from "next/head";

const Dashboard = () => {
  return (
    <>
      <Head>
        <title>Laravel - Dashboard</title>
      </Head>

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="border-b border-gray-200 bg-white p-6">
              You are logged in!
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Dashboard.getLayout = getLayout;

export default Dashboard;
