import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { RightSidebar } from './RightSidebar';

export function Layout() {
  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white font-sans overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      
      <RightSidebar />
      
      {/* Floating Chat Button */}
      <button className="fixed bottom-6 right-6 lg:right-[344px] w-14 h-14 bg-lime-500 rounded-full flex items-center justify-center shadow-lg hover:bg-lime-400 transition-colors z-50">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 11.5C21 16.1944 16.9706 20 12 20C10.6125 20 9.2975 19.6875 8.125 19.125L3 21L4.875 15.875C4.3125 14.7025 4 13.3875 4 12C4 7.30556 8.02944 3.5 13 3.5C17.9706 3.5 22 7.30556 22 12H21Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
