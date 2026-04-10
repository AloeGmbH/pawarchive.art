const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!;
const GEMINI_MODEL = "gemini-2.5-flash-preview-05-20";
const SITE_URL = Deno.env.get("SITE_URL") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ─────────────────────────────────────────────────────────────────────────────
// STYLE PROMPTS — 18 styles matching companionarchive.com
// When hasReference=true, Gemini receives: [prompt] + [reference image] + [pet photo]
// The prompt instructs Gemini to use IMAGE 1 as scene/style blueprint and
// IMAGE 2 as the animal to paint into that scene.
// ─────────────────────────────────────────────────────────────────────────────

function buildStylePrompt(style: string, petName?: string, hasReference?: boolean): string {
  const name = petName ? `The subject's name is ${petName}. ` : "";
  const refNote = hasReference
    ? "You are given TWO images: IMAGE 1 is a STYLE REFERENCE — it defines the exact scene, background, furniture, props, lighting, color palette, and painting style. IMAGE 2 is the PET PHOTO — this is the animal to paint. Reproduce the scene from IMAGE 1 as closely as possible, replacing the animal in it with the animal from IMAGE 2 (preserve exact breed, fur color, markings, eye color). "
    : "";

  const basePrompt = buildBasePrompt(style, name);
  const anatomyNote = `

ANATOMY — CRITICAL: The animal has exactly the correct number of legs and paws for its species (4 legs for dogs and cats). Do NOT paint extra legs, extra paws, or duplicate limbs. Every leg must connect naturally to the body. If unsure, show only 2 front paws and keep the body partially covered by props or fabric.`;

  return refNote + basePrompt + anatomyNote;
}

