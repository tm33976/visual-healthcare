import DashboardMainContent from "@/components/DashboardMainContent";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <>
      <DashboardMainContent />
      <div className="text-center text-xs py-2 text-gray-400 dark:text-gray-500">
        Don't have an account?{" "}
        <Link to="/auth" className="text-blue-600 underline">
          Sign up or log in here.
        </Link>
      </div>
    </>
  );
};

export default Index;
