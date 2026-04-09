# Paw Masterpiece — Setup Guide

## Schritt 1: GitHub Repo erstellen
Auf github.com → New Repository → Name: `paw-masterpiece` (public oder private)

Dann im Terminal:
```bash
cd ~/paw-masterpiece
git init
git add .
git commit -m "Initial commit: Supabase edge functions"
git remote add origin https://github.com/AloeGmbH/paw-masterpiece.git
git push -u origin main
```

## Schritt 2: Lovable
1. Neues Projekt in Lovable erstellen
2. Den Lovable Prompt einfügen → Seite generieren lassen
3. Lovable → Settings → GitHub → mit `paw-masterpiece` Repo verbinden

## Schritt 3: Supabase Projekt
1. supabase.com → New Project
2. SQL Editor → `supabase/migrations/001_initial_schema.sql` ausführen
3. Storage → 2 Buckets erstellen:
   - `portrait-uploads` (private)
   - `generated-portraits` (public)

## Schritt 4: Supabase Secrets
Dashboard → Edge Functions → Manage Secrets:

| Secret | Wert |
|--------|------|
| `GEMINI_API_KEY` | Google AI Studio API Key |
| `STRIPE_SECRET_KEY` | `sk_live_...` (oder `sk_test_...` zum Testen) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (aus Stripe Dashboard) |
| `STRIPE_PRICE_DIGITAL` | Stripe Price ID für $29 |
| `STRIPE_PRICE_8X10` | Stripe Price ID für $59 |
| `STRIPE_PRICE_12X16` | Stripe Price ID für $79 |
| `STRIPE_PRICE_16X20` | Stripe Price ID für $109 |
| `SITE_URL` | `https://deine-domain.com` |

## Schritt 5: Edge Functions deployen
```bash
npx supabase login
npx supabase link --project-ref DEIN_PROJECT_REF
npx supabase functions deploy gemini-portrait-generate
npx supabase functions deploy stripe-checkout
npx supabase functions deploy stripe-webhook
```

## Schritt 6: Stripe einrichten
1. stripe.com → Products → 4 Produkte anlegen:
   - **Digital Download** → $29 → Price ID kopieren
   - **Canvas 8×10"** → $59 → Price ID kopieren
   - **Canvas 12×16"** → $79 → Price ID kopieren
   - **Canvas 16×20"** → $109 → Price ID kopieren
2. Webhooks → Add endpoint:
   - URL: `https://[supabase-project-ref].supabase.co/functions/v1/stripe-webhook`
   - Event: `checkout.session.completed`
   - Webhook Secret → in Supabase als `STRIPE_WEBHOOK_SECRET` eintragen

## Schritt 7: Lovable Environment Variables
Lovable → Settings → Environment Variables:
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## API Endpoints (für Lovable Frontend)
```
Generate Portrait:
POST https://[ref].supabase.co/functions/v1/gemini-portrait-generate
Body: { images: [{base64, mimeType}], style: "royal-renaissance", petName: "Bella" }

Stripe Checkout:
POST https://[ref].supabase.co/functions/v1/stripe-checkout
Body: { portraitId: "uuid", format: "12x16", petName: "Bella", style: "royal-renaissance" }
```

## Style IDs (für Frontend)
```
royal-renaissance | garden-party | steak-dinner | disco-king
champagne-oysters | space-odyssey | medieval-knight | paris-cafe
neon-noir | tropical-beach | warrior | 3d-cartoon
```
