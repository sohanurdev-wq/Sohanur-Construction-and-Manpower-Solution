/**
 * Utility to send Telegram notifications directly from the client side.
 * Note: This exposes your Bot Token in the browser. Use only for static hosting like GitHub Pages.
 */
export async function sendTelegramNotification(message: string) {
  const botToken = "8037861551:AAGCdukJlMoh0LeTuJ8nAasAu_BK4e8S9Vs";
  const chatId = "8329392163";

  try {
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
    if (!data.ok) {
      throw new Error(data.description || "Failed to send Telegram message");
    }
    return data;
  } catch (error) {
    console.error("Telegram Notification Error:", error);
    throw error;
  }
}
