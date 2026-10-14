const test = require("node:test");
const assert = require("node:assert");
const B = require("../public/booking.js");

const d = { name: "Ana", service: "Weddings & Elopements", date: "2026-10-20", location: "Wailea", email: "a@b.com", message: "Sunset please" };

test("message includes all filled fields and skips empty ones", () => {
  const m = B.bookingMessage({ name: "Ana", service: "Travel Sessions" });
  assert.match(m, /Name: Ana/);
  assert.match(m, /Service: Travel Sessions/);
  assert.doesNotMatch(m, /Date:|Location:|Email:/);
});

test("whatsapp link strips non-digits and encodes text", () => {
  const url = B.whatsappLink("+1 (808) 555-1234", B.bookingMessage(d));
  assert.ok(url.startsWith("https://wa.me/18085551234?text="));
  assert.match(decodeURIComponent(url.split("text=")[1]), /Sunset please/);
});

test("mailto link has subject with service and date", () => {
  const url = B.mailtoLink("x@y.com", d);
  assert.ok(url.startsWith("mailto:x@y.com?subject="));
  assert.match(decodeURIComponent(url), /Booking request: Weddings & Elopements on 2026-10-20/);
});

test("date range formats without timezone shift", () => {
  assert.strictEqual(B.formatRange("2026-10-13", "2026-10-31"), "Oct 13 – Oct 31");
});

test("partner ref is sanitized and added to the message", () => {
  assert.strictEqual(B.readRef("?ref=kihei-surf<script>"), "kihei-surfscript");
  assert.strictEqual(B.readRef(""), "");
  assert.match(B.bookingMessage({ name: "A", service: "Surf Sessions", ref: "kihei-surf" }), /Referred by: kihei-surf/);
});

test("open-ended stop shows only the start date", () => {
  assert.strictEqual(B.formatRange("2026-11-05"), "From Nov 5");
});
