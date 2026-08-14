export type Msg = { role: "user" | "assistant"; content: string };

export const SYSTEM_PROMPT = `You are "Powerex Assistant", the friendly AI assistant for Powerex Fire Protection System — a fire safety company based in Vasai East, Vasai-Virar, Maharashtra, India, founded in 2010 by Santosh Kumar Yadav (GSTIN 27ABKPY1137F1ZH).

Services: fire extinguishers (ABC, CO2, foam, water, clean agent, modular, ball type), fire alarm systems, hydrant & sprinkler / pre-action systems, refilling and annual maintenance contracts (AMC), fire safety training & mock drills, and PPE / safety gear.
Areas served: Mumbai, Vasai-Virar, Bhiwandi, Thane and projects across India. Support is available 24/7.
Contact: phone/WhatsApp +91 91677 52444, email info@powerexfire.com (sales: sales@powerexfire.com).

Answer fire-safety questions helpfully and accurately. Keep replies short, natural and conversational (2-4 sentences unless more detail is asked). Avoid markdown formatting — your reply may be read aloud. When a user wants a quote, site visit, AMC or emergency help, invite them to call or WhatsApp +91 91677 52444. Never invent prices; say pricing depends on site requirements and offer a free quote. Reply in the user's language.`;

export async function handleChatRequest(request: Request, extraHeaders: Record<string, string> = {}) {
  const json = (body: unknown, status = 200) =>
    Response.json(body, { status, headers: extraHeaders });

  const key = process.env["LOVABLE_API_KEY"];
  if (!key) return json({ error: "AI is not configured." }, 500);

  let messages: Msg[] = [];
  try {
    const body = (await request.json()) as { messages?: Msg[] };
    messages = Array.isArray(body.messages) ? body.messages : [];
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const cleaned = messages
    .filter(
      (m) =>
        (m?.role === "user" || m?.role === "assistant") &&
        typeof m?.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

  if (cleaned.length === 0) return json({ error: "No message provided." }, 400);

  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...cleaned],
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      const status = res.status === 429 || res.status === 402 ? res.status : 502;
      const error =
        res.status === 429
          ? "Too many requests right now — please try again in a moment."
          : res.status === 402
            ? "AI usage limit reached. Please contact us on +91 91677 52444."
            : "The assistant is unavailable right now. Please try again.";
      console.error("AI gateway error", res.status, detail);
      return json({ error }, status);
    }

    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return json({ error: "The assistant didn't return an answer. Please try again." }, 502);
    }
    return json({ reply });
  } catch (err) {
    console.error("AI chat failed", err);
    return json({ error: "Network error contacting the assistant. Please try again." }, 502);
  }
}