function buildBasePrompt(style: string, name: string): string {
  switch (style) {

    // ── OLD MASTERS ──────────────────────────────────────────────────────────
    case "old-masters":
      return `${name}Create a museum-quality oil painting portrait in the style of 17th century Dutch and Flemish masters — Rembrandt, Vermeer, Velázquez.

SCENE: The animal sits on an antique wooden armchair with burgundy velvet upholstery. Behind it: dark brown damask wallpaper with a subtle pattern. The composition is a tight 3/4 bust portrait — show the head, chest, and front paws clearly. The animal sits naturally upright, looking slightly to one side with a dignified, composed expression. Keep the lower body minimal or cropped — do NOT show all four legs fully extended.

PAINTING STYLE: True old master oil painting. Deep, velvety dark background. Smooth luminous treatment on the face and fur. Visible brushwork on the chair and wallpaper. Warm earthy palette: deep browns, burgundy, gold ochre. The painting should look like it belongs in a museum.

LIGHTING: Rembrandt chiaroscuro — one warm golden light source from upper left. The face and near-side of the body are brilliantly illuminated. The far side falls into deep soft shadow. A clear bright catchlight in each eye.

ANIMAL LIKENESS — CRITICAL: Same breed, same fur color and markings, same eye color. Instantly recognizable as the same pet. No costume, no accessories — the animal's natural beauty is the portrait.

OUTPUT: 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── THE PORTRAIT LOUNGE ──────────────────────────────────────────────────
    case "portrait-lounge":
      return `${name}Create a luxurious, glamorous oil painting portrait of the animal reclining elegantly on a crimson velvet Chesterfield sofa — old-world glamour meets modern sophistication.

SCENE: The animal lounges regally on a deep crimson/ruby velvet tufted Chesterfield sofa. The background is a rich, warm interior — dark wood paneling or deep-toned wallpaper, perhaps a floor lamp casting warm amber light. The overall atmosphere is an elegant, private lounge or salon.

PAINTING STYLE: Rich, detailed oil painting with warm, saturated colors. Deep crimson and burgundy of the sofa dominate. The animal's fur is painted with luminous detail against the rich background.

LIGHTING: Warm, intimate interior lighting — soft amber from a nearby lamp, creating a cozy, exclusive atmosphere. Gentle highlights on the velvet and the animal's fur.

ANIMAL LIKENESS — CRITICAL: Preserve exact breed, fur color, markings, and eye color. The animal reclines naturally — no costume, just pure elegance.

OUTPUT: 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── THE LAZY SUNDAY ──────────────────────────────────────────────────────
    case "lazy-sunday":
      return `${name}Create a charming, warm oil painting portrait of the animal in full relaxation mode — sunglasses on, matching robe or soft blanket, the epitome of luxury leisure.

SCENE: The animal lounges in a plush armchair or on a bed, wearing oversized glamorous sunglasses and wrapped in or surrounded by a luxurious silk or velvet robe. A cup of coffee or tea and perhaps a magazine nearby. The setting is a beautifully decorated bedroom or morning room — soft light, warm colors.

PAINTING STYLE: Warm, inviting oil painting with soft, glowing colors. Creamy whites, warm peach tones, soft pastels. Painterly and charming — this should feel luxuriously cozy.

LIGHTING: Soft morning or afternoon window light — gentle, diffuse, warm. The animal is bathed in soft golden light. Everything feels peaceful and indulgent.

ANIMAL LIKENESS — CRITICAL: Preserve exact breed, fur color, markings, and eye color. The sunglasses rest naturally on the animal's face — change nothing else.

OUTPUT: 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── THE CLAWFOOT SPA ─────────────────────────────────────────────────────
    case "clawfoot-spa":
      return `${name}Create a delightful, luxurious oil painting portrait of the animal relaxing in a vintage pink clawfoot bathtub surrounded by spa luxury — pure pampered bliss.

SCENE: The animal sits or reclines in a beautiful vintage pink clawfoot bathtub filled with bubbles. Surrounding the tub: fluffy white towels, candles, perhaps a glass of champagne or a rubber duck, rose petals scattered on the floor. The bathroom is beautiful — tiled walls, warm lighting, an air of total luxury. The animal wears a small towel turban on its head or has cucumbers on its eyes.

PAINTING STYLE: Warm, charming oil painting — pinks, whites, creamy tones dominate. Soft, delicate treatment of the bubbles and the animal's expression. Playful yet refined.

LIGHTING: Warm, golden bathroom lighting — perhaps candlelight or soft lamp light. Everything glows warmly. The bubbles catch the light in small pearlescent highlights.

ANIMAL LIKENESS — CRITICAL: Preserve exact breed, fur color, markings, and eye color. Add only the spa props — change nothing about the animal's features.

OUTPUT: 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── THE OPEN ROAD ────────────────────────────────────────────────────────
    case "open-road":
      return `${name}Create a joyful, cinematic oil painting portrait of the animal hanging out of a car window — fur flying, eyes bright, pure unbridled happiness.

SCENE: The animal leans out of the open window of a vintage or modern car, face into the wind, ears back (if applicable), mouth open in a joyful expression. The background: a beautiful open road stretching into the distance — golden fields, blue sky, warm summer light. The car door and window frame the animal perfectly.

PAINTING STYLE: Warm, vibrant oil painting with a sense of movement and joy. Golden tones, bright blues, lush greens. The wind-blown fur is painted with energetic, flowing brushstrokes.

LIGHTING: Beautiful golden hour or bright daylight — warm, directional sunlight from the side. The animal's fur glows with warm highlights. Bright, joyful, full of life.

ANIMAL LIKENESS — CRITICAL: Preserve exact breed, fur color, markings, and eye color. Capture the joy and movement — this is the happiest portrait.

OUTPUT: 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── THE TEA PARTY ────────────────────────────────────────────────────────
    case "tea-party":
      return `${name}Create an enchanting, elegant impressionist oil painting portrait of the animal hosting an exquisite afternoon tea in a beautiful English rose garden.

SCENE: The animal is seated at a small garden table set with fine bone china — dainty teacups, a tiered cake stand with scones and petite fours, a silver teapot, fresh cut roses in a vase. The garden around is lush and blooming — roses climbing a trellis behind, hedgerows, dappled sunlight through leaves. The animal is the gracious host of this very proper affair.

PAINTING STYLE: Soft impressionist oil painting — loose, luminous brushstrokes in the background garden, more refined treatment on the animal and the tea table. Soft pinks, greens, warm whites. Reminiscent of a classic English garden painting.

LIGHTING: Beautiful dappled afternoon garden light — warm golden sunshine filtering through leaves. Soft shadows and bright highlights on the china and flowers.

ANIMAL LIKENESS — CRITICAL: Preserve exact breed, fur color, markings, and eye color. The animal sits naturally and elegantly — no costume.

OUTPUT: 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── THE HERITAGE PORTRAIT ────────────────────────────────────────────────
    case "heritage-portrait":
      return `${name}Create a dramatic, timeless oil painting portrait of the animal in the tradition of great 18th century portrait painting — noble, powerful, and immortalized in dramatic chiaroscuro light.

SCENE: The animal is posed against a very dark, almost black background — a classic portrait backdrop. The animal faces slightly to one side, a dignified and composed expression. No props, no costume — just the animal itself, perfectly lit, the sole focus of this masterpiece portrait.

PAINTING STYLE: Dramatic old master oil painting — deep, rich darkness of the background contrasting with brilliant illumination on the face. Visible, confident brushstrokes. Rich, deep color. This is a serious, timeless portrait.

LIGHTING: Pure Rembrandt lighting — a single, strong warm light source from upper left. One side of the face brilliantly illuminated, the other falls into deep, warm shadow. A small triangle of light on the shadowed cheek. Bright catchlights in both eyes.

ANIMAL LIKENESS — CRITICAL: Preserve exact breed, fur color, markings, and eye color. The animal's beauty and character are the entire subject — let it shine.

OUTPUT: 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── MIDNIGHT RANCH ───────────────────────────────────────────────────────
    case "midnight-ranch":
      return `${name}Create a moody, atmospheric oil painting portrait of the animal as a rugged western character under a dramatic midnight sky — cinematic, powerful, and deeply evocative.

SCENE: The animal is posed in a western landscape at night or deep dusk — a fence post, a barn in the distance, rolling prairie. The animal wears a worn cowboy hat or sits naturally in western surroundings. Above: a breathtaking midnight sky — deep navy blue, scattered stars, perhaps a full moon casting silver light across the landscape.

PAINTING STYLE: Dramatic, painterly western noir — deep blues and blacks of the night sky, warm amber lamplight or firelight illuminating the animal, silvery moonlight on the landscape. Moody and cinematic.

LIGHTING: Moonlight as the key light — cool, silvery, directional. A warm amber secondary light (lantern or fire) from one side creates beautiful contrast. Stars pinprick the deep blue sky. The overall effect is hauntingly beautiful.

ANIMAL LIKENESS — CRITICAL: Preserve exact breed, fur color, markings, and eye color. The dramatic night lighting tints the fur with blue and amber — this is correct.

OUTPUT: 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── HOWDY PARTNER ────────────────────────────────────────────────────────
    case "howdy-partner":
      return `${name}Create an irresistible, charming oil painting portrait of the animal peeking over a wooden fence in a cowboy hat — pure country charm and personality.

SCENE: The animal is peeking up over a rustic wooden fence or gate, front paws on the top rail, wearing a classic cowboy hat. Behind: a golden prairie or ranch scene — blue sky, golden fields, perhaps a barn in the distance. The composition is playful and adorable — just the animal's face and paws visible above the fence line.

PAINTING STYLE: Warm, charming oil painting with golden, sunlit tones. Rustic warm wood of the fence, golden fields, bright blue sky. Painted with warmth and personality.

LIGHTING: Beautiful golden hour sunshine — warm, directional, from the side. The cowboy hat casts a gentle shadow over the animal's face. The fence and fields glow with warm golden light.

ANIMAL LIKENESS — CRITICAL: Preserve exact breed, fur color, markings, and eye color. The cowboy hat rests naturally on the animal's head — change nothing else.

OUTPUT: 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── THE OYSTER HOUR ──────────────────────────────────────────────────────
    case "oyster-hour":
      return `${name}Create a sumptuous, glamorous oil painting portrait of the animal dining on fresh oysters and champagne — the very picture of sophisticated luxury.

SCENE: The animal is seated at an elegant marble table set with a platter of fresh oysters on ice with lemon wedges, a crystal flute of sparkling champagne, perhaps a small silver fork. The setting is a beautiful, intimate restaurant or terrace — warm lighting, elegant surroundings. The animal's expression is composed and supremely self-satisfied.

PAINTING STYLE: Rich, glamorous oil painting — cool marble whites, silver, golden champagne tones. The oysters gleam with moisture and light. The crystal glass catches brilliant highlights. Sophisticated and indulgent.

LIGHTING: Warm, intimate restaurant lighting — soft amber candlelight or low lamp light. The champagne glass sparkles. The oysters glisten. The animal's face is warmly illuminated.

ANIMAL LIKENESS — CRITICAL: Preserve exact breed, fur color, markings, and eye color. The animal sits elegantly at the table — no costume.

OUTPUT: 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── THE TOAST ────────────────────────────────────────────────────────────
    case "the-toast":
      return `${name}Create a charming, celebratory oil painting portrait of the animal raising a toast — a crystal glass lifted, an expression of utter smugness and self-congratulation.

SCENE: The animal holds or has a crystal wine or champagne glass raised in a toast. The setting is elegant — a fine dining table, a fireplace, or a beautiful interior. Perhaps other glasses in the background suggesting a celebration. The animal's expression is magnificently self-satisfied, as if it has just done something worthy of the greatest celebration.

PAINTING STYLE: Warm, celebratory oil painting — crystal glass sparkling with caught light, warm interior tones, rich and inviting. The palette is warm golds, deep reds, creamy whites.

LIGHTING: Warm interior lighting — candlelight or fireplace glow. The crystal glass refracts and catches the light brilliantly. The animal's face glows with warm, flattering light.

ANIMAL LIKENESS — CRITICAL: Preserve exact breed, fur color, markings, and eye color. The glass is positioned naturally — change nothing about the animal's actual features.

OUTPUT: 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── THE DISCO ROOM ───────────────────────────────────────────────────────
    case "disco-room":
      return `${name}Create a vibrant, electric oil painting portrait of the animal as the undisputed star of a 1970s disco — glittery, neon, impossibly fabulous.

SCENE: The animal poses front-and-center on a glittery disco dancefloor. Above: a massive rotating mirrored disco ball scatters hundreds of rainbow light reflections across everything. The background: dark club interior lit by electric neon lights — deep purples, hot pinks, electric blues. Blurred other dancers in the background. The animal has a glittery collar or jeweled accessory and radiates total star energy.

PAINTING STYLE: High-contrast, vibrant digital oil painting — deep dark background making the neon colors and disco ball reflections explode. Small circular light spots scatter across the animal's fur from the disco ball. Rich, saturated, electric color palette.

LIGHTING: Multiple colored neon sources — pinks, purples, blues — plus a golden spotlight from directly above. Disco ball scatters small bright dots of reflected light across everything. One side of the animal's face tinted pink/purple, the other blue — electric and alive.

ANIMAL LIKENESS — CRITICAL: Preserve exact breed, fur color, markings, and eye color. The neon tints on the fur are correct and add to the atmosphere.

OUTPUT: Square or 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── THE PIZZA PARTY ──────────────────────────────────────────────────────
    case "pizza-party":
      return `${name}Create a fun, colorful, joyful oil painting portrait of the animal at a festive pizza party — pure happiness, pure chaos, pure deliciousness.

SCENE: The animal is seated at a pizza party table — an open pizza box with a whole pizza (melted cheese, colorful toppings), perhaps a slice held in a paw or nearby. Soda cans, paper plates, streamers, maybe a birthday hat. The setting is cheerful and playful — a kitchen table or party setting covered in pizza fun.

PAINTING STYLE: Bright, fun, warm oil painting — vivid reds of the tomato sauce, golden melted cheese, colorful toppings. The setting is joyful and energetic. Painterly and warm.

LIGHTING: Bright, cheerful indoor or outdoor party lighting — warm, even, cheerful. Everything is well-lit and inviting. The cheese has a beautiful golden melt.

ANIMAL LIKENESS — CRITICAL: Preserve exact breed, fur color, markings, and eye color. The animal's expression is pure joy — this is a celebration.

OUTPUT: Square or 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── BATH TIME ────────────────────────────────────────────────────────────
    case "bath-time":
      return `${name}Create a hilarious, charming oil painting portrait of the animal enjoying an extremely luxurious bath — spa sunglasses, a cocktail, the works.

SCENE: The animal is in a bubble bath — surrounded by mountains of white bubbles. Wearing large, glamorous sunglasses. A martini glass or cocktail with an umbrella nearby. Perhaps rose petals floating in the water. The expression: total bliss, completely unbothered. This is the most relaxed animal in the world.

PAINTING STYLE: Fresh, bubbly, fun oil painting — whites and soft blues of the bubbles, perhaps pink rose petals, the sparkle of the cocktail glass. Charming and playful with a touch of elegance.

LIGHTING: Soft, warm bathroom lighting — candles or warm lamps. The bubbles have soft, pearlescent highlights. The cocktail glass sparkles. Everything glows warmly and peacefully.

ANIMAL LIKENESS — CRITICAL: Preserve exact breed, fur color, markings, and eye color. The sunglasses rest naturally on the face — change nothing about the animal's actual features.

OUTPUT: Square or 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── BEAUTY SLEEP ─────────────────────────────────────────────────────────
    case "beauty-sleep":
      return `${name}Create a serene, sumptuous oil painting portrait of the animal in the most luxurious slumber — silk sheets, satin pillows, eye mask, the very portrait of beauty rest.

SCENE: The animal sleeps peacefully on an enormous, impossibly luxurious bed — silk or satin sheets in soft ivory, champagne, or blush pink. Monogrammed pillowcases. Perhaps a silk eye mask. The animal is completely at peace, elegantly arranged, taking the most important beauty rest of its life.

PAINTING STYLE: Soft, dreamy oil painting — silky, lustrous fabrics with gentle folds catching the light. Soft, muted palette of ivories, champagnes, blush pinks. The entire scene radiates peaceful luxury.

LIGHTING: Soft, gentle morning or late afternoon light — perhaps sunlight filtering through gauzy curtains, casting a warm, dreamy glow over the entire scene. Everything is bathed in soft gold.

ANIMAL LIKENESS — CRITICAL: Preserve exact breed, fur color, markings, and eye color. The animal sleeps naturally and beautifully — add only the silk surroundings.

OUTPUT: 2:3 or square portrait format. No text, no watermarks, no borders.`;

    // ── THE FLOWER BED ───────────────────────────────────────────────────────
    case "flower-bed":
      return `${name}Create a breathtaking, romantic oil painting portrait of the animal sleeping peacefully in a lush garden of flowers — surrounded by blooms, utterly at peace.

SCENE: The animal is curled up or sleeping gently, completely nestled in a soft bed of flowers — roses, peonies, lavender, wildflowers in full bloom surrounding and framing the animal. Petals drift softly around. The animal is so peaceful, so perfectly at home among the flowers that they seem made for each other.

PAINTING STYLE: Lush, romantic impressionist-influenced oil painting — loose, expressive brushstrokes for the flowers, soft and detailed for the sleeping animal. Rich, saturated flower colors — deep pinks, soft purples, creamy whites, vivid greens. The entire painting glows with natural beauty.

LIGHTING: Soft, warm garden light — dappled sunlight filtering through foliage, casting gentle golden patches across the flowers and the sleeping animal. The whole scene is bathed in warm, peaceful light.

ANIMAL LIKENESS — CRITICAL: Preserve exact breed, fur color, markings, and eye color. The animal sleeps naturally among the flowers — paint it naturally.

OUTPUT: Square or 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── THE STEAK DINNER ─────────────────────────────────────────────────────
    case "steak-dinner":
      return `${name}Create a magnificent, warm oil painting portrait of the animal seated at an upscale steakhouse — a distinguished dinner guest enjoying prime cuts and smooth sips.

SCENE: The animal is seated upright at a fine dining table with white linen. On the table: a perfectly cooked steak on fine china, gleaming silverware, a crystal glass of red wine, a lit candle, a small bread basket. The restaurant behind: dark wood, warm amber lighting, intimate atmosphere. The animal's expression: deeply, profoundly satisfied — this is exactly where it belongs.

PAINTING STYLE: Rich, warm oil painting — deep warm browns, amber candlelight, the deep red of the wine. The steak glistens, the crystal sparkles. Warm, sophisticated, indulgent.

LIGHTING: Warm candlelight — golden, flickering, intimate. The candle illuminates the animal's face from below with warm gold. Bright specular highlights on the wine glass and silverware. Deep cozy shadows in the background.

ANIMAL LIKENESS — CRITICAL: Preserve exact breed, fur color, markings, and eye color. The animal sits at the table naturally — no costume required.

OUTPUT: 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── THE BIRTHDAY PARTY ───────────────────────────────────────────────────
    case "birthday-party":
      return `${name}Create a joyful, festive, colorful oil painting portrait of the animal at its own birthday party — cake, balloons, presents, pure celebration energy.

SCENE: The animal is the star of a wonderful birthday party — in front of a beautiful birthday cake with lit candles, surrounded by colorful balloons (floating, tied to the chair), wrapped presents piled nearby. Perhaps a festive banner above. The animal wears a birthday party hat. Its expression: pure joy, pure celebration, this is the best day of its life.

PAINTING STYLE: Bright, joyful, warm oil painting — vibrant colors everywhere. The candle flames flicker warmly on the cake. Balloons in bright reds, blues, yellows, greens. The presents in colorful wrapping paper. Everything radiates celebration.

LIGHTING: Warm party lighting — the birthday candles provide warm dancing light on the animal's face. Overhead warm interior lighting fills the scene with cheer. The candle flames are bright points of warm light.

ANIMAL LIKENESS — CRITICAL: Preserve exact breed, fur color, markings, and eye color. The party hat sits naturally on the animal's head — change nothing else.

OUTPUT: Square or 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── DEFAULT ───────────────────────────────────────────────────────────────
    default:
      return `${name}Create a museum-quality oil painting portrait of the animal in the style of the European old masters — timeless, noble, and beautifully painted.

The animal is the main subject, painted in a dignified pose against a rich dark Rembrandt-style background. Warm golden chiaroscuro lighting illuminates the animal's face and fur. The painting style features visible brushstrokes, rich color depth, and luminous oil painting quality.

ANIMAL LIKENESS — CRITICAL: Preserve the animal's exact breed, fur color, markings, and eye color from the reference photo. It must be instantly recognizable as the same pet.

OUTPUT: 2:3 portrait format. No text, no watermarks.`;
  }
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { images, style, petName, referenceImage } = body;

    if (!images || images.length === 0) {
      throw new Error("No images provided");
    }
    if (!style) {
      throw new Error("No style provided");
    }

    // referenceImage is sent from the frontend as { base64, mimeType }
    const styleRef = referenceImage || null;
    const prompt = buildStylePrompt(style, petName, !!styleRef);

    console.log(`Style: ${style}, hasReference: ${!!styleRef}`);

    let outputBase64: string | null = null;
    let outputMimeType = "image/png";

    for (let attempt = 0; attempt < 3; attempt++) {
      const temperature = attempt === 0 ? 1.0 : 0.7;

      const parts: any[] = [{ text: prompt }];

      // IMAGE 1: Style reference (if available)
      if (styleRef) {
        parts.push({
          inlineData: {
            mimeType: styleRef.mimeType,
            data: styleRef.base64,
          },
        });
      }

      // IMAGE 2 (or 1 if no reference): Pet photo(s)
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

      console.warn(`Attempt ${attempt + 1}: No image. Reason=${finishReason}, text="${textParts.substring(0, 300)}"`);
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
