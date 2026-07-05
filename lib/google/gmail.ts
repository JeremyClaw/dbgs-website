import { google } from "googleapis";
import { getOAuth2Client } from "./auth";

function encodeMessage({ to, subject, body }: { to: string; subject: string; body: string }) {
  const message = [
    `To: ${to}`,
    "Content-Type: text/plain; charset=utf-8",
    "MIME-Version: 1.0",
    `Subject: ${subject}`,
    "",
    body,
  ].join("\n");

  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function sendNotification({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const auth = getOAuth2Client();
  const gmail = google.gmail({ version: "v1", auth });

  const raw = encodeMessage({ to, subject, body });

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });
}
