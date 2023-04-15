/*
 * OH! (Office Hourly) Hono.js Backend
 *
 * Wildhacks Project, April 2023
 *
 * Radison Akerman, Leeza Andryushchenko
 * Richard Yang, Sengdao Inthavong
 */

import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import * as jose from "jose";
import { Bindings } from "hono/dist/types/types";
import faunadb from "faunadb";

const faunaClient = new faunadb.Client({
  secret: "fnAFBncQWJAASbTQJZ9EssnEJxiaKKln11deXGwR",
});
const { Call, Function, Paginate, Match, Index, Lambda, Get, Var, Map } =
  faunadb.query;

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", logger());
app.use("*", prettyJSON());
app.get("/", (c) => c.text("OH! API v1.0.0"));

export default app;