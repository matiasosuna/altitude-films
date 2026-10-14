// Builds the booking request text and the WhatsApp / email links. No backend needed.
(function (root) {
  function formatRange(from, to) {
    const opts = { month: "short", day: "numeric", timeZone: "UTC" };
    const f = new Date(from + "T00:00:00Z").toLocaleDateString("en-US", opts);
    const t = new Date(to + "T00:00:00Z").toLocaleDateString("en-US", opts);
    return `${f} – ${t}`;
  }

  function bookingMessage(d) {
    return [
      `Hi! I'd like to book a shoot.`,
      `Name: ${d.name}`,
      `Service: ${d.service}`,
      d.date ? `Date: ${d.date}` : null,
      d.location ? `Location: ${d.location}` : null,
      d.email ? `Email: ${d.email}` : null,
      d.message ? `\n${d.message}` : null
    ].filter(Boolean).join("\n");
  }

  function whatsappLink(phone, text) {
    return `https://wa.me/${String(phone).replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
  }

  function mailtoLink(email, d) {
    const subject = `Booking request: ${d.service}${d.date ? " on " + d.date : ""}`;
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bookingMessage(d))}`;
  }

  const api = { formatRange, bookingMessage, whatsappLink, mailtoLink };
  if (typeof module !== "undefined") module.exports = api;
  else root.Booking = api;
})(this);
