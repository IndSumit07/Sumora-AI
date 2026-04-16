import "dotenv/config";
import connectToMongoDB from "../configs/mongodb.config.js";
import User from "../models/user.model.js";
import { sendReminderEmail } from "./brevo.service.js";

const BATCH_SIZE = Number.parseInt(
  process.env.REMINDER_EMAIL_BATCH_SIZE || "20",
  10,
);
const SEND_TO_ONLY_VERIFIED =
  (process.env.REMINDER_EMAIL_ONLY_VERIFIED || "true").toLowerCase() === "true";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendReminderEmailToAllUsers() {
  await connectToMongoDB();

  const query = SEND_TO_ONLY_VERIFIED ? { isVerified: true } : {};

  const users = await User.find(query)
    .select("email username isVerified")
    .sort({ createdAt: -1 })
    .lean();

  const validUsers = users.filter((user) => user.email);

  if (validUsers.length === 0) {
    console.log("No users with email found for reminder campaign.");
    return;
  }

  console.log(
    `Starting reminder campaign for ${validUsers.length} users (batch size: ${BATCH_SIZE}, only verified: ${SEND_TO_ONLY_VERIFIED}).`,
  );

  let sent = 0;
  let failed = 0;

  for (let i = 0; i < validUsers.length; i += BATCH_SIZE) {
    const batch = validUsers.slice(i, i + BATCH_SIZE);

    const results = await Promise.allSettled(
      batch.map((user) =>
        sendReminderEmail(user.email, user.username || "there"),
      ),
    );

    results.forEach((result, index) => {
      const user = batch[index];
      if (result.status === "fulfilled") {
        sent += 1;
        console.log(`Sent reminder to ${user.email}`);
      } else {
        failed += 1;
        console.error(
          `Failed for ${user.email}:`,
          result.reason?.message || result.reason,
        );
      }
    });

    if (i + BATCH_SIZE < validUsers.length) {
      // Short pause between batches to reduce provider throttling risk.
      await sleep(450);
    }
  }

  console.log(`Reminder campaign completed. Sent: ${sent}, Failed: ${failed}`);
}

sendReminderEmailToAllUsers()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Reminder campaign failed:", error);
    process.exit(1);
  });
