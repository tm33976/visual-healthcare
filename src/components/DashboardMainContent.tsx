
import AnatomySection from "./AnatomySection";
import CalendarView from "./CalendarView";
import UpcomingSchedule from "./UpcomingSchedule";
import ActivityFeed from "./ActivityFeed";

const DashboardMainContent = () => {
  return (
    <main className="flex-1 p-6 overflow-auto">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
        {/* Left Column - Anatomy Section */}
        <div className="xl:col-span-1">
          <AnatomySection />
        </div>
        
        {/* Middle Column - Calendar */}
        <div className="xl:col-span-1">
          <CalendarView />
        </div>
        
        {/* Right Column - Schedule and Activity */}
        <div className="xl:col-span-1 space-y-6">
          <UpcomingSchedule />
          <ActivityFeed />
        </div>
      </div>
    </main>
  );
};

export default DashboardMainContent;
