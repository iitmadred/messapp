export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return Response.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    const headerKey = request.headers.get("X-Mistral-Key");
    const apiKey = headerKey || process.env.MISTRAL_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "No Mistral API key configured." },
        { status: 401 }
      );
    }

    const systemPrompt = `You are a data cleaner for a mess/cafeteria expense tracker. Given a rough text description of a purchase, clean it up and return a JSON object:
{
  "item_name": "<cleaned, properly capitalized item name>",
  "estimated_cost": <estimated cost in AED as a number, or null if not determinable>,
  "category": "<one of: Breakfast, Lunch, Dinner, Snacks, Beverages, Other>"
}

Rules:
- Capitalize properly
- If a cost is mentioned, extract it. If not, estimate based on typical UAE mess/cafeteria prices
- Always return valid JSON`;

    const mistralResponse = await fetch(
      "https://api.mistral.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "mistral-small-latest",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Clean up this purchase description: "${text}"`,
            },
          ],
          response_format: { type: "json_object" },
          max_tokens: 256,
          temperature: 0.2,
        }),
      }
    );

    if (!mistralResponse.ok) {
      const errorData = await mistralResponse.json().catch(() => ({}));
      return Response.json(
        { error: `Mistral API error: ${(errorData as Record<string, unknown>)?.message || mistralResponse.statusText}` },
        { status: mistralResponse.status }
      );
    }

    const mistralData = await mistralResponse.json();
    const content = mistralData.choices?.[0]?.message?.content;

    if (!content) {
      return Response.json(
        { error: "No response from AI model" },
        { status: 500 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      return Response.json(
        { error: "Could not parse AI response" },
        { status: 422 }
      );
    }

    return Response.json({
      item_name: String(parsed.item_name || text),
      estimated_cost: typeof parsed.estimated_cost === "number" ? parsed.estimated_cost : null,
      category: parsed.category || "Other",
    });
  } catch (error) {
    console.error("Describe text error:", error);
    return Response.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
