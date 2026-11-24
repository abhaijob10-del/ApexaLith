import React, { useEffect, useState } from "react";
import { api } from "../services/api";
export type Listing = {
  id: string;
  kind: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  price_inr: string;
  bhk: string;
  carpet_sqft: string;
  amenities: string[];
  construction_status: string;
  rera: string;
  category: string;
  specifications: string;
  availability: string;
  featured: boolean;
  status: string;
  gallery: string[];
  floor_plan_id: string;
};
export function useData<T = any>(path: string, version = 0) {
  const [state, set] = useState<{ data?: T; error?: string; path: string }>({
    path: "",
  });
  useEffect(() => {
    let active = true;
    set({ path });
    api(path)
      .then((data) => {
        if (active) set({ data, path });
      })
      .catch((e) => {
        if (active) set({ error: e.message, path });
      });
    return () => {
      active = false;
    };
  }, [path, version]);
  return state.path === path ? state : { path };
}
export function Feedback({ error }: { error?: string }) {
  return error ? (
    <p role="alert" className="notice">
      {error}
    </p>
  ) : (
    <p role="status" className="loading-placeholder">Loading…</p>
  );
}
export function Photo({
  id,
  alt = "",
  large = false,
}: {
  id: string;
  alt?: string;
  large?: boolean;
}) {
  if (!id) return null;
  const url = "/api/v1/media/" + id;
  return (
    <img
      src={url + (large ? "" : "?w=480")}
      srcSet={url + "?w=480 480w, " + url + " 1600w"}
      sizes={large ? "100vw" : "(max-width: 640px) 100vw, 33vw"}
      alt={alt}
      loading={large ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
export const money = (value: string) =>
  value
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(Number(value))
    : "Price on request";
export function Card({ item }: { item: Listing }) {
  return (
    <article className="property">
      <a
        href={
          "/" +
          (item.kind === "design" ? "designs" : "apartments") +
          "/" +
          item.slug
        }
      >
        {item.gallery[0] && <Photo id={item.gallery[0]} alt={item.title} />}
        <div>
          <small>{item.location || item.category}</small>
          <h3>{item.title}</h3>
          <p>
            {item.bhk ? item.bhk + " BHK · " : ""}
            {money(item.price_inr)}
          </p>
        </div>
      </a>
    </article>
  );
}
export function Pager({
  page,
  more,
  set,
}: {
  page: number;
  more: boolean;
  set: (n: number) => void;
}) {
  return page || more ? (
    <nav aria-label="Pagination">
      <button type="button" disabled={!page} onClick={() => set(page - 1)}>
        Previous
      </button>{" "}
      <span>Page {page + 1}</span>{" "}
      <button type="button" disabled={!more} onClick={() => set(page + 1)}>
        Next
      </button>
    </nav>
  ) : null;
}
export function FormAction({
  children,
  submit,
  label = "Save",
  reset = false,
  onDone,
}: {
  children: React.ReactNode;
  submit: (data: any) => Promise<any>;
  label?: string;
  reset?: boolean;
  onDone?: () => void;
}) {
  const [busy, setBusy] = useState(false),
    [msg, setMsg] = useState("");
  return (
    <form
      className="apx-form"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        setBusy(true);
        setMsg("");
        try {
          await submit(Object.fromEntries(new FormData(form)));
          if (reset) form.reset();
          setMsg("Saved.");
          onDone?.();
        } catch (e) {
          setMsg((e as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      {children}
      <button disabled={busy}>{busy ? "Please wait…" : label}</button>
      <span role="status">{msg}</span>
    </form>
  );
}
export function Input({
  name,
  label,
  value = "",
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  value?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label>
      {label}
      <input
        name={name}
        defaultValue={value || ""}
        type={type}
        required={required}
        step={type === "number" ? "any" : undefined}
      />
    </label>
  );
}
