// src/components/workspace/Sidebar.tsx
import SimpleEventTaskList from './SimpleEventTaskList';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { NexusItem } from '@/types/nexus';
import { TimelineData } from '@/utils/timeline-utils';
import GoogleSignInButton from '../GoogleSignInButton';

interface SidebarProps {
  unifiedData: { item: NexusItem; data: TimelineData }[];
}

export default function Sidebar({ unifiedData }: SidebarProps) {
  const { isMainStageExpanded, toggleMainStage } = useWorkspaceStore();
  const events = unifiedData.filter(d => d.data.type === 'event');
  const tasks = unifiedData.filter(d => d.data.type === 'task');

  return (
    <aside className={`flex flex-col h-screen bg-slate-900 border-r border-white/5 transition-all duration-300 ${
      isMainStageExpanded ? 'w-0 opacity-0 overflow-hidden' : 'w-1/3 min-w-[320px] p-4'
    }`}>
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white tracking-tight">Nexus Inbox</h2>
          <GoogleSignInButton />
        </div>
        <button
          onClick={toggleMainStage}
          className="px-3 py-1 bg-blue-600 text-xs font-bold uppercase tracking-wider text-white rounded-md hover:bg-blue-500 transition-colors"
        >
          Expand
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col gap-6">
        {/* Events Section */}
        <section className="flex flex-col min-h-0">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-3">Upcoming Events</h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <SimpleEventTaskList unifiedData={events} />
          </div>
        </section>

        {/* Tasks Section */}
        <section className="flex flex-col min-h-0">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-3">Pending Tasks</h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <SimpleEventTaskList unifiedData={tasks} />
          </div>
        </section>
      </div>
    </aside>
  );
}