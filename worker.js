export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/quote" && request.method === "POST") {
      return handleQuote(request, env);
    }

    return env.ASSETS.fetch(request);
  }
};

async function handleQuote(request, env) {
  try {
    const form = await request.formData();

    const token = form.get("cf-turnstile-response");
    if (!token) return json({ error: "Please complete the security check." }, 400);

    const ip = request.headers.get("CF-Connecting-IP") || "";
    const verifyBody = new FormData();
    verifyBody.append("secret", env.TURNSTILE_SECRET_KEY);
    verifyBody.append("response", token);
    if (ip) verifyBody.append("remoteip", ip);

    const verifyResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: verifyBody }
    );
    const verification = await verifyResponse.json();

    if (!verification.success) {
  console.error("Turnstile verification failed:", verification["error-codes"]);
  return json({
    error: "Security verification failed. Please refresh the page and try again."
  }, 400);
}

    const services = form.getAll("service").filter(Boolean).join(", ") || "Not selected";
    const name = clean(form.get("name"));
    const company = clean(form.get("company")) || "Not provided";
    const email = clean(form.get("email"));
    const phone = clean(form.get("phone")) || "Not provided";
    const location = clean(form.get("location"));
    const siteSize = clean(form.get("site_size")) || "Not provided";
    const timeline = clean(form.get("timeline")) || "Not provided";
    const message = clean(form.get("message"));
    const references = form.get("reference_files") ? "Yes" : "No";

    if (!name || !email || !location || !message) {
      return json({ error: "Please complete all required fields." }, 400);
    }

    const text = `New UAVMetric Quote Request

Name: ${name}
Company / Organization: ${company}
Email: ${email}
Phone: ${phone}

Service(s): ${services}
Project Location: ${location}
Approximate Site Size: ${siteSize}
Desired Timeline: ${timeline}
Reference Files Available: ${references}

Project Description:
${message}`;

    const mail = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: env.FORM_FROM_EMAIL,
        to: ["Cody@uavmetric.com"],
        reply_to: email,
        subject: `UAVMetric Quote Request - ${name}`,
        text
      })
    });

    if (!mail.ok) {
      console.error("Email provider error:", await mail.text());
      return json({ error: "We couldn't deliver the request. Please email Cody@uavmetric.com." }, 502);
    }

    return json({ ok: true }, 200);
  } catch (error) {
    console.error(error);
    return json({ error: "Unable to process the request right now." }, 500);
  }
}

function clean(value) {
  return String(value || "").trim().slice(0, 10000);
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}
