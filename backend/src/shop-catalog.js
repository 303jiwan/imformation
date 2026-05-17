// backend/src/shop-catalog.js
// Frontend shop-catalog.js 와 동일 데이터. ID/가격 불일치는 보안 이슈.

export const SHOP_CATALOG = {
  'top-tee':     { category: 'top', price: 0,   tier: 'free' },
  'top-tank':    { category: 'top', price: 0,   tier: 'free' },
  'top-hoodie':  { category: 'top', price: 30,  tier: 'common' },
  'top-stripe':  { category: 'top', price: 30,  tier: 'common' },
  'top-shirt':   { category: 'top', price: 30,  tier: 'common' },
  'top-jacket':  { category: 'top', price: 100, tier: 'premium' },
  'top-polo':    { category: 'top', price: 100, tier: 'premium' },
  'hat-cap':     { category: 'hat', price: 0,   tier: 'free' },
  'hat-beanie':  { category: 'hat', price: 0,   tier: 'free' },
  'hat-tophat':  { category: 'hat', price: 30,  tier: 'common' },
  'hat-fedora':  { category: 'hat', price: 30,  tier: 'common' },
  'hat-bucket':  { category: 'hat', price: 30,  tier: 'common' },
  'hat-beret':   { category: 'hat', price: 100, tier: 'premium' },
  'hat-visor':   { category: 'hat', price: 100, tier: 'premium' },
  'glasses-round':  { category: 'glasses', price: 0,   tier: 'free' },
  'glasses-square': { category: 'glasses', price: 0,   tier: 'free' },
  'glasses-sun':    { category: 'glasses', price: 30,  tier: 'common' },
  'glasses-cat':    { category: 'glasses', price: 30,  tier: 'common' },
  'glasses-oval':   { category: 'glasses', price: 30,  tier: 'common' },
  'glasses-heart':  { category: 'glasses', price: 100, tier: 'premium' },
  'glasses-mono':   { category: 'glasses', price: 100, tier: 'premium' },
  'acc-bolt-pin':  { category: 'other', price: 0,   tier: 'free' },
  'acc-star-pin':  { category: 'other', price: 0,   tier: 'free' },
  'acc-bow':       { category: 'other', price: 30,  tier: 'common' },
  'acc-flame-pin': { category: 'other', price: 30,  tier: 'common' },
  'acc-gear-pin':  { category: 'other', price: 30,  tier: 'common' },
  'acc-crown':     { category: 'other', price: 100, tier: 'premium' },
  'acc-halo':      { category: 'other', price: 100, tier: 'premium' },
  'sym-bolt':  { category: 'symbol', price: 0,   tier: 'free' },
  'sym-heart': { category: 'symbol', price: 30,  tier: 'common' },
  'sym-star':  { category: 'symbol', price: 30,  tier: 'common' },
  'sym-code':  { category: 'symbol', price: 30,  tier: 'common' },
  'sym-cog':   { category: 'symbol', price: 100, tier: 'premium' },
  'sym-flame': { category: 'symbol', price: 100, tier: 'premium' },
};

export function isFreeItem(id) {
  const e = SHOP_CATALOG[id];
  return !!(e && e.price === 0);
}
export function getItemPrice(id) {
  return SHOP_CATALOG[id]?.price ?? null;
}
export function isKnownItem(id) {
  return Object.prototype.hasOwnProperty.call(SHOP_CATALOG, id);
}
