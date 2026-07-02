# Custom Domain Setup Instructions

To connect your custom domain to our live website hosted at `fleuntpathspanish.ctonew.app`, you will need to update the DNS records with your domain provider (e.g., GoDaddy, Namecheap, Google Domains, Cloudflare).

Please follow these steps:

## Option 1: Pointing a Subdomain (Recommended)
If you want to use a subdomain like **www**.yourdomain.com:

1. **Log in** to your domain registrar's website.
2. **Navigate** to the DNS Settings / DNS Management page.
3. **Add a new record** with the following details:
   - **Type:** CNAME
   - **Name/Host:** `www`
   - **Value/Target:** `fleuntpathspanish.ctonew.app`
   - **TTL:** Default (or lowest available)
4. **Save** the record.

## Option 2: Pointing the Root Domain
If you want to use the root domain (e.g., yourdomain.com without the www):

1. **Log in** to your domain registrar's website.
2. **Navigate** to the DNS Settings / DNS Management page.
3. **Add an ALIAS or ANAME record** (if your provider supports CNAME flattening):
   - **Type:** ALIAS / ANAME (or CNAME if flattening is supported)
   - **Name/Host:** `@` (or leave blank depending on the provider)
   - **Value/Target:** `fleuntpathspanish.ctonew.app`
   - **TTL:** Default
4. **Save** the record.

*(Note: If your provider does not support ALIAS/ANAME records for the root domain, you may need to set up domain forwarding/redirecting from your root domain to the `www` version instead.)*

### What to Expect
After saving, DNS changes typically take anywhere from a few minutes up to 48 hours to fully propagate across the internet. Once the DNS has propagated, your custom domain will automatically route traffic to the live website.