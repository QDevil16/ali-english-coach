import { LinkButton } from "@/components/ui/Button";
import { Card, CardTitle, CardText } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

const features = [
  {
    title: "Seviyene göre",
    text: "Kısa bir testle seviyeni ölçer, o seviyeden başlatır.",
  },
  {
    title: "Dinleme odaklı",
    text: "Yavaş ve normal hız dinleme ile duyduğunu anlamayı geliştirir.",
  },
  {
    title: "Hatalarını takip eder",
    text: "Yaptığın hataları kaydeder ve sonraki derslerde tekrar ettirir.",
  },
  {
    title: "Ezber yok, kalıp var",
    text: "Uzun gramer yerine kısa, pratik kalıplarla ilerler.",
  },
];

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col justify-between py-10">
      <Container>
        <section className="mb-10 text-center">
          <span className="mb-4 inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-dark">
            Ali English Coach
          </span>
          <h1 className="mb-3 text-3xl font-extrabold leading-tight text-slate-900">
            İngilizceyi sana göre öğreten kişisel yapay zekâ koçu
          </h1>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Seviyeni ölçer, hedefini anlar, sana özel ders planı oluşturur,
            hatalarını takip eder ve her gün seviyene göre çalıştırır.
          </p>
          <div className="flex flex-col gap-3">
            <LinkButton href="/register">Kayıt Ol</LinkButton>
            <LinkButton href="/login" variant="secondary">
              Giriş Yap
            </LinkButton>
          </div>
        </section>

        <section className="grid gap-3">
          {features.map((f) => (
            <Card key={f.title}>
              <CardTitle>{f.title}</CardTitle>
              <CardText>{f.text}</CardText>
            </Card>
          ))}
        </section>
      </Container>

      <Container className="mt-10">
        <p className="text-center text-xs text-slate-400">
          Düzenli çalışırsan seviyene göre ilerleten, hatalarını takip eden ve
          öğrenme ihtimalini artıran kişisel bir koç.
        </p>
      </Container>
    </main>
  );
}
