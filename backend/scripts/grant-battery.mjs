import "dotenv/config";
import { stmts } from "../src/db.js";

const USERNAME = process.argv[2];
const AMOUNT = parseInt(process.argv[3], 10);

if (!USERNAME || !Number.isFinite(AMOUNT) || AMOUNT <= 0) {
  console.error("usage: node scripts/grant-battery.mjs <username> <amount>");
  process.exit(1);
}

const user = await stmts.findUserByUsername.get(USERNAME);
if (!user) {
  console.error(`user not found: ${USERNAME}`);
  process.exit(2);
}

await stmts.ensureWallet.run(user.id);
const row = await stmts.incrementWallet.get(user.id, AMOUNT);
console.log(`granted ${AMOUNT} battery to ${USERNAME} (id=${user.id}). new balance=${row?.balance}`);
process.exit(0);
