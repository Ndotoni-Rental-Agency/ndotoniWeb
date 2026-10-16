"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { GraphQLClient } from "@/lib/graphql-client";

type Fields = Record<string, string | number | string[]>;
type Room = {
  label: string;
  fields: Fields;
  conflicts: Record<string, string>;
  images: string[];
  videos: string[];
};
type Draft = {
  id: string;
  revision: number;
  kind: string;
  parentKind?: string;
  status: string;
  editable: boolean;
  publishedId?: string;
  needsImportReview: boolean;
  title: string;
  units: Room[];
  sharedImages: string[];
  sharedVideos: string[];
  missing: string[];
};
const decode = (value: any) =>
  typeof value === "string" ? JSON.parse(value) : value;
const GET = `query Draft($draftId:ID!){managedListingDraft(draftId:$draftId)}`;
const SAVE = `mutation Save($draftId:ID!,$input:AWSJSON!){saveManagedListingDraft(draftId:$draftId,input:$input)}`;
const PUBLISH = `mutation Publish($draftId:ID!,$revision:Int!,$confirmImportedDetails:Boolean!){publishManagedListingDraft(draftId:$draftId,revision:$revision,confirmImportedDetails:$confirmImportedDetails)}`;
const REMOVE = `mutation Delete($draftId:ID!,$revision:Int!){deleteManagedListingDraft(draftId:$draftId,revision:$revision)}`;
const sections = [
  { title: "Listing", keys: ["title", "unitLabel", "description", "propertyType"] },
  {
    title: "Owner contact · private",
    keys: ["ownerFirstName", "ownerLastName", "ownerPhone", "ownerEmail"],
  },
  {
    title: "Location",
    keys: ["street", "ward", "district", "region", "latitude", "longitude"],
  },
  {
    title: "Price and capacity",
    keys: [
      "nightlyRate",
      "monthlyRent",
      "currency",
      "maxGuests",
      "bedrooms",
      "bathrooms",
      "amenities",
    ],
  },
];
const labels: Record<string, string> = {
  title: "Title",
  unitLabel: "Room / unit label",
  description: "Description",
  propertyType: "Property type",
  ownerFirstName: "Owner first name",
  ownerLastName: "Owner last name",
  ownerPhone: "Owner WhatsApp number",
  ownerEmail: "Owner email",
  street: "Street / neighbourhood",
  ward: "Ward",
  district: "District",
  region: "Region",
  latitude: "Latitude",
  longitude: "Longitude",
  nightlyRate: "Nightly price",
  monthlyRent: "Monthly rent",
  currency: "Currency",
  maxGuests: "Maximum guests",
  bedrooms: "Bedrooms",
  bathrooms: "Bathrooms",
  amenities: "Amenities (separate with commas)",
};
const numbers = new Set([
  "nightlyRate",
  "monthlyRent",
  "maxGuests",
  "bedrooms",
  "bathrooms",
  "latitude",
  "longitude",
]);
const friendly = (message: string) =>
  Object.entries(labels).reduce(
    (text, [key, label]) =>
      text.replace(new RegExp("\\b" + key + "\\b", "g"), label),
    message,
  );
const show = (value: Fields[string] | undefined) =>
  Array.isArray(value) ? value.join(", ") : value == null ? "" : String(value);
