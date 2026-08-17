import BottomNav from "@/components/BottomNav";
import NavDrawer from "@/components/NavDrawer";
import { ModeProvider } from "@/lib/ModeContext";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ModeProvider>
      <div className="min-h-dvh bg-[#e9eaf0] md:flex md:items-center md:justify-center md:bg-[radial-gradient(ellipse_at_top,_#eef2ff_0%,_#e9eaf0_65%)] md:p-8">
        <div className="relative mx-auto flex min-h-dvh w-full max-w-[420px] flex-col overflow-hidden bg-page md:min-h-0 md:h-[860px] md:max-h-[calc(100dvh-4rem)] md:rounded-[2.5rem] md:shadow-2xl md:ring-1 md:ring-black/10">
          <main className="flex-1 overflow-y-auto pb-24">{children}</main>
          <BottomNav />
          <NavDrawer />
        </div>
      </div>
    </ModeProvider>
  );
}
