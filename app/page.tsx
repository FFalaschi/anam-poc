import SofiaVideo from '@/components/SofiaVideo';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12 pt-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Wynter Brand Tracking Survey
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Meet Sofia, your professional survey interviewer.
            Participate in our brand awareness and perception study for B2B marketing research platforms.
          </p>
        </header>

        {/* Sofia Video Component */}
        <SofiaVideo />
      </div>
    </main>
  );
}
