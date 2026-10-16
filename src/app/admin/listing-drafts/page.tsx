"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GraphQLClient } from "@/lib/graphql-client";
type Draft = {
  id: string;
  title: string;
  status: string;
  kind: string;
  rooms: number;
  thumbnail?: string;
  updatedAt: string;
  editable: boolean;
};
export default function ListingDrafts() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() {
    setLoading(true);
    setError("");
    try {
      const r = await GraphQLClient.executeAuthenticated<any>(
        "query TeamDrafts { managedListingDrafts }",
      );
      const data =
        typeof r.managedListingDrafts === "string"
          ? JSON.parse(r.managedListingDrafts)
          : r.managedListingDrafts;
      setDrafts(data.drafts);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cannot load drafts");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Listing drafts</h1>
          <p className="mt-2 text-sm text-stone-600">
            Shared with all admins. Review property details, edit rooms, and
            publish when ready.
          </p>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={() => void load()}
          className="min-h-11 rounded-xl border px-5"
        >
          Refresh
        </button>
      </div>
      {error && (
        <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-red-800">
          {error}
        </p>
      )}
      {loading ? (
        <p>Loading saved drafts…</p>
      ) : !drafts.length ? (
        <p className="rounded-xl border p-8 text-stone-600">
          No saved drafts yet. Create a draft or import an export in WhatsApp
          Admin tools; it will appear here.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {drafts.map((d) => (
            <article
              key={d.id}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
            >
              {d.thumbnail ? (
                <img
                  src={d.thumbnail}
                  alt={d.title}
                  className="aspect-[16/9] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[16/9] items-center justify-center bg-stone-100 text-sm text-stone-500">
                  No photos yet
                </div>
              )}
              <div className="p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  {d.status} · {d.rooms} {d.rooms === 1 ? "room" : "rooms"}
                </p>
                <h2 className="mt-2 text-lg font-semibold">{d.title}</h2>
                <p className="mt-1 text-xs text-stone-500">
                  Updated {new Date(d.updatedAt).toLocaleString()}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href={`/admin/listing-drafts/${encodeURIComponent(d.id)}?view=preview`}
                    className="inline-flex min-h-11 items-center rounded-xl border px-4 text-sm"
                  >
                    View details
                  </Link>
                  {d.editable && (
                    <Link
                      href={`/admin/listing-drafts/${encodeURIComponent(d.id)}`}
                      className="inline-flex min-h-11 items-center rounded-xl bg-emerald-800 px-4 text-sm font-semibold text-white"
                    >
                      Edit draft
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
