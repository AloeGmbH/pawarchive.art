const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!;
const GEMINI_MODEL = "gemini-2.5-flash-preview-04-17";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ─────────────────────────────────────────────────────────────────────────────
// STYLE PROMPTS
// Philosophy: Each prompt describes exactly what the FINAL IMAGE looks like —
// scene, lighting, painting technique, and how the animal appears in it.
// The animal's exact appearance (breed, fur color, markings, eyes) must always
// be faithfully preserved — it must be instantly recognizable as the same pet.
// ─────────────────────────────────────────────────────────────────────────────

function buildStylePrompt(style: string, petName?: string): string {
  const name = petName ? `The pet's name is ${petName}. ` : "";

  switch (style) {

    // ── ROYAL RENAISSANCE ────────────────────────────────────────────────────
    case "royal-renaissance":
      return `${name}Create a museum-quality oil painting portrait of the animal from the photo, in the style of 17th century European court painters — Rembrandt van Rijn, Anthony van Dyck, and Velázquez.

FINAL IMAGE DESCRIPTION:
The animal is seated upright in a grand ornate velvet throne inside a noble manor. The chair is deep burgundy or forest green velvet with carved gilded wooden armrests. The animal wears a luxurious royal ermine cloak draped over its shoulders — deep wine-red velvet with white ermine fur trim (white with small black tail-tip spots) along all edges. A simple elegant gold chain hangs around its neck. The animal's face, chest, and paws are uncovered and clearly visible. The background is a rich dark interior — warm deep brown fading to near-black at the edges, with a hint of heavy draped curtain on one side. The overall mood is dignified, noble, and timeless.

PAINTING TECHNIQUE:
True oil painting — visible, confident brushstrokes on the background and fabric. Smooth, luminous treatment on the animal's face and fur. Rich impasto texture on the velvet cloak. Deep, saturated colors typical of Dutch Golden Age painting. The painting has depth, warmth, and the unmistakable glow of old masters.

LIGHTING:
Classic Rembrandt chiaroscuro — a single warm golden light source from upper-left. The animal's face and chest are brightly illuminated with golden warmth. Deep soft shadows fall on the right side. The eyes have a small, bright catchlight. The ermine cloak catches the light on its raised edges while the folds fall into deep shadow.

ANIMAL LIKENESS — CRITICAL:
You MUST preserve this animal's exact appearance from the reference photo: same breed, same exact fur color and pattern, same markings, same eye color, same facial structure. The animal must be 100% recognizable as the same pet. Only add the royal cloak and chain — do not change any other feature.

OUTPUT: Square or 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── GARDEN PARTY ─────────────────────────────────────────────────────────
    case "garden-party":
      return `${name}Create a stunning impressionist oil painting portrait of the animal from the photo, in the style of Pierre-Auguste Renoir and Claude Monet — warm, luminous, romantic.

FINAL IMAGE DESCRIPTION:
The animal is resting or sitting naturally among an explosion of summer flowers in a lush English garden. Surrounding the animal: large blooming roses (soft pink, cream, deep red), garden peonies, lavender stalks, and wild garden flowers in full bloom. The flowers are so lush they almost frame the animal's face like a natural wreath. Behind, a softly blurred impressionist garden — dappled sunlight through leaves, more flowers, warm greens. The animal itself is the sharp, detailed focal point; everything behind is painted in loose, dream-like impressionist strokes.

PAINTING TECHNIQUE:
Loose, expressive impressionist oil painting for the background and flowers — visible, energetic brushstrokes that capture light and movement. The animal's face and fur are painted with more detail and precision, making it stand out from the painterly background. Rich, saturated flower colors — deep pinks, warm purples, creamy whites, vivid greens.

LIGHTING:
Warm golden afternoon sunlight filtering through garden foliage from above. Soft dappled light on the animal's fur — golden highlights on the top of the head and back. Warm, even ambient light fills the whole scene. The eyes are bright and alive with reflected garden light.

ANIMAL LIKENESS — CRITICAL:
Preserve this animal's exact appearance: same breed, same exact fur color and pattern, same eye color. The animal must be instantly recognizable as the same pet from the photo. Paint it naturally — not in costume, just placed beautifully among the flowers.

OUTPUT: Square or 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── STEAK DINNER ─────────────────────────────────────────────────────────
    case "steak-dinner":
      return `${name}Create a charming, beautifully painted digital oil painting portrait of the animal from the photo, seated at an elegant fine dining restaurant table as if it were a distinguished dinner guest.

FINAL IMAGE DESCRIPTION:
The animal is seated upright at a white linen tablecloth restaurant table, facing the viewer. On the table: a perfectly presented gourmet meal — a juicy steak fillet on a fine china plate, gleaming silver cutlery on each side, a crystal wine glass filled with deep red wine, a lit candle in a silver candleholder, and a small flower arrangement. The restaurant interior behind is dark and intimate — warm wood paneling, soft amber wall lighting, other candlelit tables blurred in the background. The animal is wearing a small black bow tie (or no tie — just looking supremely dignified). Its expression is serious and distinguished, as if reviewing the menu.

PAINTING TECHNIQUE:
Rich, detailed digital oil painting — very high quality, warm color palette dominated by deep browns, warm ambers, candlelight golds, and rich reds. The tablecloth has soft white highlights and gentle shadows from the candlelight. The crystal glass catches the candlelight in small bright reflections.

LIGHTING:
Warm candlelight as the primary light source — golden, flickering, intimate. The candle illuminates the animal's face from slightly below, creating a warm golden glow under its chin and on its chest. Deep, cozy shadows fill the background. Small bright reflections catch in the wine glass and silverware.

ANIMAL LIKENESS — CRITICAL:
Preserve this animal's exact appearance: same breed, same exact fur color and markings, same eye color. The animal must be 100% recognizable. Only add the small bow tie if it suits the composition — never change the animal's actual features.

OUTPUT: Square or 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── DISCO KING ───────────────────────────────────────────────────────────
    case "disco-king":
      return `${name}Create a vibrant, fun, high-energy digital painting portrait of the animal from the photo as the undisputed star of a 1970s-80s disco dancefloor — glittery, electric, and totally fabulous.

FINAL IMAGE DESCRIPTION:
The animal is posed front-and-center, owning the dancefloor. Above it: a massive mirrored disco ball, rotating, scattering hundreds of small rainbow light reflections across everything. The background is a dark club interior filled with electric neon lights — deep purples, electric pinks, hot magentas, electric blues, and warm golds. The floor beneath is a glittery reflective surface that catches all the neon color. Other blurred dancers in the background suggest a packed club. The animal has a fabulous glittery collar or jeweled necklace. Its expression: total confidence, like it owns every dance floor it has ever walked on.

PAINTING TECHNIQUE:
Vivid, high-contrast digital painting with painterly oil-painting texture. Deep dark background making the neon colors and light reflections explode visually. The disco ball reflections appear as small, bright circular spots of light scattered across the animal's fur, the floor, and the background. Rich, saturated colors — this painting should feel electric and alive.

LIGHTING:
Multiple colored neon light sources from all directions — pinks, purples, blues, and golden spotlight from directly above. The disco ball scatters small bright reflected dots of light across the animal's fur and face. One dominant warm spotlight from above creates the main illumination. The animal's eyes reflect the colored lights.

ANIMAL LIKENESS — CRITICAL:
Preserve this animal's exact appearance: same breed, same fur color and markings, same eye color. The animal must be recognizable as the same pet. Add only the glittery collar — change nothing else about the animal's actual features.

OUTPUT: Square or 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── CHAMPAGNE & OYSTERS ──────────────────────────────────────────────────
    case "champagne-oysters":
      return `${name}Create a luxurious, sun-drenched oil painting portrait of the animal from the photo relaxing on the deck of a private superyacht at golden hour — pure elegance, pure luxury.

FINAL IMAGE DESCRIPTION:
The animal is resting regally on a cream or white cushioned deck chair on an immaculate yacht deck. The deck is polished teak wood, gleaming in the golden hour light. To the side: a silver ice bucket with a Champagne bottle, a crystal flute of sparkling Champagne, and a beautiful arrangement of fresh oysters on a silver platter with lemon wedges. Behind the animal: a white yacht railing and then an endless golden ocean horizon — the sun is setting, painting the sky in deep oranges, warm pinks, and glowing golds. The water reflects the golden sky below.

PAINTING TECHNIQUE:
Warm, golden-toned oil painting with rich, glowing colors. The entire palette is dominated by warm golds, champagne colors, creamy whites, and deep ocean blues. The light has that unmistakable magic of golden hour — everything glows. High-quality, detailed painting with loose painterly strokes in the sky and water.

LIGHTING:
Golden hour sunlight from low on the horizon — warm, directional, and rich. Everything is bathed in golden amber light. The Champagne glass catches the light in brilliant specular highlights. The animal's fur glows with warm golden highlights on the side facing the sun. The ocean water reflects the golden sky in long shimmering streaks.

ANIMAL LIKENESS — CRITICAL:
Preserve this animal's exact appearance: same breed, same fur color and markings, same eye color. The animal must be recognizable as the same pet. Paint it resting naturally — no costume, just pure luxury surroundings.

OUTPUT: Square or 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── SPACE ODYSSEY ────────────────────────────────────────────────────────
    case "space-odyssey":
      return `${name}Create an epic, cinematic, highly detailed digital painting portrait of the animal from the photo as a heroic astronaut floating in deep space — awe-inspiring and breathtaking.

FINAL IMAGE DESCRIPTION:
The animal is wearing a realistic, detailed NASA-style spacesuit — pure white with silver metallic details, mission patches on the shoulders, and a clear glass helmet (open so the animal's face is fully visible and the helmet frames the face). The animal floats weightlessly in deep space. The background is stunning outer space: a magnificent nebula fills the background with deep cosmic purples, electric blues, and glowing gold dust clouds. Bright stars scatter across the darkness. A large planet or moon is partially visible to one side, its curved surface showing craters or swirling atmosphere. The overall mood is heroic, wondrous, and epic.

PAINTING TECHNIQUE:
Highly detailed, cinematic digital oil painting. The spacesuit is painted with meticulous detail — every seam, patch, and visor reflection. The space background is painted with rich, luminous colors — deep navy and black punctuated by glowing nebula colors and sharp star points. The contrast between the bright white spacesuit and the dark space background is dramatic.

LIGHTING:
Dramatic space lighting — a strong directional light source (a nearby star or the sun) illuminates the animal's face and the front of the spacesuit brilliantly. The opposite side falls into deep cool shadow. The nebula provides soft ambient colored glow from behind. Stars create small pinpoint highlights. The animal's eyes are brightly lit and catch the starlight.

ANIMAL LIKENESS — CRITICAL:
Preserve this animal's exact appearance: same breed, same fur color and markings, same eye color. The animal's face must be 100% recognizable inside the spacesuit helmet. Only add the spacesuit — change nothing about the animal's actual features.

OUTPUT: Square or 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── MEDIEVAL KNIGHT ──────────────────────────────────────────────────────
    case "medieval-knight":
      return `${name}Create a dramatic, epic, highly detailed oil painting portrait of the animal from the photo as a noble medieval knight in full armour — heroic, powerful, and regal.

FINAL IMAGE DESCRIPTION:
The animal is wearing a magnificent suit of full medieval plate armour — polished bright steel with intricate engraved details on the breastplate and pauldrons (shoulder pieces). A great helm or open-faced visor is pushed back to fully reveal the animal's face. The armour fits the animal's body believably. From the armour hangs a rich tabard or surcoat — deep royal blue or crimson red with a golden heraldic emblem. In the background: the great hall of a stone castle — tall arched stone walls lit by burning wall torches, a large heraldic banner hanging above, and the soft glow of a fireplace to one side. The animal's expression is noble, brave, and commanding.

PAINTING TECHNIQUE:
Rich, detailed oil painting with dramatic contrast between light and shadow. The polished armour catches torchlight in bright metallic highlights while the crevices fall into deep shadow. The stone castle walls are painted in rough, textured strokes. The banner fabric has visible weave texture. The overall palette: cool steel greys of the armour contrasted with warm amber torchlight and the rich color of the tabard.

LIGHTING:
Dramatic warm torchlight from multiple wall sconces — flickering, amber, directional. The polished armour catches the torchlight in bright specular highlights on the raised surfaces. The animal's face is warmly illuminated by the nearest torch. Deep shadows fill the corners and the recesses of the armour. A hint of cooler light from a distant window provides subtle contrast.

ANIMAL LIKENESS — CRITICAL:
Preserve this animal's exact appearance: same breed, same fur color and markings, same eye color. The animal's face must be 100% recognizable above the armour. Only add the armour and tabard — change nothing about the animal's actual features.

OUTPUT: Square or 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── PARIS CAFÉ ───────────────────────────────────────────────────────────
    case "paris-cafe":
      return `${name}Create a charming, warm, impressionist-style oil painting portrait of the animal from the photo enjoying a peaceful morning at a classic Parisian sidewalk café.

FINAL IMAGE DESCRIPTION:
The animal is seated at a small round bistro table on a classic Parisian sidewalk. On the table: a white ceramic cup of café crème (coffee with cream), a fresh golden croissant on a small plate, a tiny vase with a single red rose, and a folded French newspaper. The bistro chairs are classic black rattan. Behind the animal: a typical Parisian street scene — warm golden stone building facades with wrought-iron balconies, a green awning of the café above, and softly blurred pedestrians on the cobblestone boulevard. In the far background, slightly blurred, the distinctive silhouette of the Eiffel Tower is visible against a soft morning sky.

PAINTING TECHNIQUE:
Warm impressionist oil painting — loose, energetic brushstrokes in the background street scene that suggest movement and Parisian life. More detailed, focused treatment on the animal's face and the café table. The palette is warm and golden — warm stone colors, soft morning light, golden browns of the croissant, creamy whites of the coffee cup.

LIGHTING:
Warm Parisian morning sunlight from one side — golden, gentle, and flattering. The croissant glows with warm golden light. The coffee steam catches the morning light. The animal's fur has warm golden highlights on the lit side with soft shadows on the other. The overall mood is peaceful, civilized, and effortlessly chic.

ANIMAL LIKENESS — CRITICAL:
Preserve this animal's exact appearance: same breed, same fur color and markings, same eye color. The animal must be recognizable as the same pet. Paint it naturally seated at the café — no costume, just completely at home in Paris.

OUTPUT: Square or 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── NEON NOIR ────────────────────────────────────────────────────────────
    case "neon-noir":
      return `${name}Create a moody, cinematic oil painting portrait of the animal from the photo in a 1940s film noir meets modern neon-city-night aesthetic — mysterious, dramatic, impossibly cool.

FINAL IMAGE DESCRIPTION:
The animal stands or sits in a rain-soaked dark city alley or under a vintage street lamp at night. The wet cobblestone street reflects neon signs in shimmering color — electric blues, hot pinks, deep reds, acid yellows. Neon signs from nearby storefronts glow and reflect off every wet surface. The animal is framed by the darkness, with just enough light to see it clearly — a detective at rest, surveying the night. A vintage lamppost provides warm amber backlight. Fog or light rain adds atmospheric depth. The animal looks calm, mysterious, and completely in its element.

PAINTING TECHNIQUE:
High-contrast cinematic digital oil painting. Deep, inky shadows fill most of the composition — the darkness is rich and layered, not flat. The neon colors are vivid and saturated against the dark background, with visible glowing halos around each light source. Wet surfaces are painted with reflective, almost mirror-like treatment. The overall palette: deep blacks, navy blues, with electric neon accents of pink, teal, and amber.

LIGHTING:
Multiple colored neon light sources from off-screen signs — electric blue, hot pink, amber. One warm amber street lamp provides backlight and rim lighting around the animal. The wet street reflects all these lights below. The animal's face catches just enough light to be clearly visible — one side illuminated by neon color, the other in deep shadow.

ANIMAL LIKENESS — CRITICAL:
Preserve this animal's exact appearance: same breed, same fur color and markings, same eye color. The animal must be recognizable as the same pet despite the dramatic lighting. The neon colors may tint the fur slightly — this is correct and adds to the atmosphere.

OUTPUT: Square or 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── TROPICAL BEACH ───────────────────────────────────────────────────────
    case "tropical-beach":
      return `${name}Create a joyful, sun-drenched, vibrant digital oil painting portrait of the animal from the photo on a perfect tropical paradise beach — pure vacation bliss.

FINAL IMAGE DESCRIPTION:
The animal is posed happily on a perfect white sand beach. The sand is pristine, fine, and bright white. Behind the animal: crystal-clear turquoise water that graduates from pale aqua near the shore to deeper teal farther out. Several tall palm trees sway gently to one side, their fronds catching a warm breeze. Colorful tropical flowers bloom at the base of the palms. A bright blue sky with just a few soft white clouds completes the scene. The animal looks completely happy and at home — relaxed, ears catching the breeze, eyes bright and joyful.

PAINTING TECHNIQUE:
Vivid, bright, warm digital oil painting. Rich, saturated tropical colors — the turquoise sea, white sand, vivid green palms, and bright blue sky are all painted at full saturation and warmth. The painting is lively and energetic — this is the happiest portrait in the collection. Loose, expressive brushwork in the water and sky; more detailed treatment on the animal.

LIGHTING:
Strong, bright tropical sunshine from overhead and slightly behind — that perfect midday beach light. The animal's fur has bright highlights on the top and back from the sun, with warmer shadow tones on the underside. The water sparkles with bright sunlight reflections. The white sand reflects warm ambient light back up onto the scene. Everything glows with warmth.

ANIMAL LIKENESS — CRITICAL:
Preserve this animal's exact appearance: same breed, same fur color and markings, same eye color. The animal must be recognizable as the same pet. Paint it naturally happy on the beach — no costume, just pure tropical joy.

OUTPUT: Square or 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── WARRIOR ──────────────────────────────────────────────────────────────
    case "warrior":
      return `${name}Create an epic, heroic, cinematic oil painting portrait of the animal from the photo as a legendary ancient warrior — powerful, triumphant, and awe-inspiring.

FINAL IMAGE DESCRIPTION:
The animal is wearing detailed ancient warrior armour — choose the most dramatic style: Greek bronze breastplate with engraved muscle detail, Roman lorica segmentata, Viking chainmail and fur, or dark fantasy plate armour. A great helm is pushed back or removed to show the animal's face fully. A flowing battle cape — deep crimson, royal blue, or forest green — billows dramatically behind. The animal stands on high ground — the edge of a cliff or mountain peak — looking out over an epic landscape. Behind it: a dramatic sky with dark storm clouds breaking apart, golden sunlight bursting through in dramatic rays, illuminating the landscape below. The mood is triumphant — this warrior has won.

PAINTING TECHNIQUE:
Epic, cinematic oil painting with dramatic lighting and bold composition. The armour is painted with metallic precision — bright highlights on raised edges, deep shadows in crevices. The sky is painted with sweeping, dramatic brushstrokes — dark clouds and breaking golden light. The landscape below is loosely painted to give scale and atmosphere. Rich, heroic color palette: deep blues and greys of the armour, warm gold of the breakthrough sunlight, rich red/blue of the cape.

LIGHTING:
Dramatic golden sunlight breaking through storm clouds from behind and above — epic, heavenly, theatrical. This light creates strong rim lighting around the animal and the armour edges, making them glow. The front of the animal's face is lit by the diffuse golden sky light. Deep cool shadows from the storm clouds fill the landscape. The overall effect is cinematic and triumphant.

ANIMAL LIKENESS — CRITICAL:
Preserve this animal's exact appearance: same breed, same fur color and markings, same eye color. The animal's face must be 100% recognizable inside the warrior armour. Only add the armour and cape — change nothing about the animal's actual features.

OUTPUT: Square or 2:3 portrait format. No text, no watermarks, no borders.`;

    // ── 3D CARTOON ───────────────────────────────────────────────────────────
    case "3d-cartoon":
      return `${name}Create a beautiful, high-quality 3D animated CGI portrait of the animal from the photo in the exact visual style of Pixar and Walt Disney Animation Studios — impossibly charming, expressive, and adorable.

FINAL IMAGE DESCRIPTION:
The animal rendered as a lovable Pixar/Disney animated character — but clearly recognizable as the same animal from the photo. The body has soft, rounded proportions typical of CG animation — slightly exaggerated cuteness while remaining clearly the same species and breed. The eyes are large, expressive, shiny, and full of personality — the hallmark of Pixar character design. The fur is rendered with stunning CG quality — soft, fluffy, perfectly lit subsurface scattering making it look incredibly touchable. The background is a clean, cheerful, softly colored environment — a warm gradient, a simple colorful room, or a bright cheerful outdoor scene. Everything radiates warmth and joy.

TECHNIQUE:
This is the EXCEPTION to the oil painting rule. Create a photorealistic 3D CGI render in the style of Pixar feature films — not a painting. The quality should be indistinguishable from an actual Pixar production still. Perfect subsurface scattering on the fur, realistic wet-look eyes with multiple specular highlights, soft ambient occlusion in crevices, and beautiful studio lighting. Color grading: warm, slightly saturated, cheerful — just like Pixar movies.

LIGHTING:
Perfect 3-point studio lighting: warm key light from upper-left, soft fill light from the right, and a gentle rim light from behind. Multiple specular highlights in the large, expressive eyes. Soft ambient occlusion making the fur look three-dimensional and real. The overall light is warm, golden, and flattering.

ANIMAL LIKENESS — CRITICAL:
The animal must be recognizable as the same species, breed, and color as in the reference photo — translated faithfully into Pixar CGI style. Same fur colors and markings, same eye color (but larger and more expressive in Pixar style), same breed characteristics. The Pixar-ification should enhance, not replace, the animal's identity.

OUTPUT: Square format preferred. No text, no watermarks, no borders.`;

    // ── DEFAULT ───────────────────────────────────────────────────────────────
    default:
      return `${name}Create a museum-quality oil painting portrait of the animal from the photo in the style of the European old masters — timeless, noble, and beautifully painted.

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
      const temperature = attempt === 0 ? 1.0 : 0.7;

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
