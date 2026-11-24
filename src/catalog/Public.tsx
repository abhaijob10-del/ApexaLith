import React, { useState } from "react";
import { api } from "../services/api";
import {
  Card,
  Feedback,
  FormAction,
  Input,
  Listing,
  Pager,
  Photo,
  money,
  useData,
} from "./shared";
import { LoginForm } from "../components/AuthModal";

export function Browse({ kind }: { kind: string }) {
  const [filter, setFilter] = useState(""),
    [page, setPage] = useState(0);
  const result = useData(
    "/listings?kind=" + kind + "&page=" + page + "&" + filter,
  );
  return (
    <section>
      <h1>{kind === "design" ? "Construction designs" : "Apartments"}</h1>
      <form
        className="filters"
        onSubmit={(e) => {
          e.preventDefault();
          setPage(0);
          setFilter(
            new URLSearchParams(
              new FormData(e.currentTarget) as any,
            ).toString(),
          );
        }}
      >
        <Input name="search" label="Search name or location" />
        {kind === "apartment" && (
          <>
            <Input name="bhk" label="BHK" type="number" />
            <Input name="maxPrice" label="Maximum price (₹)" type="number" />
            <label>
              Availability
              <select name="availability">
                <option value="">All</option>
                {["available", "reserved", "sold"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
          </>
        )}
        <label>
          Sort by
          <select name="sort">
            <option value="newest">Newest first</option>
            <option value="price">Price</option>
            <option value="title">Name</option>
          </select>
        </label>
        <button>Apply filters</button>
      </form>
      {!result.data ? (
        <Feedback error={result.error} />
      ) : (
        <>
          {!result.data.items.length && (
            <p>
              No matching {kind === "design" ? "designs" : "apartments"}.{" "}
              <a href="/contact">Contact the studio</a>
            </p>
          )}
          <div className="cards">
            {result.data.items.map((item: Listing) => (
              <Card item={item} key={item.id} />
            ))}
          </div>
          <Pager page={page} more={result.data.more} set={setPage} />
        </>
      )}
    </section>
  );
}
export function RequestForm({ item, user }: { item?: Listing; user?: any }) {
  const [kind, setKind] = useState(item ? "enquiry" : "contact"),
    [done, setDone] = useState(false);
  if (done)
    return (
      <p role="status">
        Your request has been received. The team will follow up using your
        contact details.
      </p>
    );
  return (
    <FormAction
      label="Send request"
      submit={(b) =>
        api("/enquiries", "POST", { ...b, kind, listing_id: item?.id })
      }
      onDone={() => setDone(true)}
    >
      {item && (
        <label>
          Request type
          <select value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="enquiry">Property enquiry</option>
            <option value="visit">Site visit</option>
            {item.kind === "apartment" && item.availability === "available" && (
              <option value="booking">Booking enquiry</option>
            )}
          </select>
        </label>
      )}
      {["visit", "booking"].includes(kind) && !user && (
        <p>
          <a href={"/account?return=" + encodeURIComponent(location.pathname)}>
            Sign in
          </a>{" "}
          to submit this request.
        </p>
      )}
      <Input name="name" label="Name" value={user?.name} required />
      <Input
        name="phone"
        label="Indian mobile number"
        value={user?.phone}
        type="tel"
        required
      />
      {kind === "visit" && (
        <Input
          name="requested_date"
          label="Preferred visit date"
          type="date"
          required
        />
      )}
      <label>
        Message
        <textarea
          name="message"
          required={kind === "contact"}
          maxLength={3000}
        />
      </label>
      {kind === "booking" && (
        <p>
          This is a non-binding request. The team will confirm availability.
        </p>
      )}
      <small>
        We use these details to respond to your request.{" "}
        <a href="/privacy">Privacy policy</a>
      </small>
    </FormAction>
  );
}
export function Detail({
  item,
  user,
  preview = false,
}: {
  item: Listing;
  user?: any;
  preview?: boolean;
}) {
  const [msg, setMsg] = useState("");
  return (
    <section>
      <small>
        {item.kind === "apartment" ? "Apartment" : "Construction design"} ·{" "}
        {item.location || item.category}
      </small>
      <h1>{item.title}</h1>
      {item.gallery[0] && (
        <div className="cover">
          <Photo id={item.gallery[0]} alt={item.title} large />
        </div>
      )}
      <div className="split">
        <div>
          <h2>{money(item.price_inr)}</h2>
          <p className="prose">{item.description}</p>
          <dl>
            {Object.entries({
              BHK: item.bhk,
              "Carpet area (sq ft)": item.carpet_sqft,
              "Construction status": item.construction_status,
              Availability: item.availability,
              "RERA registration": item.rera,
              Specifications: item.specifications,
              Amenities: item.amenities.join(", "),
            })
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
          </dl>
          {item.floor_plan_id && (
            <>
              <h2>Floor plan</h2>
              <Photo id={item.floor_plan_id} alt="Floor plan" large />
            </>
          )}
          {item.gallery.slice(1).map((id, i) => (
            <Photo
              key={id}
              id={id}
              alt={item.title + " gallery image " + (i + 2)}
            />
          ))}
          {!preview &&
            item.kind === "apartment" &&
            (user?.role === "customer" ? (
              <button
                onClick={async () => {
                  try {
                    await api("/saved/" + item.id, "PUT", {});
                    setMsg("Saved to your account.");
                  } catch (e) {
                    setMsg((e as Error).message);
                  }
                }}
              >
                Save apartment
              </button>
            ) : (
              <a
                href={
                  "/account?return=" + encodeURIComponent(location.pathname)
                }
              >
                Sign in to save apartment
              </a>
            ))}
          <p role="status">{msg}</p>
        </div>
        {!preview && (
          <aside>
            <h2>Enquire</h2>
            <RequestForm item={item} user={user} />
          </aside>
        )}
      </div>
    </section>
  );
}
export function ListingPage({
  slug,
  kind,
  user,
}: {
  slug: string;
  kind: string;
  user: any;
}) {
  const r = useData<Listing>("/listings/" + encodeURIComponent(slug));
  React.useEffect(() => {
    if (r.data) document.title = r.data.title + " | ApexaLith";
  }, [r.data]);
  return r.data ? (
    r.data.kind === kind ? (
      <Detail item={r.data} user={user} />
    ) : (
      <h1>Listing unavailable</h1>
    )
  ) : (
    <Feedback error={r.error} />
  );
}
export function Account({ user }: { user: any }) {
  if (!user)
    return (
      <LoginForm
        onSuccess={() => {
          const target =
            new URLSearchParams(location.search).get("return") || "/account";
          location.assign(
            /^\/(apartments|designs)\/[a-z0-9-]+$/.test(target)
              ? target
              : "/account",
          );
        }}
      />
    );
  return (
    <>
      <h1>Your account</h1>
      <p>{user.phone || user.email}</p>
      {user.role === "customer" ? (
        <>
          <FormAction submit={(b) => api("/profile", "PATCH", b)}>
            <Input name="name" label="Your name" required value={user.name} />
          </FormAction>
          <Saved />
        </>
      ) : (
        <a href="/admin/dashboard">Open dashboard</a>
      )}
      <FormAction
        label="Sign out"
        submit={() => api("/logout", "POST", {})}
        onDone={() => location.assign("/")}
      >
        {null}
      </FormAction>
    </>
  );
}
function Saved() {
  const [version, set] = useState(0),
    r = useData<Listing[]>("/saved", version);
  return (
    <>
      <h2>Saved apartments</h2>
      {r.data ? (
        <div className="cards">
          {r.data.length === 0 && (
            <p>Your saved apartments will appear here.</p>
          )}
          {r.data.map((item) => (
            <article key={item.id}>
              <Card item={item} />
              <FormAction
                label="Remove from saved"
                submit={() => api("/saved/" + item.id, "DELETE", {})}
                onDone={() => set(version + 1)}
              >
                {null}
              </FormAction>
            </article>
          ))}
        </div>
      ) : (
        <Feedback error={r.error} />
      )}
    </>
  );
}
