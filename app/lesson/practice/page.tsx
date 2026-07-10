import { AppShell } from "@/components/ui/AppShell";
import { LivePractice } from "@/components/lesson/LivePractice";

export const dynamic = "force-dynamic";

export default function PracticePage() {
  return (
    <AppShell title="Canlı Pratik">
      <LivePractice />
    </AppShell>
  );
}
