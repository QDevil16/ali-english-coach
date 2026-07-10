import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/Container";
import { Card, CardTitle, CardText } from "@/components/ui/Card";
import { SignOutButton } from "@/components/auth/SignOutButton";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="py-8">
      <Container>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">Panel</h1>
          <SignOutButton />
        </div>
        <Card>
          <CardTitle>Hoş geldin</CardTitle>
          <CardText>
            {user?.email} olarak giriş yaptın. Bu geçici paneldir; sonraki
            aşamalarda onboarding, seviye testi ve günlük dersler eklenecek.
          </CardText>
        </Card>
      </Container>
    </main>
  );
}
