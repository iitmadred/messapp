export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return Response.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Get API key: header override > env variable
    const headerKey = request.headers.get("X-Mistral-Key");
    const apiKey = headerKey || process.env.MISTRAL_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          error:
            "No Mistral API key configured. Please set it in Settings or add MISTRAL_API_KEY to .env.local",
        },
        { status: 401 }
      );
    }

    // Build the Mistral vision API request
    const systemPrompt = `You are a receipt/bill data extraction assistant. Analyze the uploaded receipt image and extract the purchase information. Return ONLY a valid JSON object with the following structure:
{
  "total_amount": <number or null if not found>,
  "list_of_items": [{"name": "<item name>", "price": <number>}],
  "common_description": "<brief 2-5 word summary of the purchase type, e.g. 'Cafeteria lunch' or 'Morning tea and snacks'>",
  "purchase_date": "<YYYY-MM-DD format or null if not found>",
  "purchase_time": "<HH:mm format or null if not found>",
  "confidence": "<high|medium|low based on how clearly you could read the receipt>"
}

Rules:
- If you cannot read a field clearly, set it to null
- Prices should be numbers (not strings)
- The currency is AED (UAE Dirhams)
- common_description should be a brief, natural summary
- If only a total is visible with no itemization, return the total_amount with an empty list_of_items
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
          model: "pixtral-12b-2409",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Please analyze this receipt image and extract the purchase data as JSON.",
                },
                {
                  type: "image_url",
                  image_url: image,
                },
              ],
            },
          ],
          response_format: { type: "json_object" },
          max_tokens: 1024,
          temperature: 0.1,
        }),
      }
    );

    if (!mistralResponse.ok) {
      const errorData = await mistralResponse.json().catch(() => ({}));
      console.error("Mistral API error:", errorData);
      return Response.json(
        {
          error: `Mistral API error: ${(errorData as Record<string, unknown>)?.message || mistralResponse.statusText}`,
        },
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

    // Parse the JSON response
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        return Response.json(
          { error: "Could not parse AI response. Please enter details manually." },
          { status: 422 }
        );
      }
    }

    // Validate and normalize the response
    const result = {
      total_amount: typeof parsed.total_amount === "number" ? parsed.total_amount : null,
      list_of_items: Array.isArray(parsed.list_of_items)
        ? parsed.list_of_items.map((item: { name?: string; price?: number }) => ({
            name: String(item.name || "Unknown item"),
            price: typeof item.price === "number" ? item.price : 0,
          }))
        : [],
      common_description: String(parsed.common_description || "Purchase"),
      purchase_date: parsed.purchase_date || null,
      purchase_time: parsed.purchase_time || null,
      confidence: ["high", "medium", "low"].includes(parsed.confidence)
        ? parsed.confidence
        : "medium",
    };

    return Response.json(result);
  } catch (error) {
    console.error("Scan receipt error:", error);
    return Response.json(
      {
        error: "An unexpected error occurred while scanning the receipt.",
      },
      { status: 500 }
    );
  }
}
