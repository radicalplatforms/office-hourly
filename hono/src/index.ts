/*
 * RAkerman Status Hono.js Backend
 *
 * Radison Akerman, April 2023
 * RAkerman Foundation, RAkerman Status
 */

import { Context, Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import * as jose from "jose";

export { Course } from "./durables/course";

type Bindings = {
  COURSE: DurableObjectNamespace;
  ENVIRONMENT: string;
};

const prodDomains = ["rakerman.com", "rakerman.workers.dev"];
const devDomains = ["rakerman.workers.dev", "localhost:3000", "localhost:8787"];

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => c.text("OH! API v1.0.0"));

app.use("*", logger());
app.use("*", prettyJSON());

function isValidOrigin(origin: string | null, c: Context) {
  if (origin === null) return false;
  // Set domains based on environment
  let domains: string[] = [];
  if (c.env.ENVIRONMENT === "production") domains = prodDomains;
  else if (c.env.ENVIRONMENT === "dev") domains = devDomains;
  // Loop over domains in environment
  for (const domain of domains) {
    if (origin.endsWith(domain)) return true;
  }
  // Couldn't find a valid domain, return false
  console.log("Invalid Origin: '" + origin + "'");
  return false;
}

app.use("/api/*", async (c, next) => {
  const corsMiddleware = cors({
    origin: (origin) => {
      return isValidOrigin(origin, c) ? origin : "https://rakerman.com";
    },
  });
  return corsMiddleware(c, next);
});

/* ============================================================================================== *
 * Auth0 API, to be called by frontend users authenticated using Auth0
 * ============================================================================================== */

async function authorFetchAuth0User(c: Context) {
  // Fetch user from Author
  const userAuthor = await fetch(
    "https://api.author.rakerman.com/api/auth0/user",
    {
      method: "GET",
      headers: {
        Authorization: c.req.header("Authorization") || "",
      },
    }
  );
  // Return
  return await userAuthor.json();
}

async function authorFetchRFUser(username: string) {
  // Fetch user from Author
  const userAuthor = await fetch(
    "https://api.author.rakerman.com/api/rf/user/" + username,
    {
      method: "GET",
    }
  );
  // Return
  return await userAuthor.json();
}

/*
 * GET /api/course
 */
app.get("/api/course", async (c) => {
  const course = "cs101";

  const id = c.env.COURSE.idFromName(course);
  const obj = c.env.COURSE.get(id);
  const resp = await obj.fetch(new Request(c.req.url, { method: "GET" }));

  return c.json(await resp.json());
});

/*
 * POST /api/course
 */
app.post("/api/course", async (c) => {
  const course = "cs101";

  const id = c.env.COURSE.idFromName(course);
  const obj = c.env.COURSE.get(id);
  const resp = await obj.fetch(
    new Request(c.req.url, { method: "POST", body: c.req.body })
  );

  return c.json(await resp.json());
});

export default app;