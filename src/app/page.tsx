
export default function Home() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className="w-64 bg-card p-4">
        <h2 className="text-lg font-bold">Nexus</h2>
        <nav className="mt-8">
          <ul>
            <li className="p-2 hover:bg-accent rounded-md">Dashboard</li>
            <li className="p-2 hover:bg-accent rounded-md">Calendar</li>
            <li className="p-2 hover:bg-accent rounded-md">Tasks</li>
            <li className="p-2 hover:bg-accent rounded-md">Reminders</li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-bold mb-4">Calendar</h3>
            <p>Calendar view will be here.</p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-bold mb-4">Google Tasks</h3>
            <p>Tasks list will be here.</p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-bold mb-4">Immediate Reminders</h3>
            <p>Reminders will be here.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
