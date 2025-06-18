import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import DashboardMainContent from "@/components/DashboardMainContent";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <DashboardMainContent />
      </div>
      <Toaster />
      <div className="text-center text-xs py-2 text-gray-400">
        Don't have an account?{" "}
        <Link to="/auth" className="text-blue-600 underline">
          Sign up or log in here.
        </Link>
      </div>
    </div>
  );
};

export default Index;
