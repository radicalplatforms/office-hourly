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
import { customAlphabet } from "nanoid";
import faunadb from "faunadb";
// const fetch = require('node-fetch');
import { createUser } from "./users";
const { Call, Function, Paginate, Match, Index, Lambda, Get, Var, Map } =
  faunadb.query;

const nanoid = customAlphabet("1234567890", 6);

export async function retrieveUserReference(c) {
  const response = await fetch(
    "https://api.author.rakerman.com/api/auth0/user",
    {
      method: "GET",
      headers: { Authorization: c },
    }
  );
  const data = await response.json();
  // convert username to reference:
  const temp2 = await faunaClient.query(
    Call(Function("getUserByUsername"), data.profile.username)
  );
  if (temp2.data.length === 0) {
    // create user:
    const ref = nanoid();
    const result = await faunaClient.query(
      Call(Function("createUser"), ref, data.profile.username, false)
    );
    return ref;
  } else {
    return temp2.data[0];
  }
}

const faunaClient = new faunadb.Client({
  secret: "fnAFBncQWJAASbTQJZ9EssnEJxiaKKln11deXGwR",
});

export async function getClasses(c) {
  try {
    const token = await c.req.header("Authorization");
    const ref = await retrieveUserReference(token);
    // try to query database:
    const result = await faunaClient.query(
      Call(Function("getAllUserClasses"), ref)
    );
    // send response
    return c.json(result);
  } catch (e) {
    return c.json(e);
  }
}

export async function putClasses(c) {
  const data = await c.req.json();

  try {
    const result = await faunaClient.query(
      Call(Function("updateClass"), data.ref, data.title, data.number)
    );
    return c.text("Completed");
  } catch (e) {
    return c.json(e);
  }
}

export const classSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title must be 50 characters or fewer" }),
  number: z
    .string()
    .trim()
    .max(10, { message: "Number must be 10 characters or fewer" }),
});

export async function postClasses(c) {
  const token = await c.req.header("Authorization");
  const userRef = await retrieveUserReference(token);
  const data = await c.req.json();
  const classRef = nanoid();
  try {
    // create the class
    const temp = await faunaClient.query(
      Call(Function("createClass"), classRef, data.title, data.number)
    );
    // put user as an admin of the course
    const result = await faunaClient.query(
      Call(Function("addInstructorClassForUser"), userRef, classRef, true)
    );
    return c.json(temp);
  } catch (e) {
    return c.json(e);
  }
}

export async function deleteClasses(c) {
  const ref = await c.req.header("ref");
  try {
    const result = await faunaClient.query(Call(Function("deleteClass"), ref));
    return c.text("Completed");
  } catch (e) {
    return c.json(e);
  }
}