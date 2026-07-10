"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AppShell } from "@/components/ui/AppShell";
import { Card, CardTitle, CardText } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Input";
import { SingleChoice } from "@/components/ui/Choice";
import { DAILY_MINUTES } from "@/lib/onboarding/options";

const RATES = [
  { value: 0.7, label: "Yavaş" },
  { value: 0.85, label: "Biraz yavaş" },
  { value: 1, label: "Normal" },
  { value: 1.15, label: "Hızlı" },
];

export default function SettingsPage() {
  const [minutes, setMinutes] = useState<number>(30);
  const [rate, setRate] = useState<number>(1);
  const [sound, setSound] = useState<boolean>(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setRate(Number(localStorage.getItem("aec.speechRate")) || 1);
    setSound(localStorage.getItem("aec.sound") !== "off");
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("learner_profiles")
        .select("daily_minutes")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data?.daily_minutes) setMinutes(data.daily_minutes);
    })();
  }, []);

  function setRatePref(v: number) {
    setRate(v);
    localStorage.setItem("aec.speechRate", String(v));
  }
  function toggleSound() {
    const next = !sound;
    setSound(next);
    localStorage.setItem("aec.sound", next ? "on" : "off");
  }

  async function saveGoal() {
    setSaving(true);
    setSaved(false);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("learner_profiles")
        .update({ daily_minutes: minutes })
        .eq("user_id", user.id);
    }
    setSaving(false);
    setSaved(true);
  }

  return (
    <AppShell title="Ayarlar">
      <div className="space-y-6">
        <Card>
          <CardTitle>Günlük hedef</CardTitle>
          <div className="mt-3">
            <SingleChoice
              label=""
              options={DAILY_MINUTES.map((m) => ({ value: m, label: `${m} dk` }))}
              value={minutes}
              onChange={setMinutes}
              columns={4}
            />
          </div>
          {saved && (
            <div className="mt-3">
              <Alert kind="success">Kaydedildi.</Alert>
            </div>
          )}
          <Button onClick={saveGoal} disabled={saving} className="mt-3 w-full">
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </Card>

        <Card>
          <CardTitle>Ses hızı</CardTitle>
          <div className="mt-3">
            <SingleChoice
              label=""
              options={RATES}
              value={rate}
              onChange={setRatePref}
              columns={2}
            />
          </div>
          <CardText>Dinleme sesinin hızını buradan ayarlarsın.</CardText>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tarayıcı sesi</CardTitle>
              <CardText>Dinle butonlarının sesi.</CardText>
            </div>
            <button
              type="button"
              onClick={toggleSound}
              className={`h-8 w-14 rounded-full transition-colors ${
                sound ? "bg-brand" : "bg-slate-300"
              }`}
            >
              <span
                className={`block h-6 w-6 translate-y-1 rounded-full bg-white transition-transform ${
                  sound ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </Card>

        <Card>
          <CardTitle>Ders dili</CardTitle>
          <CardText>
            Açıklamalar Türkçe, alıştırmalar İngilizce. (Sabit)
          </CardText>
        </Card>

        <Card>
          <CardTitle>Geliştirici — AI modelleri</CardTitle>
          <CardText>
            Model isimleri sunucudaki <code>.env.local</code> dosyasından
            okunur (OPENAI_TEXT_MODEL vb.). Boşsa sistem mock modda çalışır.
          </CardText>
        </Card>

        <Card>
          <CardTitle>Veri ve hesap</CardTitle>
          <CardText>Bu işlemler MVP&apos;de henüz aktif değil.</CardText>
          <div className="mt-3 space-y-2">
            <Button variant="ghost" disabled className="w-full">
              Verileri Sıfırla (yakında)
            </Button>
            <Button variant="ghost" disabled className="w-full text-red-500">
              Hesabı Sil (yakında)
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
