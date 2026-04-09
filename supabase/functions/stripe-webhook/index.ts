import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature!, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature failed:", err.message);
    return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { portraitId, format, type } = session.metadata || {};

    const { error } = await supabase
      .from("portraits")
      .update({
        paid: true,
        format,
        stripe_session_id: session.id,
        customer_email: session.customer_details?.email || null,
        shipping_address: type === "print" ? session.shipping_details : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", portraitId);

    if (error) {
      console.error("DB update error:", error.message);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    console.log(`Portrait ${portraitId} unlocked — format: ${format}`);
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
