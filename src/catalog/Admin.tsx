import React, { useState } from "react";
import { api } from "../services/api";
import {
  Building2,
  Image,
  LayoutDashboard,
  Mail,
  PencilRuler,
  Settings2,
  Shield,
  Users,
} from "lucide-react";
import {
  Feedback,
  FormAction,
  Input,
  Listing,
  Pager,
  Photo,
  useData,
} from "./shared";
import { Detail } from "./Public";
import { LoginForm } from "../components/AuthModal";

function Select({
  name,
  values,
  value,
  label,
}: {
  name: string;
  values: string[];
  value?: string;
  label: string;
}) {
  return (
    <label>
      {label}
      <select name={name} defaultValue={value || values[0]}>
        {values.map((v) => (
          <option key={v}>{v}</option>
        ))}
      </select>
    </label>
  );
}
function Overview() {
  const r = useData("/manage/overview");
  return r.data ? (
    <>
      <h2>Overview</h2>
      <div className="metrics">
        {Object.entries(r.data.counts).map(([k, v]) => (
          <div key={k}>
            <strong>{String(v)}</strong>
            <span>{k.replace(/_/g, " ")}</span>
          </div>
        ))}
      </div>
      <h2>Recent activity</h2>
      {!r.data.activity.length && <p>No activity recorded yet.</p>}
      {r.data.activity.map((a, i) => (
        <p key={i}>
          {a.action.replace(/_/g, " ")} ·{" "}
          {new Date(a.created_at).toLocaleString("en-IN")}
        </p>
      ))}
    </>
  ) : (
    <Feedback error={r.error} />
  );
}
function Upload({
  onUpload,
  multiple = true,
}: {
  onUpload: (id: string) => void;
  multiple?: boolean;
}) {
  const [message, set] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <label>
      Upload {multiple ? "images" : "image"}
      <input
        type="file"
        accept="image/jpeg,image/webp,image/png"
        multiple={multiple}
        disabled={busy}
        onChange={async (e) => {
          const files = Array.from(e.target.files || []);
          e.target.value = "";
          set("");
          setBusy(true);
          try {
            for (const file of files) {
              const form = new FormData();
              form.append("image", file);
              const image = await api("/manage/media", "POST", form);
              onUpload(image.id);
            }
            set("Upload complete.");
          } catch (e) {
            set((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      />
      <small role="status">{busy ? "Uploading…" : message}</small>
    </label>
  );
}
function ImagePicker({ select }: { select: (id: string) => void }) {
  const [page, set] = useState(0),
    r = useData("/manage/media?page=" + page);
  return (
    <details>
      <summary>Choose an uploaded image</summary>
      {r.data ? (
        <>
          <div className="thumbs">
            {r.data.slice(0, 20).map((img) => (
              <button
                key={img.id}
                type="button"
                onClick={() => select(img.id)}
                aria-label={"Choose image " + img.id}
              >
                <Photo id={img.id} />
              </button>
            ))}
          </div>
          <Pager page={page} set={set} more={r.data.length > 20} />
        </>
      ) : (
        <Feedback error={r.error} />
      )}
    </details>
  );
}
function Editor({
  item,
  kind,
  close,
}: {
  item?: Listing;
  kind: string;
  close: () => void;
}) {
  const [gallery, setG] = useState<string[]>(item?.gallery || []),
    [floor, setFloor] = useState(item?.floor_plan_id || ""),
    [preview, setPreview] = useState<Listing | null>(null);
  function values(b: any) {
    return {
      ...b,
      kind,
      amenities: (b.amenities || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      featured: b.featured === "on",
      gallery,
      floor_plan_id: floor,
    };
  }
  const add = (id: string) =>
    setG((old) => (old.includes(id) ? old : [...old, id]));
  return (
    <>
      <button onClick={close}>Back to listings</button>
      <h2>
        {item ? "Edit" : "Add"} {kind}
      </h2>
      <FormAction
        submit={(b) =>
          api(
            "/manage/listings" + (item ? "/" + item.id : ""),
            item ? "PUT" : "POST",
            values(b),
          )
        }
        onDone={close}
      >
        <div className="form-grid">
          <Input name="title" label="Title" value={item?.title} required />
          <Input name="slug" label="URL slug" value={item?.slug} required />
          <Input name="location" label="Location" value={item?.location} />
          <Input
            name="price_inr"
            label={kind === "design" ? "Estimated cost (₹)" : "Price (₹)"}
            value={item?.price_inr}
            type="number"
          />
          {kind === "apartment" ? (
            <>
              <Input name="bhk" label="BHK" value={item?.bhk} type="number" />
              <Input
                name="carpet_sqft"
                label="Carpet area (sq ft)"
                value={item?.carpet_sqft}
                type="number"
              />
              <Input
                name="construction_status"
                label="Construction stage"
                value={item?.construction_status}
              />
              <Input name="rera" label="RERA registration" value={item?.rera} />
              <Select
                name="availability"
                label="Availability"
                values={["available", "reserved", "sold"]}
                value={item?.availability}
              />
              <Input
                name="amenities"
                label="Amenities (comma-separated)"
                value={item?.amenities.join(", ")}
              />
            </>
          ) : (
            <>
              <Input
                name="category"
                label="Design category"
                value={item?.category}
              />
              <label>
                Specifications
                <textarea
                  name="specifications"
                  defaultValue={item?.specifications}
                />
              </label>
            </>
          )}
          <Select
            name="status"
            label="Publication"
            values={["draft", "published", "archived"]}
            value={item?.status}
          />
          <label>
            <input
              name="featured"
              type="checkbox"
              defaultChecked={item?.featured}
            />{" "}
            Featured on homepage
          </label>
        </div>
        <label>
          Description
          <textarea name="description" defaultValue={item?.description} />
        </label>
        <h3>Gallery</h3>
        <p>The first image is the cover.</p>
        <Upload onUpload={add} />
        <ImagePicker select={add} />
        <div className="thumbs">
          {gallery.map((id, i) => (
            <div key={id}>
              <Photo id={id} />
              <button
                type="button"
                disabled={!i}
                onClick={() =>
                  setG((g) => [
                    ...g.slice(0, i - 1),
                    id,
                    g[i - 1],
                    ...g.slice(i + 1),
                  ])
                }
              >
                Move earlier
              </button>
              <button
                type="button"
                onClick={() => setG((g) => g.filter((x) => x !== id))}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        {kind === "apartment" && (
          <>
            <h3>Floor plan</h3>
            {floor && (
              <>
                <Photo id={floor} />
                <button type="button" onClick={() => setFloor("")}>
                  Remove floor plan
                </button>
              </>
            )}
            <Upload multiple={false} onUpload={setFloor} />
          </>
        )}
        <button
          type="button"
          onClick={(e) =>
            setPreview(
              values(Object.fromEntries(new FormData(e.currentTarget.form!))),
            )
          }
        >
          Preview listing
        </button>
      </FormAction>
      {preview && (
        <>
          <h2>Listing preview</h2>
          <Detail item={preview} preview />
        </>
      )}
    </>
  );
}
function Listings({ kind }: { kind: string }) {
  const [page, set] = useState(0),
    [query, setQuery] = useState(""),
    [edit, setEdit] = useState<Listing | "new" | null>(null),
    [version, refresh] = useState(0);
  const r = useData(
    "/manage/listings?kind=" + kind + "&page=" + page + "&" + query,
    version,
  );
  if (edit)
    return (
      <Editor
        kind={kind}
        item={edit === "new" ? undefined : edit}
        close={() => {
          setEdit(null);
          refresh(version + 1);
        }}
      />
    );
  return (
    <>
      <h2>
        {kind === "design" ? "Construction designs" : "Apartment listings"}
      </h2>
      <button onClick={() => setEdit("new")}>Add {kind}</button>
      <form
        className="filters"
        onSubmit={(e) => {
          e.preventDefault();
          set(0);
          setQuery(
            new URLSearchParams(
              new FormData(e.currentTarget) as any,
            ).toString(),
          );
        }}
      >
        <Input name="search" label="Search" />
        <label>
          Status
          <select name="status">
            <option value="">All</option>
            {["draft", "published", "archived"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <Select
          name="sort"
          label="Sort"
          values={["newest", "title", "price"]}
        />
        <button>Filter</button>
      </form>
      {r.data ? (
        <>
          {!r.data.items.length && <p>No listings match this view.</p>}
          {r.data.items.map((x) => (
            <div className="row" key={x.id}>
              <span>
                {x.title} · {x.status}
              </span>
              <button onClick={() => setEdit(x)}>Edit</button>
            </div>
          ))}
          <Pager page={page} set={set} more={r.data.more} />
        </>
      ) : (
        <Feedback error={r.error} />
      )}
    </>
  );
}
function Media() {
  const [page, set] = useState(0),
    [v, refresh] = useState(0),
    r = useData("/manage/media?page=" + page, v);
  return (
    <>
      <h2>Media library</h2>
      <Upload onUpload={() => refresh((x) => x + 1)} />
      {r.data ? (
        <>
          <div className="cards">
            {r.data.slice(0, 20).map((m) => (
              <article key={m.id}>
                <Photo id={m.id} />
                <p>
                  {m.width} × {m.height}
                </p>
                <FormAction
                  label="Delete unused image"
                  submit={() => api("/manage/media/" + m.id, "DELETE", {})}
                  onDone={() => refresh(v + 1)}
                >
                  {null}
                </FormAction>
              </article>
            ))}
          </div>
          {!r.data.length && <p>No uploaded images yet.</p>}
          <Pager page={page} more={r.data.length > 20} set={set} />
        </>
      ) : (
        <Feedback error={r.error} />
      )}
    </>
  );
}
function Leads() {
  const [page, set] = useState(0),
    [q, filter] = useState(""),
    [v, refresh] = useState(0),
    r = useData("/manage/enquiries?page=" + page + "&" + q, v);
  return (
    <>
      <h2>Enquiries and requests</h2>
      <form
        className="filters"
        onSubmit={(e) => {
          e.preventDefault();
          filter(
            new URLSearchParams(
              new FormData(e.currentTarget) as any,
            ).toString(),
          );
          set(0);
        }}
      >
        <Input name="search" label="Search name, phone or listing" />
        <Select
          name="kind"
          label="Request type"
          values={["", "contact", "enquiry", "visit", "booking"]}
        />
        <Select
          name="status"
          label="Status"
          values={["", "new", "in_progress", "closed"]}
        />
        <button>Filter</button>
      </form>
      {r.data ? (
        <>
          {r.data.items.map((l) => (
            <details key={l.id}>
              <summary>
                {l.name} · {l.kind} · {l.status}
              </summary>
              <p>
                {l.phone} · {l.title} {l.requested_date?.slice(0, 10)}
              </p>
              <p>{l.message}</p>
              <FormAction
                submit={(b) => api("/manage/enquiries/" + l.id, "PATCH", b)}
                onDone={() => refresh(v + 1)}
              >
                <Select
                  name="status"
                  label="Status"
                  values={["new", "in_progress", "closed"]}
                  value={l.status}
                />
                <label>
                  Internal notes
                  <textarea name="notes" defaultValue={l.notes} />
                </label>
              </FormAction>
            </details>
          ))}
          {!r.data.items.length && <p>No matching requests.</p>}
          <Pager page={page} more={r.data.more} set={set} />
        </>
      ) : (
        <Feedback error={r.error} />
      )}
    </>
  );
}
function Customers() {
  const [page, set] = useState(0),
    r = useData("/manage/customers?page=" + page);
  return (
    <>
      <h2>Registered customers</h2>
      {r.data ? (
        <>
          {r.data.slice(0, 20).map((c, i) => (
            <p key={i}>
              {c.name || "Customer"} · Mobile ending {c.phone_ending} ·{" "}
              {new Date(c.created_at).toLocaleDateString("en-IN")}
            </p>
          ))}
          {!r.data.length && <p>No registered customers yet.</p>}
          <Pager page={page} more={r.data.length > 20} set={set} />
        </>
      ) : (
        <Feedback error={r.error} />
      )}
    </>
  );
}
function Setting({ name, entry }: { name: string; entry: any }) {
  const [image, set] = useState(entry?.media_id || "");
  return (
    <details>
      <summary>{name}</summary>
      <FormAction
        submit={(b) =>
          api("/manage/settings/" + name, "PUT", { ...b, media_id: image })
        }
      >
        <label>
          {name === "social" ? "HTTPS social profile URL" : "Website text"}
          <textarea name="value" defaultValue={entry?.value || ""} />
        </label>
        {name === "hero" && (
          <>
            {image && <Photo id={image} />}
            <Upload onUpload={set} multiple={false} />
            <ImagePicker select={set} />
            <button type="button" onClick={() => set("")}>
              Clear image
            </button>
          </>
        )}
      </FormAction>
    </details>
  );
}
function Content() {
  const r = useData("/settings");
  return (
    <>
      <h2>Website content</h2>
      {r.data ? (
        ["hero", "company", "contact", "banner", "social", "testimonial"].map(
          (k) => (
            <Setting key={k} name={k} entry={r.data.find((x) => x.key === k)} />
          ),
        )
      ) : (
        <Feedback error={r.error} />
      )}
    </>
  );
}
const adminSections = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Apartments", icon: Building2 },
  { name: "Designs", icon: PencilRuler },
  { name: "Media", icon: Image },
  { name: "Enquiries", icon: Mail },
  { name: "Customers", icon: Users },
  { name: "Content", icon: Settings2 },
  { name: "Security", icon: Shield },
];

export default function Admin({ user }: { user: any }) {
  const [tab, set] = useState("Overview");
  if (user?.role !== "admin")
    return (
      <LoginForm admin onSuccess={() => location.assign("/admin/dashboard")} />
    );
  return (
    <div className="admin-page">
      <h1>Administration</h1>
      <div className="admin-layout">
        <nav className="tabs" aria-label="Administration">
          {adminSections.map(({ name, icon: Icon }) => (
            <button
              type="button"
              aria-pressed={name === tab}
              key={name}
              onClick={() => set(name)}
            >
              <Icon size={18} aria-hidden="true" /> {name}
            </button>
          ))}
        </nav>
        <div className="admin-panel">
          {tab === "Overview" ? (
            <Overview />
          ) : tab === "Apartments" || tab === "Designs" ? (
            <Listings
              key={tab}
              kind={tab === "Designs" ? "design" : "apartment"}
            />
          ) : tab === "Media" ? (
            <Media />
          ) : tab === "Customers" ? (
            <Customers />
          ) : tab === "Enquiries" ? (
            <Leads />
          ) : tab === "Content" ? (
            <Content />
          ) : (
            <>
              <h2>Account security</h2>
              <FormAction
                submit={(b) => api("/admin/password", "POST", b)}
                label="Change password"
                onDone={() => location.assign("/admin/login")}
              >
                <Input
                  name="current"
                  label="Current password"
                  type="password"
                  required
                />
                <Input
                  name="password"
                  label="New password (14–128 characters)"
                  type="password"
                  required
                />
              </FormAction>
              <FormAction
                submit={() => api("/logout", "POST", {})}
                label="Sign out"
                onDone={() => location.assign("/admin/login")}
              >
                {null}
              </FormAction>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