export default function EditDraftPage() {
  const { draftId } = useParams<{ draftId: string }>();
  const router = useRouter();
  const search = useSearchParams();
  const [preview, setPreview] = useState(search.get("view") === "preview");
  const [confirmed, setConfirmed] = useState(false);
  const [draft, setDraft] = useState<Draft>();
  const [index, setIndex] = useState(0);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  function select(d: Draft, i: number) {
    const room = d.units[i];
    setIndex(i);
    setFields(
      Object.fromEntries(
        Object.entries(room.fields).map(([key, value]) => [key, show(value)]),
      ),
    );
    setImages([...room.images]);
    setVideos([...room.videos]);
    setDirty(false);
  }
  async function load() {
    setBusy(true);
    setError("");
    try {
      const response = await GraphQLClient.executeAuthenticated<any>(GET, {
        draftId,
      });
      const data = decode(response.managedListingDraft);
      setDraft(data.draft);
      select(data.draft, 0);
      setConfirmed(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cannot open draft");
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    void load();
  }, [draftId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  async function save(finish = false) {
    if (!draft) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const patch: Fields = {};
      const clear: string[] = [];
      const original = draft.units[index].fields;
      for (const [key, value] of Object.entries(fields))
        if (value !== show(original[key])) {
          if (!value.trim()) clear.push(key);
          else
            patch[key] = numbers.has(key)
              ? Number(value)
              : key === "amenities"
                ? value
                    .split(",")
                    .map((v) => v.trim())
                    .filter(Boolean)
                : value;
        }
      const response = await GraphQLClient.executeAuthenticated<any>(SAVE, {
        draftId,
        input: JSON.stringify({
          revision: draft.revision,
          unitLabel: draft.units[index].label,
          fields: patch,
          clearFields: clear,
          images,
          videos,
        }),
      });
      const data = decode(response.saveManagedListingDraft);
      setDraft(data.draft);
      select(data.draft, index);
      setNotice("Draft saved. Nothing has been published.");
      setConfirmed(false);
      if (finish) router.push("/admin/listing-drafts");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }
  async function publish() {
    if (!draft || dirty || !confirmed) return;
    if (
      !confirm(
        "Publish this property and all its rooms now? The usual listing notifications will be sent.",
      )
    )
      return;
    setBusy(true);
    setError("");
    try {
      const r = await GraphQLClient.executeAuthenticated<any>(PUBLISH, {
        draftId,
        revision: draft.revision,
        confirmImportedDetails: true,
      });
      const data = decode(r.publishManagedListingDraft);
      setDraft(data.draft);
      select(data.draft, index);
      if (!data.success) throw new Error(data.error);
      setNotice("Published successfully. Open the live property link above.");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not publish. Reload to check its current status before retrying.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (
      !draft ||
      !confirm(
        "Permanently delete this unpublished draft and its room details? Published properties and original uploaded media will not be deleted.",
      )
    )
      return;
    setBusy(true);
    setError("");
    try {
      await GraphQLClient.executeAuthenticated(REMOVE, {
        draftId,
        revision: draft.revision,
      });
      setDirty(false);
      router.push("/admin/listing-drafts");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete draft");
      setBusy(false);
    }
  }
  function move(kind: "images" | "videos", from: number, to: number) {
    const values = [...(kind === "images" ? images : videos)];
    if (to < 0 || to >= values.length) return;
    [values[from], values[to]] = [values[to], values[from]];
    (kind === "images" ? setImages : setVideos)(values);
    setDirty(true);
  }
  const inputClass =
    "mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100";
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <meta name="referrer" content="no-referrer" />
      <meta name="robots" content="noindex,nofollow" />
      <Link
        href="/admin/listing-drafts"
        className="text-sm font-medium text-emerald-700"
      >
        ← All listing drafts
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-stone-900">
        {draft?.title || "Edit listing draft"}
      </h1>
      <p className="mt-2 text-sm text-stone-600">
        Edit and save each room, preview the complete property, then publish
        when ready. Changes stay in this shared draft until you publish.
      </p>
      {error && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {error}{" "}
          <button
            type="button"
            onClick={() => {
              if (!dirty || confirm("Reload and discard unsaved edits?"))
                void load();
            }}
            className="ml-2 underline"
          >
            Reload draft
          </button>
        </div>
      )}
      {notice && (
        <p
          role="status"
          className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          {notice}
        </p>
      )}
      {!draft && busy && <p className="mt-8">Opening your saved draft…</p>}
      {draft && (
        <>
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => setPreview(false)}
              className="min-h-11 rounded-xl border px-5"
            >
              Edit details
            </button>
            <button
              type="button"
              onClick={() => {
                if (dirty) {
                  setError("Save this room before previewing the property.");
                  return;
                }
                setPreview(true);
              }}
              className="min-h-11 rounded-xl border px-5"
            >
              View property details
            </button>
            {draft.publishedId && (
              <a
                href={`${draft.kind === "LONG_TERM" || draft.parentKind === "LONG_TERM" ? "https://www.ndotoni.com" : "https://www.ndotonistays.com"}/property/${draft.publishedId}`}
                target="_blank"
                rel="noreferrer"
                className="self-center text-sm underline"
              >
                View live property
              </a>
            )}
          </div>
          {preview && (
            <section className="mt-6 space-y-8">
              {draft.units.map((room) => (
                <article
                  key={room.label}
                  className="rounded-2xl border border-stone-200 bg-white p-5"
                >
                  <h2 className="text-xl font-semibold">
                    {show(room.fields.title) || room.label}
                  </h2>
                  <p className="mt-2 text-sm text-stone-600">
                    {[
                      room.fields.street,
                      room.fields.ward,
                      room.fields.district,
                      room.fields.region,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p className="my-3 text-lg font-semibold">
                    {show(room.fields.currency)}{" "}
                    {show(room.fields.nightlyRate || room.fields.monthlyRent)} /{" "}
                    {draft.kind === "LONG_TERM" ||
                    draft.parentKind === "LONG_TERM"
                      ? "month"
                      : "night"}
                  </p>
                  <p className="whitespace-pre-line text-sm leading-6">
                    {show(room.fields.description)}
                  </p>
                  <p className="mt-3 text-sm">
                    Guests: {show(room.fields.maxGuests) || "Not supplied"} ·
                    Bedrooms: {show(room.fields.bedrooms) || "Not supplied"} ·
                    Bathrooms: {show(room.fields.bathrooms) || "Not supplied"}
                  </p>
                  <p className="mt-3 text-sm">{show(room.fields.amenities)}</p>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {[...room.images, ...draft.sharedImages].map((url, i) => (
                      <img
                        key={`${url}-${i}`}
                        src={url}
                        alt={`${room.label} photo ${i + 1}`}
                        className="aspect-[4/3] w-full rounded-xl object-cover"
                      />
                    ))}
                  </div>
                  {[...room.videos, ...draft.sharedVideos].map((url) => (
                    <video
                      key={url}
                      src={url}
                      controls
                      preload="metadata"
                      className="mt-3 w-full rounded-xl"
                    />
                  ))}
                  <details className="mt-4 rounded-xl bg-stone-50 p-3 text-sm">
                    <summary>Private owner contact · admin only</summary>
                    {[
                      "ownerFirstName",
                      "ownerLastName",
                      "ownerPhone",
                      "ownerEmail",
                    ].map((key) => (
                      <p key={key}>{show(room.fields[key])}</p>
                    ))}
                  </details>
                </article>
              ))}
            </section>
          )}
          <p className="mt-4 text-sm font-medium text-stone-600">
            Status: {draft.status}
            {draft.status === "uncertain"
              ? " · Publication needs review before any retry."
              : ""}
          </p>
          <div className="my-6">
            <label className="text-sm font-medium text-stone-800">
              Room / unit
              <select
                className={inputClass}
                disabled={busy}
                value={index}
                onChange={(e) => {
                  if (dirty) {
                    setError("Save this room before switching.");
                    return;
                  }
                  select(draft, Number(e.target.value));
                  setError("");
                }}
              >
                {draft.units.map((room, i) => (
                  <option key={room.label} value={i}>
                    {room.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {draft.missing.length > 0 && (
            <details className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <summary className="cursor-pointer font-medium">
                Details still needed ({draft.missing.length})
              </summary>
              <ul className="mt-2 list-disc pl-5">
                {draft.missing.map((item, i) => (
                  <li key={i}>{friendly(item)}</li>
                ))}
              </ul>
            </details>
          )}
          {Object.keys(draft.units[index].conflicts).length > 0 && (
            <div className="mb-6 rounded-xl bg-amber-50 p-4 text-sm">
              <p className="font-semibold">Check conflicting details</p>
              {Object.entries(draft.units[index].conflicts).map(
                ([key, value]) => (
                  <p key={key}>
                    {labels[key] || key}: {value}
                  </p>
                ),
              )}
            </div>
          )}
          <fieldset
            disabled={busy || !draft.editable}
            className={`space-y-6 ${preview ? "hidden" : ""}`}
          >
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-2xl border border-stone-200 bg-white p-5"
              >
                <h2 className="mb-4 text-lg font-semibold text-stone-900">
                  {section.title}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {section.keys
                    .filter(
                      (key) =>
                        !(
                          key === "monthlyRent" &&
                          (draft.kind === "SHORT_TERM" ||
                            draft.parentKind === "SHORT_TERM")
                        ) &&
                        !(
                          key === "nightlyRate" &&
                          (draft.kind === "LONG_TERM" ||
                            draft.parentKind === "LONG_TERM")
                        ),
                    )
                    .map((key) => (
                      <label
                        key={key}
                        className={`text-sm font-medium text-stone-700 ${["description", "amenities"].includes(key) ? "sm:col-span-2" : ""}`}
                      >
                        {labels[key]}
                        {key === "description" ? (
                          <textarea
                          disabled={draft.kind === "UNIT"}
                            rows={5}
                            className={inputClass}
                            value={fields[key] || ""}
                            onChange={(e) => {
                              setFields((f) => ({
                                ...f,
                                [key]: e.target.value,
                              }));
                              setDirty(true);
                            }}
                          />
                        ) : (
                          <input
                            className={inputClass}
                            disabled={
                              draft.kind === "UNIT" &&
                              [
                                "ownerFirstName",
                                "ownerLastName",
                                "ownerPhone",
                                "ownerEmail",
                                "description",
                                "propertyType",
                                "street",
                                "ward",
                                "district",
                                "region",
                                "latitude",
                                "longitude",
                                "amenities",
                              ].includes(key)
                            }
                            type={
                              numbers.has(key)
                                ? "number"
                                : key === "ownerEmail"
                                  ? "email"
                                  : "text"
                            }
                            step={
                              ["latitude", "longitude"].includes(key)
                                ? "any"
                                : undefined
                            }
                            value={fields[key] || ""}
                            onChange={(e) => {
                              setFields((f) => ({
                                ...f,
                                [key]: e.target.value,
                              }));
                              setDirty(true);
                            }}
                          />
                        )}
                      </label>
                    ))}
                </div>
              </section>
            ))}
            <section className="rounded-2xl border border-stone-200 bg-white p-5">
              <h2 className="text-lg font-semibold">Room photos and videos</h2>
              <p className="mt-1 text-sm text-stone-500">
                The first photo becomes the cover. Use the arrows to reorder;
                forward new media in WhatsApp after finishing here.
              </p>
              {(["images", "videos"] as const).map((kind) => (
                <div
                  key={kind}
                  className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3"
                >
                  {(kind === "images" ? images : videos).map((url, i) => (
                    <div
                      key={url}
                      className="overflow-hidden rounded-xl border border-stone-200"
                    >
                      {kind === "images" ? (
                        <img
                          src={url}
                          alt={`Room photo ${i + 1}`}
                          className="aspect-[4/3] w-full object-cover"
                        />
                      ) : (
                        <video
                          src={url}
                          controls
                          preload="metadata"
                          className="aspect-[4/3] w-full"
                        />
                      )}
                      <div className="flex items-center justify-between gap-1 p-2">
                        <button
                          type="button"
                          aria-label="Move earlier"
                          disabled={i === 0}
                          onClick={() => move(kind, i, i - 1)}
                          className="min-h-11 px-3 disabled:opacity-30"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          aria-label="Move later"
                          disabled={
                            i ===
                            (kind === "images" ? images : videos).length - 1
                          }
                          onClick={() => move(kind, i, i + 1)}
                          className="min-h-11 px-3 disabled:opacity-30"
                        >
                          →
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            (kind === "images" ? setImages : setVideos)(
                              (items) => items.filter((_, j) => j !== i),
                            );
                            setDirty(true);
                          }}
                          className="min-h-11 px-2 text-xs text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </section>
          </fieldset>
          {!!draft.sharedImages.length && (
            <section className="mt-6 rounded-2xl border border-stone-200 p-5">
              <h2 className="font-semibold">Shared property photos</h2>
              <p className="mt-1 text-sm text-stone-500">
                These belong to all rooms. Manage shared media in WhatsApp after
                finishing here.
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {draft.sharedImages.map((url) => (
                  <img
                    key={url}
                    src={url}
                    alt="Shared property photo"
                    className="aspect-[4/3] w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            </section>
          )}
          <div className="sticky bottom-0 mt-8 flex flex-wrap gap-3 border-t border-stone-200 bg-white/95 py-4 backdrop-blur">
            <button
              type="button"
              disabled={busy || !draft.editable}
              onClick={() => void save()}
              className="min-h-12 rounded-xl border border-emerald-800 px-6 font-semibold text-emerald-800 disabled:opacity-50"
            >
              {busy ? "Saving…" : "Save room"}
            </button>
            <button
              type="button"
              disabled={busy || !draft.editable}
              onClick={() => void save(true)}
              className="min-h-12 rounded-xl bg-emerald-800 px-6 font-semibold text-white disabled:opacity-50"
            >
              Save and close
            </button>
            <span className="self-center text-xs text-stone-500">
              {dirty ? "Unsaved changes" : "Saved draft · not published"}
            </span>
          </div>
          {draft.editable && (
            <section className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <h2 className="font-semibold">Publish this property</h2>
              <p className="mt-2 text-sm">
                Publishing creates the listing and all rooms and sends the usual
                owner/admin notifications. Review the complete property above
                first.
              </p>
              <label className="mt-4 flex gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-1"
                />
                I checked the owner contacts, location, room prices and photo
                assignments for every room.
              </label>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={busy || dirty || !confirmed}
                  onClick={() => void publish()}
                  className="min-h-12 rounded-xl bg-emerald-800 px-6 font-semibold text-white disabled:opacity-40"
                >
                  Publish property and rooms
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void remove()}
                  className="min-h-12 rounded-xl border border-red-300 px-6 text-red-700 disabled:opacity-40"
                >
                  Delete draft
                </button>
              </div>
              {dirty && (
                <p className="mt-2 text-sm">
                  Save your edits before publishing.
                </p>
              )}
            </section>
          )}
        </>
      )}
    </main>
  );
}
