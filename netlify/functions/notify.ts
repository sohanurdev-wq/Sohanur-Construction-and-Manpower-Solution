import { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { message } = JSON.parse(event.body || "{}");
    const botToken = process.env.TELEGRAM_BOT_TOKEN || "8037861551:AAGCdukJlMoh0LeTuJ8nAasAu_BK4e8S9Vs";
    const chatId = process.env.TELEGRAM_CHAT_ID || "8329392163";

    if (!message) {
      return { statusCode: 400, body: JSON.stringify({ error: "Message is required" }) };
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const data = await response.json();
    if (data.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to send Telegram notification", details: data }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};

export { handler };
