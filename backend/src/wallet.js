import express from "express";
import { stmts, withTx } from "./db.js";
import { requireAuth } from "./auth.js";
import { SHOP_CATALOG, isKnownItem, isFreeItem, getItemPrice } from "./shop-catalog.js";

export const walletRouter = express.Router();

// GET /api/wallet
walletRouter.get("/wallet", requireAuth, async (req, res, next) => {
  try {
    const walletRow = await stmts.getWallet.get(req.user.id);
    const balance = walletRow ? Number(walletRow.balance) : 0;
    const ownedRows = await stmts.listOwned.all(req.user.id);
    const ownedItemIds = ownedRows.map((r) => r.item_id);
    res.json({ balance, ownedItemIds });
  } catch (err) {
    next(err);
  }
});

// GET /api/shop/items
walletRouter.get("/shop/items", requireAuth, async (req, res, next) => {
  try {
    const items = Object.entries(SHOP_CATALOG).map(([id, meta]) => ({
      id,
      category: meta.category,
      price: meta.price,
      tier: meta.tier,
      free: meta.price === 0,
    }));
    res.json({ items });
  } catch (err) {
    next(err);
  }
});

// POST /api/shop/purchase  { itemId }
walletRouter.post("/shop/purchase", requireAuth, async (req, res, next) => {
  try {
    const { itemId } = req.body || {};
    if (!itemId || typeof itemId !== "string" || !isKnownItem(itemId)) {
      return res.status(400).json({ error: "invalid_item" });
    }
    const price = getItemPrice(itemId);

    // 원자적 transaction: 소유 INSERT → 통과 시 조건부 차감.
    const result = await withTx(async (tx) => {
      // Ensure wallet row.
      await tx.ensureWallet.run(req.user.id);

      // 1) Insert ownership (already_owned 식별).
      const insRow = await tx.insertOwned.get(req.user.id, itemId);
      if (!insRow) {
        return { error: "already_owned" };
      }

      // 2) Free items skip the spend step.
      if (price === 0) {
        const w = await tx.getWallet.get(req.user.id);
        return { balance: w ? Number(w.balance) : 0 };
      }

      // 3) Conditional decrement.
      const decRow = await tx.decrementWalletIfEnough.get(req.user.id, price);
      if (!decRow) {
        throw new Error("__insufficient_battery__"); // rollback via thrown
      }
      return { balance: Number(decRow.balance) };
    }).catch((err) => {
      if (err && err.message === "__insufficient_battery__") {
        return { error: "insufficient_battery" };
      }
      throw err;
    });

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    const ownedRows = await stmts.listOwned.all(req.user.id);
    res.json({
      ok: true,
      balance: result.balance,
      ownedItemIds: ownedRows.map((r) => r.item_id),
    });
  } catch (err) {
    next(err);
  }
});
