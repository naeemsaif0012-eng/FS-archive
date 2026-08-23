"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/api-entry.ts
var api_entry_exports = {};
__export(api_entry_exports, {
  app: () => app
});
module.exports = __toCommonJS(api_entry_exports);

// server/app.ts
var import_express = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
var import_helmet = __toESM(require("helmet"));
var import_express_rate_limit = __toESM(require("express-rate-limit"));
var import_morgan = __toESM(require("morgan"));
var import_multer = __toESM(require("multer"));
var import_sharp = __toESM(require("sharp"));
var import_bcryptjs = __toESM(require("bcryptjs"));

// server/config.ts
var import_config = require("dotenv/config");
var required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
};
var config = {
  port: Number(process.env.PORT ?? 3001),
  nodeEnv: process.env.NODE_ENV ?? "development",
  supabaseUrl: required("SUPABASE_URL"),
  supabaseServiceRoleKey: required("SUPABASE_SERVICE_ROLE_KEY"),
  jwtSecret: required("JWT_SECRET"),
  corsOrigins: (process.env.CORS_ORIGIN ?? "http://localhost:5000").split(",").map((value) => value.trim()).filter(Boolean),
  storageBucket: process.env.SUPABASE_STORAGE_BUCKET ?? "product-images"
};

// server/supabase.ts
var import_supabase_js = require("@supabase/supabase-js");
var supabase = (0, import_supabase_js.createClient)(config.supabaseUrl, config.supabaseServiceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });

// server/schemas.ts
var import_zod = require("zod");
var passwordSchema = import_zod.z.object({ password: import_zod.z.string().min(8).max(128) });
var changePasswordSchema = import_zod.z.object({ currentPassword: import_zod.z.string().min(8).max(128), newPassword: import_zod.z.string().min(8).max(128) });
var categorySchema = import_zod.z.object({ name: import_zod.z.string().trim().min(1).max(80), slug: import_zod.z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), main_category: import_zod.z.enum(["bags", "jewelry", "accessories", "home"]) });
var productSchema = import_zod.z.object({ name: import_zod.z.string().trim().min(1).max(160), subtitle: import_zod.z.string().max(200).default(""), description: import_zod.z.string().max(5e3).default(""), price: import_zod.z.coerce.number().nonnegative(), main_category: import_zod.z.enum(["bags", "jewelry", "accessories", "home"]), category: import_zod.z.string().max(80).default(""), status: import_zod.z.enum(["available", "reserved", "sold"]).default("available"), badge: import_zod.z.enum(["New", "Limited"]).nullable().default(null), quantity: import_zod.z.coerce.number().int().nonnegative().default(1), images: import_zod.z.array(import_zod.z.string().max(2048)).max(10).default([]), bg_class: import_zod.z.enum(["bg-surface-container", "bg-surface-container-high", "bg-surface-container-highest", "bg-surface-container-lowest", "bg-bone"]).default("bg-surface-container") });
var featuredSchema = import_zod.z.object({ productIds: import_zod.z.array(import_zod.z.coerce.number().int().positive()).length(4) });

// server/auth.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var signAdminToken = () => import_jsonwebtoken.default.sign({ role: "admin" }, config.jwtSecret, { expiresIn: "8h", issuer: "fs-archives" });
function requireAdmin(request, response, next) {
  const token = request.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return response.status(401).json({ error: "Unauthorized" });
  try {
    const payload = import_jsonwebtoken.default.verify(token, config.jwtSecret, { issuer: "fs-archives" });
    if (payload.role !== "admin") throw new Error("Unauthorized");
    request.admin = { role: "admin" };
    return next();
  } catch {
    return response.status(401).json({ error: "Unauthorized" });
  }
}

