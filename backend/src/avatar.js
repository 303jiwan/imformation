// Avatar persistence routes.
// One row per user; config is an opaque JSON blob (<= 16KB stringified).
// Auth is required for both GET and POST.

import express from "express";
import { stmts } from "./db.js";
import { requireAuth } from "./auth.js";
import { isKnownItem, isFreeItem } from "./shop-catalog.js";

export const avatarRouter = express.Router();

const MAX_BYTES = 16 * 1024; // 16 KB

// GET /api/avatar
avatarRouter.get("/", requireAuth, async (req, res, next) => {
  try {
    const row = await stmts.getAvatar.get(req.user.id);
    if (!row) return res.json({ avatar: null });
    try {
      const avatar = JSON.parse(row.config);
      res.json({ avatar });
    } catch {
      // Corrupt row — don't 500; treat as no saved avatar.
      res.json({ avatar: null });
    }
  } catch (err) {
    next(err);
  }
});

// POST /api/avatar  { avatar: {...} }
avatarRouter.post("/", requireAuth, async (req, res, next) => {
  try {
    const { avatar } = req.body || {};
    if (avatar == null || typeof avatar !== "object" || Array.isArray(avatar)) {
      return res.status(400).json({ error: "avatar must be an object" });
    }
    const json = JSON.stringify(avatar);
    if (json.length > MAX_BYTES) {
      return res.status(400).json({ error: "avatar too large" });
    }

    // --- 소유권 검증 ---------------------------------------------------------
    // 추출해야 할 id들:
    //   clothing.top.style, accessories.hat.style, accessories.glasses.style,
    //   accessories.other.style, body.symbol.id
    const referencedIds = [];
    const push = (id) => {
      if (typeof id === "string" && id) referencedIds.push(id);
    };
    push(avatar?.clothing?.top?.style);
    push(avatar?.accessories?.hat?.style);
    push(avatar?.accessories?.glasses?.style);
    push(avatar?.accessories?.other?.style);
    push(avatar?.body?.symbol?.id);

    // 무료 / 미등록(=무시) / 유료로 분리. 미등록은 그냥 통과 (forward-compat).
    const paidIds = referencedIds.filter(
      (id) => isKnownItem(id) && !isFreeItem(id)
    );

    if (paidIds.length > 0) {
      const ownedRows = await stmts.findOwnedSubset.all(req.user.id, paidIds);
      const ownedSet = new Set(ownedRows.map((r) => r.item_id));
      const missing = paidIds.filter((id) => !ownedSet.has(id));
      if (missing.length > 0) {
        return res.status(400).json({
          error: "unowned_item",
          itemId: missing[0],
          missing,
        });
      }
    }
    // -------------------------------------------------------------------------

    await stmts.upsertAvatar.run(req.user.id, json);
    res.json({ ok: true, avatar });
  } catch (err) {
    next(err);
  }
});
