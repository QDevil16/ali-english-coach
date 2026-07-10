import { AppShell } from "@/components/ui/AppShell";
import { ConversationPractice } from "@/components/lesson/ConversationPractice";

export const dynamic = "force-dynamic";

export default function PracticePage() {
  return (
    <AppShell title="Konuşma Pratiği">
      <ConversationPractice />
    </AppShell>
  );
}
