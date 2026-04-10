import SlotMachine from '@/components/SlotMachine';

export default function Home() {
  return (
    <main className="min-h-screen bg-sky-100 flex flex-col items-center py-10 font-sans">
      <header className="mb-12 text-center">
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-500 drop-shadow-sm filter">
          ひらがなスロット
        </h1>
      </header>

      <SlotMachine />
      
      {/* Decorative elements */}
      <div className="fixed top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="fixed top-10 right-10 w-20 h-20 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="fixed bottom-10 left-20 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </main>
  );
}
