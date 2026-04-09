const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!;
const GEMINI_MODEL = "gemini-2.5-flash-image";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ─── STYLE PROMPTS ────────────────────────────────────────────────────────────

const BASE_REQUIREMENTS = `
CRITICAL LIKENESS REQUIREMENTS:
- Preserve the EXACT appearance of the animal from the reference photo
- Same breed, same fur/feather/scale color and markings, same eye color
- The animal must be INSTANTLY RECOGNIZABLE as the same animal from the photo
- Paint the animal as a natural animal (not dressed in clothes, not standing upright)
  UNLESS the style explicitly requires a costume

ART STYLE (applies to ALL styles):
- Oil painting technique — museum quality, masterpiece level
- Visible painterly brushstrokes, rich color depth, classical lighting
- NOT photorealistic, NOT cartoonish, NOT digital-looking
- Result must look like a real oil painting worth hanging in a gallery
- Portrait orientation (2:3 ratio)
`;

function buildStylePrompt(style: string, petName?: string): string {
  const nameNote = petName ? `The subject's name is ${petName}. ` : "";

  switch (style) {

    case "royal-renaissance":
      return `${nameNote}Create a hyper-realistic royal oil painting portrait in the style of 17th century European court painters (Rembrandt, Van Dyck, Velázquez).

SCENE & SETTING:
- The animal is seated or resting regally on an ornate velvet throne or cushioned chair
- Background: dark warm interior — deep burgundy velvet drapes, subtle golden candlelight
- Dark atmospheric background fading to near-black at edges (Rembrandt style)

ROYAL COSTUME:
- A magnificent ermine-trimmed royal cloak draped over the animal's back
- Deep wine red or royal purple velvet with ermine white fur trim (black spots on white)
- A simple elegant gold chain or medallion necklace
- The animal's face and front are uncovered and fully visible

LIGHTING:
- Classic Rembrandt chiaroscuro — single warm golden light from upper-left
- Face and chest brightly illuminated, deep soft shadows on sides
- Rich golden fur highlights, small bright catchlight in eyes

${BASE_REQUIREMENTS}`;

    case "garden-party":
      return `${nameNote}Create a beautiful impressionist oil painting portrait in the style of Monet, Renoir, and the English garden painters.

SCENE & SETTING:
- Lush English garden in full summer bloom — roses, peonies, lavender, wild florals
- The animal resting elegantly among the flowers or on a soft garden bench
- Dappled afternoon sunlight filtering through leaves

ATMOSPHERE:
- Warm, romantic, golden afternoon light
- Loose, visible impressionist brushwork especially in background and flowers
- The animal is the sharp focal point, flowers softly blurred behind

LIGHTING:
- Warm soft afternoon sunlight, slightly from above
- Gentle golden highlights on fur, bright lively catchlight in eyes

${BASE_REQUIREMENTS}`;

    case "steak-dinner":
      return `${nameNote}Create a humorous yet beautiful oil painting of the animal seated at an elegant fine dining restaurant table.

SCENE & SETTING:
- White linen tablecloth, fine crystal wine glasses, silver cutlery
- A perfectly presented gourmet steak dinner on the plate in front
- Candles in elegant holders, dark intimate restaurant interior
- The animal seated AT the table in an upright dignified position

ATMOSPHERE:
- Warm, intimate candlelight — golden glow on everything
- The humor comes from the animal's serious, dignified expression in this fancy setting

LIGHTING:
- Warm candlelight as primary source — golden, intimate glow
- Catchlight in the animal's eyes from the candle flame

${BASE_REQUIREMENTS}`;

    case "disco-king":
      return `${nameNote}Create a vibrant, fun oil painting portrait of the animal as the king/queen of the disco dancefloor.

SCENE & SETTING:
- Dazzling disco ball above, casting rainbow light reflections everywhere
- Neon colored lights — electric purple, hot pink, electric blue, golden yellow
- Glittery dancefloor with mirror tiles, Studio 54 / 1970s-80s atmosphere

ATMOSPHERE:
- High energy, fun, celebratory — painted in oil painting style
- Rainbow light reflections from disco ball dotting the animal's fur
- Deep dark background making the neon lights pop dramatically

LIGHTING:
- Multiple colored light sources — neon pinks, purples, electric blues
- Disco ball reflections as small bright dots of light scattered on fur

${BASE_REQUIREMENTS}`;

    case "champagne-oysters":
      return `${nameNote}Create a luxurious oil painting portrait of the animal on a private yacht at golden hour.

SCENE & SETTING:
- Elegant yacht deck — polished teak wood, gleaming white railing
- Ocean horizon in background, warm golden sunset sky
- Champagne bottle in ice bucket, oysters on silver platter nearby
- The animal resting regally on a cream cushioned deck chair

ATMOSPHERE:
- Pure luxury — warm golden hour light, oceanic freshness
- Rich golden and amber tones dominate the palette

LIGHTING:
- Warm golden sunset light bathing everything in amber and gold
- Rich golden highlights on fur, warm catchlight in eyes

${BASE_REQUIREMENTS}`;

    case "space-odyssey":
      return `${nameNote}Create an epic, cinematic oil painting of the animal as an astronaut floating in deep space.

SCENE & SETTING:
- The animal wearing a realistic NASA-style white spacesuit
- Deep space background — stunning nebula with purple, blue, and gold cosmic clouds
- Stars scattered across background, a distant planet or moon visible
- Floating weightlessly in the cosmos, confident and heroic

ATMOSPHERE:
- Epic, cinematic, awe-inspiring
- Deep navy, cosmic purple, nebula gold — richly painted background

LIGHTING:
- Dramatic space lighting — strong directional light from a nearby star
- Deep dark space shadows, brilliant white highlights on the spacesuit

${BASE_REQUIREMENTS}`;

    case "medieval-knight":
      return `${nameNote}Create a dramatic, epic oil painting of the animal as a noble medieval knight.

SCENE & SETTING:
- The animal wearing detailed medieval plate armour — polished steel with decorative engravings
- Castle great hall behind — torches burning on stone walls, heraldic banners hanging
- A shield with a coat of arms visible

COSTUME:
- Detailed plate armour fitting the animal's body (fantasy realism)
- A flowing cape — rich heraldic colors (royal blue, crimson, gold)

LIGHTING:
- Warm torchlight from multiple wall sconces
- Dramatic flickering light on armour — bright metallic reflections, deep shadows

${BASE_REQUIREMENTS}`;

    case "paris-cafe":
      return `${nameNote}Create a charming, romantic oil painting of the animal at a classic Parisian sidewalk café.

SCENE & SETTING:
- Classic Parisian bistro table — small round table, rattan chair
- A café crème and fresh croissant on the table
- The Eiffel Tower softly visible in warm distance behind
- Warm Parisian morning light, cobblestone boulevard

ATMOSPHERE:
- Warm, romantic, golden morning Parisian light
- Impressionist brushwork in background — blurred city movement

LIGHTING:
- Warm Parisian morning sunlight from the side
- Golden light on croissant, warm highlights on fur

${BASE_REQUIREMENTS}`;

    case "neon-noir":
      return `${nameNote}Create a moody, cinematic oil painting in a film noir meets neon-lit city night style.

SCENE & SETTING:
- Rain-slicked dark city street at night
- Neon signs reflected on wet pavement — electric blues, reds, pinks
- The animal under a street lamp or in a doorway
- Dark alleyway, vintage lamp posts, wet cobblestones

ATMOSPHERE:
- Deep mystery, cinematic tension
- Heavy contrast between deep shadows and bright neon colors
- The animal looks cool and mysterious, like a film noir detective

LIGHTING:
- Multiple neon light sources — electric blues, reds, and pinks
- One key light on the animal's face (street lamp or neon sign)

${BASE_REQUIREMENTS}`;

    case "tropical-beach":
      return `${nameNote}Create a vibrant, sunny oil painting portrait of the animal on a paradise tropical beach.

SCENE & SETTING:
- Perfect white sand beach, crystal-clear turquoise water behind
- Swaying palm trees, lush tropical vegetation
- The animal lounging on the beach or in a hammock between palm trees
- Bright tropical flowers, a coconut drink nearby

ATMOSPHERE:
- Pure joy, sunshine, warmth — vacation paradise
- Rich tropical colors — turquoise sea, white sand, vivid green palms

LIGHTING:
- Bright warm tropical sunshine, strong light and soft shadow
- Bright happy catchlight in eyes reflecting the blue sky

${BASE_REQUIREMENTS}`;

    case "warrior":
      return `${nameNote}Create an epic, heroic oil painting portrait of the animal as an ancient legendary warrior.

SCENE & SETTING:
- The animal in impressive ancient warrior armour — Greek, Roman, Viking, or fantasy
- Epic dramatic sky — dark storm clouds breaking, golden light piercing through
- Battlefield or mountain pass in distant background

COSTUME:
- Detailed ancient armour: bronze breastplate, helmet (pushed back to show face)
- A flowing battle-worn cape — deep crimson or royal blue

LIGHTING:
- Dramatic epic lighting — golden rays breaking through dark storm clouds
- Strong directional light, deep shadows and bright heroic highlights

${BASE_REQUIREMENTS}`;

    case "3d-cartoon":
      return `${nameNote}Create a beautiful 3D animated style portrait of the animal in the style of Pixar and Disney animated films.

STYLE NOTE: This style is the EXCEPTION — instead of a classical oil painting, create a high-quality 3D CGI render that looks like it came directly from a Pixar or Disney movie.

SCENE & SETTING:
- Clean, colorful background — soft gradient or simplified cheerful environment
- The animal rendered in Pixar-quality 3D
- Big expressive eyes (Pixar-style — large, shiny, full of personality)
- Soft rounded proportions — adorable and charming

ATMOSPHERE:
- Pure joy, warmth, and charm
- Vibrant saturated colors — the animal's natural colors richly enhanced
- Perfect studio lighting — key light, fill light, rim light

IMPORTANT: Preserve the animal's actual colors, markings, and breed — rendered in Pixar 3D style.`;

    default:
      return `${nameNote}Create a beautiful classical oil painting portrait of the animal in the style of 17th century European masters. Timeless setting, dramatic Rembrandt-style lighting, museum quality.

${BASE_REQUIREMENTS}`;
  }
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { images, style, petName } = body;

    if (!images || images.length === 0) {
      throw new Error("No images provided");
    }
    if (!style) {
      throw new Error("No style provided");
    }

    const prompt = buildStylePrompt(style, petName);

    let outputBase64: string | null = null;
    let outputMimeType = "image/png";

    for (let attempt = 0; attempt < 3; attempt++) {
      const temperature = attempt === 0 ? 0.7 : 0.4;

      const parts: any[] = [{ text: prompt }];
      for (const img of images) {
        parts.push({
          inlineData: {
            mimeType: img.mimeType || "image/jpeg",
            data: img.base64,
          },
        });
      }

      const requestBody = {
        contents: [{ parts }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
          temperature,
        },
      };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const err = await response.text();
        console.error(`Attempt ${attempt + 1} API error:`, err);
        if (attempt < 2) continue;
        throw new Error(`Gemini API error: ${err}`);
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      const finishReason = candidate?.finishReason || "none";
      const textParts = (candidate?.content?.parts || [])
        .filter((p: any) => p.text)
        .map((p: any) => p.text)
        .join(" ");

      for (const part of candidate?.content?.parts || []) {
        const imageData = part.inlineData || part.inline_data;
        if (imageData?.data) {
          outputBase64 = imageData.data;
          outputMimeType = imageData.mimeType || imageData.mime_type || "image/png";
          break;
        }
      }

      if (outputBase64) break;

      console.warn(`Attempt ${attempt + 1}: No image. finishReason=${finishReason}, text="${textParts.substring(0, 200)}"`);
    }

    if (!outputBase64) {
      throw new Error("No image generated after 3 attempts");
    }

    return new Response(
      JSON.stringify({ image: outputBase64, mimeType: outputMimeType }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("gemini-portrait-generate error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
