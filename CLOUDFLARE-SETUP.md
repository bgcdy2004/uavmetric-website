# UAVMetric Cloudflare Deployment

This package is prepared for Cloudflare Workers Static Assets.

## Required Cloudflare configuration

1. Deploy this directory as a Cloudflare Worker/static-assets project.
2. Create a Cloudflare Turnstile widget for uavmetric.com.
3. Replace `YOUR_TURNSTILE_SITE_KEY` in index.html with the Turnstile site key.
4. Add the Turnstile secret to the Worker as secret:
   `TURNSTILE_SECRET_KEY`
5. Create/configure the email-delivery account and verify the sending domain.
6. Add the email API key to the Worker as secret:
   `RESEND_API_KEY`
7. Set Worker variable:
   `FORM_FROM_EMAIL` to a verified sender such as `UAVMetric Website <website@uavmetric.com>`.
8. Test the quote form on the temporary workers.dev deployment before attaching uavmetric.com.

Do not put secret keys directly in index.html, script.js, worker.js, or wrangler.jsonc.
