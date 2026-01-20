# Nexus - Your Unified Productivity Hub

Nexus is a full-stack Next.js application that serves as a unified productivity hub. It integrates natively with Google Calendar and Google Tasks to bring your schedule and to-dos into a single, streamlined dashboard.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Backend:** [Supabase](https://supabase.io/) (Auth & Database)
- **APIs:**
  - [Google Calendar API](https://developers.google.com/calendar/api)
  - [Google Tasks API](https://developers.google.com/tasks/reference/rest)
- **Icons:** [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm

### Installation

1. **Clone the repo**
   ```sh
   git clone https://github.com/your_username/nexus.git
   ```
2. **Install NPM packages**
   ```sh
   npm install
   ```
3. **Set up your environment variables**

   Create a `.env.local` file in the root of the project and add your Supabase project URL and anon key:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

   To get these keys, you need to:
   - Create a new project on [Supabase](https://supabase.com).
   - In your Supabase project, go to **Authentication** > **Providers** and enable **Google**.
   - You will need to get the **Client ID** and **Client Secret** from the [Google API Console](https://console.developers.google.com/).
   - Make sure to add the correct callback URL in your Google API Console credentials. You can find the callback URL in your Supabase project's Google authentication settings.

### Running the Development Server

Once you have set up your environment variables, you can run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Phases

The development of this project is divided into the following phases:

- **Phase 1: Project Initialization & Auth:** Setting up the Next.js project, configuring Supabase authentication with Google, and creating the basic layout.
- **Phase 2: The Unified Dashboard UI:** Building the 3-column dashboard with a calendar, tasks list, and reminders.
- **Phase 3: Google Integration (Server Actions):** Fetching and posting data to Google Calendar and Google Tasks.
- **Phase 4: Smart Reminders:** Implementing browser-based notifications and a unified timeline.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request