// server/app.ts
var app = (0, import_express.default)();
var upload = (0, import_multer.default)({ storage: import_multer.default.memoryStorage(), limits: { fileSize: 4 * 1024 * 1024, files: 10 }, fileFilter: (_req, file, callback) => callback(null, /^image\/(jpeg|png|webp|gif|avif)$/.test(file.mimetype)) });
app.use((0, import_helmet.default)({ crossOriginResourcePolicy: false }));
app.use((0, import_cors.default)({ origin: (origin, callback) => callback(null, !origin || config.corsOrigins.includes(origin)), methods: ["GET", "POST", "PUT", "DELETE"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use((0, import_morgan.default)(config.nodeEnv === "production" ? "combined" : "dev"));
app.use(import_express.default.json({ limit: "1mb" }));
app.use("/api", (0, import_express_rate_limit.default)({ windowMs: 15 * 60 * 1e3, limit: 300, standardHeaders: "draft-8", legacyHeaders: false }));
var parse = (schema, input, response) => {
  const result = schema.safeParse(input);
  if (!result.success) {
    response.status(400).json({ error: "Invalid input", details: result.error?.flatten() });
    return void 0;
  }
  ;
  return result.data;
};
var dbError = (response, error) => response.status(500).json({ error: error.message });
app.get("/api/products", async (request, response) => {
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (typeof request.query.main_category === "string") query = query.eq("main_category", request.query.main_category);
  const { data, error } = await query;
  return error ? dbError(response, error) : response.json(data);
});
app.get("/api/products/:id", async (request, response) => {
  const { data, error } = await supabase.from("products").select("*").eq("id", Number(request.params.id)).maybeSingle();
  if (error) return dbError(response, error);
  return data ? response.json(data) : response.status(404).json({ error: "Not found" });
});
app.post("/api/products", requireAdmin, async (request, response) => {
  const input = parse(productSchema, request.body, response);
  if (!input) return;
  const { data, error } = await supabase.from("products").insert(input).select().single();
  return error ? dbError(response, error) : response.status(201).json(data);
});
app.put("/api/products/:id", requireAdmin, async (request, response) => {
  const input = parse(productSchema, request.body, response);
  if (!input) return;
  const { data, error } = await supabase.from("products").update(input).eq("id", Number(request.params.id)).select().maybeSingle();
  if (error) return dbError(response, error);
  return data ? response.json(data) : response.status(404).json({ error: "Not found" });
});
app.delete("/api/products/:id", requireAdmin, async (request, response) => {
  const id = Number(request.params.id);
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return dbError(response, error);
  const { data: setting, error: settingError } = await supabase.from("store_settings").select("value").eq("key", "featured_product_ids").maybeSingle();
  if (!settingError && Array.isArray(setting?.value)) {
    const next = setting.value.map(Number).filter((value) => value !== id);
    await supabase.from("store_settings").upsert({ key: "featured_product_ids", value: next });
  }
  ;
  return response.json({ ok: true });
});
app.get("/api/categories", async (_request, response) => {
  const { data, error } = await supabase.from("categories").select("*").order("main_category").order("name");
  return error ? dbError(response, error) : response.json(data);
});
app.post("/api/categories", requireAdmin, async (request, response) => {
  const input = parse(categorySchema, request.body, response);
  if (!input) return;
  const { data: existing } = await supabase.from("categories").select("id").eq("slug", input.slug).maybeSingle();
  if (existing) {
    const { data: data2, error: error2 } = await supabase.from("categories").update(input).eq("id", existing.id).select().single();
    return error2 ? dbError(response, error2) : response.json(data2);
  }
  ;
  const { data: rows } = await supabase.from("categories").select("id").order("id", { ascending: false }).limit(1);
  const { data, error } = await supabase.from("categories").insert({ ...input, id: (rows?.[0]?.id ?? 0) + 1 }).select().single();
  return error ? dbError(response, error) : response.status(201).json(data);
});
app.put("/api/categories/:id", requireAdmin, async (request, response) => {
  const input = parse(categorySchema, request.body, response);
  if (!input) return;
  const { data, error } = await supabase.from("categories").update(input).eq("id", Number(request.params.id)).select().maybeSingle();
  if (error) return dbError(response, error);
  return data ? response.json(data) : response.status(404).json({ error: "Not found" });
});
app.delete("/api/categories/:id", requireAdmin, async (request, response) => {
  const { error } = await supabase.from("categories").delete().eq("id", Number(request.params.id));
  return error ? dbError(response, error) : response.json({ ok: true });
});
app.get("/api/featured-products", async (_request, response) => {
  const { data: setting, error } = await supabase.from("store_settings").select("value").eq("key", "featured_product_ids").maybeSingle();
  if (error) return dbError(response, error);
  const productIds = Array.isArray(setting?.value) ? setting.value.map(Number) : [1, 7, 13, 18];
  const { data: all, error: productsError } = await supabase.from("products").select("*");
  if (productsError) return dbError(response, productsError);
  const map = new Map((all ?? []).map((product) => [product.id, product]));
  return response.json({ productIds, items: productIds.map((id) => map.get(id)).filter(Boolean) });
});
app.put("/api/featured-products", requireAdmin, async (request, response) => {
  const input = parse(featuredSchema, request.body, response);
  if (!input) return;
  const { count, error: countError } = await supabase.from("products").select("*", { count: "exact", head: true }).in("id", input.productIds);
  if (countError) return dbError(response, countError);
  if (count !== 4) return response.status(400).json({ error: "One or more selected products do not exist" });
  const { error } = await supabase.from("store_settings").upsert({ key: "featured_product_ids", value: input.productIds });
  return error ? dbError(response, error) : response.json({ productIds: input.productIds });
});
var siteImageKeys = { hero: "hero_image", hero_mobile: "hero_image_mobile", bags: "catalog_image_bags", jewelry: "catalog_image_jewelry", accessories: "catalog_image_accessories", home: "catalog_image_home" };
app.get("/api/site-images", async (_request, response) => {
  const { data, error } = await supabase.from("store_settings").select("key,value").in("key", Object.values(siteImageKeys));
  if (error) return dbError(response, error);
  const map = new Map((data ?? []).map((row) => [row.key, row.value]));
  return response.json({ hero: map.get("hero_image") ?? null, hero_mobile: map.get("hero_image_mobile") ?? null, bags: map.get("catalog_image_bags") ?? null, jewelry: map.get("catalog_image_jewelry") ?? null, accessories: map.get("catalog_image_accessories") ?? null, home: map.get("catalog_image_home") ?? null });
});
app.put("/api/site-images", requireAdmin, async (request, response) => {
  const body = request.body ?? {};
  for (const [field, key] of Object.entries(siteImageKeys)) {
    const value = body[field];
    if (typeof value === "string" && value.trim()) {
      const { error } = await supabase.from("store_settings").upsert({ key, value: value.trim() }, { onConflict: "key" });
      if (error) return dbError(response, error);
    } else {
      const { error } = await supabase.from("store_settings").delete().eq("key", key);
      if (error) return dbError(response, error);
    }
  }
  ;
  return response.json({ ok: true });
});
app.get("/api/auth/me", requireAdmin, (_request, response) => response.json({ isLoggedIn: true }));
app.post("/api/auth/setup", async (request, response) => {
  const input = parse(passwordSchema, request.body, response);
  if (!input) return;
  const { data, error } = await supabase.from("admin_settings").select("value").eq("key", "admin_password_hash").maybeSingle();
  if (error) return dbError(response, error);
  if (data) return response.status(409).json({ error: "Admin already configured" });
  const hash = await import_bcryptjs.default.hash(input.password, 12);
  const { error: writeError } = await supabase.from("admin_settings").insert({ key: "admin_password_hash", value: hash });
  return writeError ? dbError(response, writeError) : response.json({ token: signAdminToken() });
});
app.post("/api/auth/login", async (request, response) => {
  const input = parse(passwordSchema, request.body, response);
  if (!input) return;
  const { data, error } = await supabase.from("admin_settings").select("value").eq("key", "admin_password_hash").maybeSingle();
  if (error) return dbError(response, error);
  if (!data) return response.status(409).json({ error: "Admin not configured" });
  return await import_bcryptjs.default.compare(input.password, data.value) ? response.json({ token: signAdminToken() }) : response.status(401).json({ error: "Invalid password" });
});
app.post("/api/auth/change-password", requireAdmin, async (request, response) => {
  const input = parse(changePasswordSchema, request.body, response);
  if (!input) return;
  const { data, error } = await supabase.from("admin_settings").select("value").eq("key", "admin_password_hash").maybeSingle();
  if (error) return dbError(response, error);
  if (!data) return response.status(409).json({ error: "Admin not configured" });
  if (!await import_bcryptjs.default.compare(input.currentPassword, data.value)) return response.status(401).json({ error: "Current password is incorrect" });
  const hash = await import_bcryptjs.default.hash(input.newPassword, 12);
  const { error: writeError } = await supabase.from("admin_settings").update({ value: hash }).eq("key", "admin_password_hash");
  return writeError ? dbError(response, writeError) : response.json({ ok: true });
});
app.post("/api/auth/logout", requireAdmin, (_request, response) => response.json({ ok: true }));
app.post("/api/upload", requireAdmin, upload.single("file"), async (request, response) => {
  if (!request.file) return response.status(400).json({ error: "An image file is required" });
  try {
    const webp = await (0, import_sharp.default)(request.file.buffer).rotate().webp({ quality: 85 }).toBuffer();
    const name = `${Date.now()}-${crypto.randomUUID()}.webp`;
    const { error } = await supabase.storage.from(config.storageBucket).upload(name, webp, { contentType: "image/webp", upsert: false });
    if (error) return dbError(response, error);
    const { data } = supabase.storage.from(config.storageBucket).getPublicUrl(name);
    return response.status(201).json({ url: data.publicUrl });
  } catch {
    return response.status(400).json({ error: "Unable to process image" });
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
