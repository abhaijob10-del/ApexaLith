import assert from "node:assert/strict";
import sharp from "sharp";
export async function verifyCatalog(request, base, admin, customer) {
  const image = await sharp({
    create: { width: 32, height: 32, channels: 3, background: "#afa198" },
  })
    .png()
    .toBuffer();
  async function upload(buffer) {
    const data = new FormData();
    data.append("image", new Blob([buffer]), "test.png");
    return fetch(base + "/api/v1/manage/media", {
      method: "POST",
      headers: { Cookie: admin },
      body: data,
    });
  }
  assert.equal((await upload(Buffer.from("invalid"))).status, 400);
  const media = await upload(image);
  assert.equal(media.status, 201);
  const imageId = (await media.json()).id;
  assert.equal((await request("v1/media/" + imageId)).status, 404);
  const listing = {
    kind: "apartment",
    title: "QA apartment",
    slug: "qa-apartment",
    location: "Bengaluru",
    description: "QA only",
    amenities: [],
    availability: "available",
    status: "draft",
    gallery: [imageId],
  };
  const create = await request("v1/manage/listings", "POST", listing, admin);
  assert.equal(create.status, 200);
  const { id } = await create.json();
  assert.equal((await request("v1/listings/qa-apartment")).status, 404);
  listing.status = "published";
  assert.equal(
    (await request("v1/manage/listings/" + id, "PUT", listing, admin)).status,
    200,
  );
  assert.equal(
    (
      await (
        await request("v1/listings?search=Bengaluru&kind=apartment")
      ).json()
    ).items.length,
    1,
  );
  assert.equal(
    (await request("v1/media/" + imageId + "?w=480")).headers.get(
      "content-type",
    ),
    "image/webp",
  );
  assert.equal(
    (await request("v1/manage/media/" + imageId, "DELETE", {}, admin)).status,
    409,
  );
  assert.equal(
    (await request("v1/saved/" + id, "PUT", {}, customer)).status,
    204,
  );
  assert.equal(
    (await (await request("v1/saved", "GET", null, customer)).json()).length,
    1,
  );
  for (const kind of ["contact", "enquiry", "visit", "booking"]) {
    assert.equal(
      (
        await request(
          "v1/enquiries",
          "POST",
          {
            kind,
            name: "QA",
            phone: "+919000000001",
            listing_id: id,
            message: "QA",
            requested_date: "2099-12-01",
          },
          customer,
        )
      ).status,
      201,
    );
  }
  const leads = await (
    await request("v1/manage/enquiries", "GET", null, admin)
  ).json();
  assert.equal(leads.items.length, 4);
  assert.equal(
    (
      await request(
        "v1/manage/enquiries/" + leads.items[0].id,
        "PATCH",
        { status: "closed", notes: "QA" },
        admin,
      )
    ).status,
    204,
  );
  assert.equal(
    (await request("v1/manage/settings/company", "PUT", { value: "QA" }, admin))
      .status,
    204,
  );
  const design = await request(
    "v1/manage/listings",
    "POST",
    { ...listing, kind: "design", slug: "qa-design" },
    admin,
  );
  assert.equal(design.status, 200);
  const designId = (await design.json()).id;
  const alternate=await upload(image);
  assert.equal(alternate.status,201);
  const second=(await alternate.json()).id;
  for(const gallery of [[imageId,second],[second,imageId],[second]]) {
    assert.equal((await request('v1/manage/listings/'+designId,'PUT',{...listing,kind:'design',slug:'qa-design',gallery},admin)).status,200);
    const detail=await (await request('v1/listings/qa-design')).json();
    assert.deepEqual(detail.gallery,gallery);
  }
  for (const [key, record] of [
    [id, listing],
    [designId, { ...listing, kind: "design", slug: "qa-design" }],
  ]) {
    assert.equal(
      (
        await request(
          "v1/manage/listings/" + key,
          "PUT",
          { ...record, status: "archived", gallery: [] },
          admin,
        )
      ).status,
      200,
    );
  }
  assert.equal(
    (await request("v1/manage/media/" + imageId, "DELETE", {}, admin)).status,
    204,
  );
}
