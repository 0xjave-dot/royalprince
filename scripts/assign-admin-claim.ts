import "dotenv/config";
import admin from "firebase-admin";
import fs from "node:fs";
import path from "node:path";

type Mode = "grant" | "revoke";

function printUsageAndExit() {
  console.log([
    "Usage:",
    "  npm run grant-admin -- --email admin@example.com",
    "  npm run grant-admin -- --uid USER_UID",
    "  npm run grant-admin -- --email admin@example.com --revoke",
    "",
    "Required credentials:",
    "  FIREBASE_SERVICE_ACCOUNT_JSON  JSON string for a Firebase service account",
    "  or",
    "  GOOGLE_APPLICATION_CREDENTIALS  Path to a service account JSON file",
  ].join("\n"));
  process.exit(1);
}

function getArgValue(flag: string) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return null;
  const value = process.argv[index + 1];
  if (!value || value.startsWith("--")) return null;
  return value;
}

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function loadServiceAccount() {
  const inlineJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (inlineJson) {
    return JSON.parse(inlineJson);
  }

  const filePath = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (filePath) {
    const resolved = path.resolve(filePath);
    const raw = fs.readFileSync(resolved, "utf8");
    return JSON.parse(raw);
  }

  throw new Error(
    "Missing Firebase Admin credentials. Set FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS.",
  );
}

async function main() {
  const email = getArgValue("--email");
  const uid = getArgValue("--uid");
  const mode: Mode = hasFlag("--revoke") ? "revoke" : "grant";

  if ((!email && !uid) || (email && uid)) {
    printUsageAndExit();
  }

  if (!admin.apps.length) {
    const serviceAccount = loadServiceAccount();
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  const auth = admin.auth();
  const user = email ? await auth.getUserByEmail(email) : await auth.getUser(uid!);
  const nextClaims = {
    ...(user.customClaims ?? {}),
    admin: mode === "grant",
  };

  if (mode === "revoke") {
    delete nextClaims.admin;
  }

  await auth.setCustomUserClaims(user.uid, nextClaims);

  console.log(
    `${mode === "grant" ? "Granted" : "Revoked"} admin claim for ${user.email ?? user.uid} (${user.uid})`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
