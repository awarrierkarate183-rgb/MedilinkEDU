import type { SupabaseClient } from "@supabase/supabase-js";
import type { Actor } from "@/lib/auth/roles";
import { loadSchoolDirectory } from "@/lib/data/admin-proceedings";
import { listEventGuides, publishLegacyHandbook, publishNormalHandbook, upsertEventGuide } from "@/lib/guides/operations";
import { getEventHandbook } from "@/lib/content/event-handbook";
import { normalEventHandbook } from "@/lib/content/normal-event-handbook";
import { legacyEventHandbook } from "@/lib/content/legacy-event-handbook";

type Admin = SupabaseClient;

async function aiKey(admin: Admin) {
  const fromEnv = process.env.GROQ_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim();
  if (fromEnv) return { key: fromEnv, provider: process.env.GROQ_API_KEY ? "groq" : "openai" };
  const { data } = await admin.from("platform_settings").select("key, value").in("key", ["ai.groq_key", "ai.openai_key"]);
  const groq = data?.find((row) => row.key === "ai.groq_key")?.value;
  if (groq) return { key: String(groq), provider: "groq" };
  const openai = data?.find((row) => row.key === "ai.openai_key")?.value;
  if (openai) return { key: String(openai), provider: "openai" };
  return null;
}

async function runTool(admin: Admin, actor: Actor, name: string, args: Record<string, unknown>) {
  if (name === "publish_normal_handbook") {
    return publishNormalHandbook(admin, actor);
  }
  if (name === "publish_legacy_handbook") {
    return publishLegacyHandbook(admin, actor);
  }
  if (name === "update_event_guide") {
    return upsertEventGuide(admin, actor, {
      eventId: String(args.eventId || ""),
      kind: args.kind === "RUBRIC" ? "RUBRIC" : "INSTRUCTIONS",
      title: String(args.title || "Event guide"),
      body: String(args.body || ""),
      filePath: args.filePath ? String(args.filePath) : "/docs/normal-events-handbook.pdf",
      published: args.published !== false,
    });
  }
  if (name === "list_guides") {
    const rows = await listEventGuides(admin);
    return {
      events: [...normalEventHandbook, ...legacyEventHandbook].map((event) => ({
        id: event.id,
        name: event.name,
        instructions: rows.some((row) => row.catalog_event_id === event.id && row.kind === "INSTRUCTIONS" && row.published),
        rubric: rows.some((row) => row.catalog_event_id === event.id && row.kind === "RUBRIC" && row.published),
      })),
    };
  }
  if (name === "list_schools") {
    return loadSchoolDirectory(admin, actor);
  }
  if (name === "lookup_event") {
    const event = getEventHandbook(String(args.eventId || ""));
    return event || { error: "That event is not in the official handbooks." };
  }
  return { error: "That tool is not available." };
}

function commandFallback(message: string) {
  const text = message.toLowerCase();
  if (text.includes("publish") && text.includes("legacy")) {
    return { name: "publish_legacy_handbook", args: {} };
  }
  if (text.includes("publish") && (text.includes("handbook") || text.includes("rubric") || text.includes("guide"))) {
    return { name: "publish_normal_handbook", args: {} };
  }
  if (text.includes("list") && (text.includes("school") || text.includes("chapter"))) {
    return { name: "list_schools", args: {} };
  }
  if (text.includes("missing") || (text.includes("list") && text.includes("guide"))) {
    return { name: "list_guides", args: {} };
  }
  return null;
}

export async function runAdminDesk(admin: Admin, actor: Actor, message: string) {
  const fallback = commandFallback(message);
  if (fallback) {
    const result = await runTool(admin, actor, fallback.name, fallback.args);
    return {
      reply:
        fallback.name === "publish_legacy_handbook"
          ? "The Legacy Championship handbook is now published. Assigned students will see instructions and rubrics on their Competitions page."
          : fallback.name === "publish_normal_handbook"
            ? "The Normal Events handbook is now published. Assigned students will see instructions and rubrics on their Competitions page."
          : "Here is the current portal status.",
      result,
    };
  }

  const creds = await aiKey(admin);
  if (!creds) {
    return {
      reply:
        "I can publish the handbook, list schools, and list missing guides without an AI key. To edit wording by chat, save a Groq key in Settings, or type: publish the handbook.",
      result: null,
    };
  }

  const tools = [
    {
      type: "function",
      function: {
        name: "publish_normal_handbook",
        description: "Publish official Normal Event instructions and 100-point rubrics to the student portal.",
        parameters: { type: "object", properties: {} },
      },
    },
    {
      type: "function",
      function: {
        name: "publish_legacy_handbook",
        description: "Publish official Legacy Triad instructions and 1,000-point rubrics to the student portal.",
        parameters: { type: "object", properties: {} },
      },
    },
    {
      type: "function",
      function: {
        name: "update_event_guide",
        description: "Replace one event instruction or rubric. Use official handbook wording unless the administrator supplied new text.",
        parameters: {
          type: "object",
          properties: {
            eventId: { type: "string" },
            kind: { type: "string", enum: ["INSTRUCTIONS", "RUBRIC"] },
            title: { type: "string" },
            body: { type: "string" },
            filePath: { type: "string" },
            published: { type: "boolean" },
          },
          required: ["eventId", "kind", "title", "body"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "list_guides",
        description: "List which events have published instructions and rubrics.",
        parameters: { type: "object", properties: {} },
      },
    },
    {
      type: "function",
      function: {
        name: "list_schools",
        description: "List every school that has come through and how many events they have entered.",
        parameters: { type: "object", properties: {} },
      },
    },
    {
      type: "function",
      function: {
        name: "lookup_event",
        description: "Read the official handbook entry for one Normal Event.",
        parameters: {
          type: "object",
          properties: { eventId: { type: "string" } },
          required: ["eventId"],
        },
      },
    },
  ];

  const url =
    creds.provider === "groq"
      ? "https://api.groq.com/openai/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions";
  const model = creds.provider === "groq" ? "llama-3.3-70b-versatile" : "gpt-4o-mini";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${creds.key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are the MediLink administration desk. You may publish event guides, upload instructions, list schools, and report missing rubrics. Do not invent school names, scores, or events. Do not give medical advice. If the administrator asks to fix missing student rubrics, publish the Normal Events handbook. Confirm what you changed in plain language.",
        },
        { role: "user", content: message },
      ],
      tools,
      tool_choice: "auto",
    }),
  });
  if (!response.ok) {
    return { reply: "The AI service rejected that request. Use the publish button or type: publish the handbook.", result: null };
  }
  const json = await response.json();
  const choice = json.choices?.[0]?.message;
  const toolCall = choice?.tool_calls?.[0];
  if (toolCall?.function?.name) {
    let args: Record<string, unknown> = {};
    try {
      args = JSON.parse(toolCall.function.arguments || "{}");
    } catch {
      args = {};
    }
    const result = await runTool(admin, actor, toolCall.function.name, args);
    return {
      reply: choice.content || "Done. Assigned students will see the updated guide on their Competitions page.",
      result,
    };
  }
  return { reply: choice?.content || "Tell me what to publish, attach, or check.", result: null };
}
