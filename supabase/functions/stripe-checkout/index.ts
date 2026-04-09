import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PRICE_IDS: Record<string, string> = {
  digital: Deno.env.get("STRIPE_PRICE_DIGITAL") || "",
  "8x10":  Deno.env.get("STRIPE_PRICE_8X10") || "",
  "12x16": Deno.env.get("STRIPE_PRICE_12X16") || "",
  "16x20": Deno.env.get("STRIPE_PRICE_16X20") || "",
};

const SITE_URL = Deno.env.get("SITE_URL") || "http://localhost:3000";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { portraitId, format, petName, style } = await req.json();

    if (!portraitId || !format) {
      throw new Error("portraitId and format are required");
    }

    const priceId = PRICE_IDS[format];
    if (!priceId) {
      throw new Error(`Unknown format: ${format}`);
    }

    const isDigital = format === "digital";
    const productName = petName
      ? `${petName}'s Portrait — ${formatLabel(format)}`
      : `Pet Portrait — ${formatLabel(format)}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { portraitId, format, style: style || "", petName: petName || "", type: isDigital ? "digital" : "print" },
      success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/create`,
      shipping_address_collection: isDigital ? undefined : {
        allowed_countries: ["DE","AT","CH","GB","US","CA","AU","FR","NL","BE","IT","ES","PT","SE","NO","DK","FI","PL"],
      },
    });

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("stripe-checkout error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function formatLabel(format: string): string {
  const labels: Record<string, string> = {
    digital: "Digital Download",
    "8x10":  'Canvas Print 8×10"',
    "12x16": 'Canvas Print 12×16"',
    "16x20": 'Canvas Print 16×20"',
  };
  return labels[format] || format;
}
