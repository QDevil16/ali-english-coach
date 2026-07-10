"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Input";
import { SingleChoice, MultiChoice } from "@/components/ui/Choice";
import {
  GOALS,
  LEARNING_STYLES,
  DAILY_MINUTES,
  PRIORITY_SKILLS,
} from "@/lib/onboarding/options";

export default function OnboardingPage() {
  const router = useRouter();
  const [goal, setGoal] = useState<string | null>(null);
  const [motivation, setMotivation] = useState("");
  const [struggle, setStruggle] = useState("");
  const [styles, setStyles] = useState<string[]>([]);
  const [minutes, setMinutes] = useState<number | null>(30);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("learner_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!data) return;
      if (data.goal) setGoal(data.goal);
      if (data.motivation) setMotivation(data.motivation);
      if (data.struggle_description) setStruggle(data.struggle_description);
      if (Array.isArray(data.learning_style)) setStyles(data.learning_style);
      if (data.daily_minutes) setMinutes(data.daily_minutes);
      if (Array.isArray(data.priority_skills)) setPriorities(data.priority_skills);
      if (data.cefr_level) setIsEdit(true); // seviye zaten var → düzenleme modu
    })();
  }, []);

  function toggle(list: string[], v: string): string[] {
    return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!goal || !minutes) {
      setError("Lütfen hedef ve günlük süreyi seç.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const payload = {
      user_id: user.id,
      goal,
      motivation,
      struggle_description: struggle,
      learning_style: styles,
      daily_minutes: minutes,
      priority_skills: priorities,
    };

    const { data: existing } = await supabase
      .from("learner_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    const { error } = existing
      ? await supabase
          .from("learner_profiles")
          .update(payload)
          .eq("id", existing.id)
      : await supabase.from("learner_profiles").insert(payload);

    setLoading(false);
    if (error) {
      setError("Kaydedilemedi: " + error.message);
      return;
    }
    // Düzenleme modunda seviye testine gönderme; plana dön.
    router.push(isEdit ? "/curriculum?updated=1" : "/placement-test");
  }

  return (
    <main className="py-8">
      <Container>
        <h1 className="mb-1 text-2xl font-bold text-slate-900">
          {isEdit ? "Öğrenme bilgilerim" : "Seni tanıyalım"}
        </h1>
        <p className="mb-6 text-sm text-slate-600">
          {isEdit
            ? "Bilgilerini güncelle. Kaydedince müfredatını ve dersleri buna göre yeniden oluşturabilirsin."
            : "Bu bilgiler sana özel ders planı kurmamız için. Kısa tut, dürüst ol."}
        </p>
        <form onSubmit={onSubmit} className="space-y-6">
          {error && <Alert>{error}</Alert>}

          <SingleChoice
            label="Hedefin ne?"
            options={GOALS.map((g) => ({ value: g, label: g }))}
            value={goal}
            onChange={setGoal}
          />

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Neden İngilizce öğrenmek istiyorsun? (motivasyon)
            </span>
            <textarea
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand-light"
              rows={3}
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Şimdiye kadar neden öğrenemedin? Nasıl öğrenebilirsin?
            </span>
            <textarea
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand-light"
              rows={4}
              value={struggle}
              onChange={(e) => setStruggle(e.target.value)}
              placeholder="Örn: Duyduğumu anlamıyorum, ezberim kötü, gramerden sıkılıyorum..."
            />
          </label>

          <MultiChoice
            label="Öğrenme tarzın (birden fazla seçebilirsin)"
            options={LEARNING_STYLES}
            values={styles}
            onToggle={(v) => setStyles(toggle(styles, v))}
          />

          <SingleChoice
            label="Günlük çalışma süren?"
            options={DAILY_MINUTES.map((m) => ({ value: m, label: `${m} dk` }))}
            value={minutes}
            onChange={setMinutes}
            columns={4}
          />

          <MultiChoice
            label="Öncelikli becerilerin?"
            options={PRIORITY_SKILLS}
            values={priorities}
            onToggle={(v) => setPriorities(toggle(priorities, v))}
            columns={3}
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading
              ? "Kaydediliyor..."
              : isEdit
                ? "Kaydet → Müfredat"
                : "Devam Et → Seviye Testi"}
          </Button>
        </form>
      </Container>
    </main>
  );
}
