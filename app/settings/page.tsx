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
  const [status, setStatus] = useState<{
    ai: boolean;
    textModel: string | null;
    supabase: boolean;
    serviceRole: boolean;
  } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [aiTest, setAiTest] = useState<string | null>(null);

  async function testAi() {
    setAiTest("Test ediliyor...");
    try {
      const res = await fetch("/api/ai/test", { method: "POST" });
      const j = await res.json();
      setAiTest(
        j.ok
          ? `✅ Çalışıyor · ${j.model}`
          : `❌ Hata: ${j.reason || "bilinmeyen"}${j.model ? ` (model: ${j.model})` : ""}`,
      );
    } catch {
      setAiTest("❌ İstek başarısız.");
    }
  }

  useEffect(() => {
    setRate(Number(localStorage.getItem("aec.speechRate")) || 1);
    setSound(localStorage.getItem("aec.sound") !== "off");
    fetch("/api/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => {});
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

  async function resetData() {
    if (
      !confirm(
        "Tüm derslerin, hataların, müfredatın ve ilerlemen silinecek. Hesabın ve seviye bilgin kalır. Emin misin?",
      )
    )
      return;
    setBusy("reset");
    setMsg(null);
    const res = await fetch("/api/account/reset", { method: "POST" });
    setBusy(null);
    setMsg(res.ok ? "Öğrenme verilerin sıfırlandı." : "Sıfırlanamadı.");
  }

  async function deleteAccount() {
    if (!confirm("Hesabın ve TÜM verilerin kalıcı silinecek. Geri alınamaz. Emin misin?"))
      return;
    if (!confirm("Son onay: hesabı silmek istediğine emin misin?")) return;
    setBusy("delete");
    setMsg(null);
    const res = await fetch("/api/account/delete", { method: "POST" });
    if (res.ok) {
      await createClient().auth.signOut();
      window.location.href = "/";
    } else {
      setBusy(null);
      setMsg(
        "Silinemedi. Sunucuda SUPABASE_SERVICE_ROLE_KEY tanımlı olmalı.",
      );
    }
  }

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
            Açıklamalar Türkçe, alıştırmalar İngilizce. Bu sürümde sabittir.
          </CardText>
        </Card>

        <Card>
          <CardTitle>Sistem durumu</CardTitle>
          {status ? (
            <div className="mt-1 space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Yapay zekâ</span>
                <span
                  className={`font-semibold ${
                    status.ai ? "text-green-600" : "text-amber-600"
                  }`}
                >
                  {status.ai
                    ? `Aktif · ${status.textModel}`
                    : "Kapalı (mock mod)"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Supabase</span>
                <span className={status.supabase ? "text-green-600" : "text-red-600"}>
                  {status.supabase ? "Bağlı" : "Yok"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Hesap silme yetkisi</span>
                <span className={status.serviceRole ? "text-green-600" : "text-amber-600"}>
                  {status.serviceRole ? "Var" : "Yok"}
                </span>
              </div>
              {!status.ai && (
                <p className="pt-1 text-xs text-slate-400">
                  Gerçek AI için sunucudaki .env.local dosyasına
                  OPENAI_API_KEY ekle ve uygulamayı yeniden başlat.
                </p>
              )}
            </div>
          ) : (
            <CardText>Kontrol ediliyor...</CardText>
          )}
          <Button
            variant="secondary"
            onClick={testAi}
            className="mt-3 w-full"
          >
            AI'yı Gerçek İstekle Test Et
          </Button>
          {aiTest && (
            <p className="mt-2 text-sm font-medium text-slate-700">{aiTest}</p>
          )}
        </Card>

        <Card>
          <CardTitle>Veri ve hesap</CardTitle>
          {msg && (
            <div className="mt-2">
              <Alert kind="success">{msg}</Alert>
            </div>
          )}
          <div className="mt-3 space-y-2">
            <Button
              variant="secondary"
              onClick={resetData}
              disabled={busy !== null}
              className="w-full"
            >
              {busy === "reset" ? "Sıfırlanıyor..." : "Öğrenme Verilerini Sıfırla"}
            </Button>
            <Button
              variant="ghost"
              onClick={deleteAccount}
              disabled={busy !== null}
              className="w-full text-red-500"
            >
              {busy === "delete" ? "Siliniyor..." : "Hesabı Sil"}
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
