"use client";

import { AppShell } from "@/components/ui/AppShell";
import { CardText } from "@/components/ui/Card";
import { speak } from "@/lib/speech/browserSpeech";
import { IRREGULAR_VERBS } from "@/lib/irregularverbs";

export default function VerbsPage() {
  return (
    <AppShell title="Düzensiz Fiiller">
      <CardText>
        İngilizcede fiillerin 3 hali vardır: <b>V1</b> (yalın), <b>V2</b>{" "}
        (geçmiş), <b>V3</b> (partisip — have/has ile). Düzensiz fiiller kural
        değil ezber ister. En sık {IRREGULAR_VERBS.length} tanesi burada.
      </CardText>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
              <th className="py-2">V1</th>
              <th>V2</th>
              <th>V3</th>
              <th>Türkçe</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {IRREGULAR_VERBS.map((v) => (
              <tr key={v.v1} className="border-b border-slate-100">
                <td className="py-2 font-semibold text-slate-900">{v.v1}</td>
                <td className="text-slate-700">{v.v2}</td>
                <td className="text-slate-700">{v.v3}</td>
                <td className="text-slate-500">{v.tr}</td>
                <td>
                  <button
                    onClick={() => speak(`${v.v1}, ${v.v2.split("/")[0]}, ${v.v3.split("/")[0]}`, 0.85)}
                    className="text-brand"
                  >
                    🔊
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
