import UnifiedTimeline from "./components/UnifiedTimeline";
import { sampleEvents, sampleTasks } from "../data/sampleData"; // Import sample data

export default function Home() {
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Left: Nav Sidebar */}
      <aside className="w-1/5 bg-white/10 backdrop-blur-lg rounded-lg m-2 p-4">
        {/* Content for Nav Sidebar will go here */}
      </aside>

      {/* Center: Unified Scrollable Timeline */}
      <main className="w-3/5 bg-white/10 backdrop-blur-lg rounded-lg m-2 p-4 overflow-y-auto">
        <UnifiedTimeline events={sampleEvents} tasks={sampleTasks} />
      </main>

      {/* Right: Info Panel */}
      <aside className="w-1/5 bg-white/10 backdrop-blur-lg rounded-lg m-2 p-4">
        {/* Content for Info Panel will go here */}
      </aside>
    </div>
  );
}
