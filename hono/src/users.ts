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
import { retrieveUserReference } from "./classes";
const { Call, Function, Paginate, Match, Index, Lambda, Get, Var, Map } =
  faunadb.query;

const faunaClient = new faunadb.Client({
  secret: "fnAFBncQWJAASbTQJZ9EssnEJxiaKKln11deXGwR",
});

export async function getStudentsByClass(c) {
  try {
    const class_id = await c.req.header("class");
    // try to query database:
    const result = await faunaClient.query(
      Call(Function("getStudentsByClass"), class_id)
    );
    // send response
    return c.json(result);
  } catch (e) {
    return c.json(e);
  }
}

// returns all instructors in the class
export async function getInstructorsInClass(c) {
  try {
    const class_id = await c.req.header("ClassRef");
    let result = await faunaClient.query(
      Call(Function("getInstructorsByClass"), class_id)
    );
    let instructors = [];
    for (let i = 0; i < result.length; i++) {
      const response = await fetch(
        "https://api.author.rakerman.com/api/rf/user/" +
          result[i].data.username,
        {
          method: "GET",
          headers: { Authorization: "69ODR2OsRk64IqIUg2" },
        }
      );
      const data = await response.json();
      instructors[i] = data;
    }
    return c.json(instructors);
  } catch (e) {
    return c.json(e);
  }
}

export const addStudentuserSchema = z.object({
  ref: z
    .string()
    .trim()
    .regex(/^[0-9]+$/, {
      message: "Ref must be a number",
    }),
  class_id: z
    .string()
    .trim()
    .regex(/^[0-9]+$/, {
      message: "Class ID must be a number",
    }),
});

export async function addStudentClassForUser(c) {
  // get parameters:
  const data = await c.req.json();
  // get user reference authorization:
  const token = await c.req.header("Authorization");
  const ref = await retrieveUserReference(token);
  // query the database for update
  try {
    const result = await faunaClient.query(
      Call(Function("addStudentClassForUser"), ref, data.class_id)
    );
    return c.json(result);
  } catch (e) {
    return c.json(e);
  }
}

export const userSchema = z.object({
  ref: z
    .string()
    .trim()
    .regex(/^[0-9]+$/, {
      message: "Ref must be a number",
    }),
  username: z.string().trim(),
  isAdmin: z.boolean(),
});

export async function createUser(c) {
  const data = await c.req.json();
  try {
    const result = await faunaClient.query(
      Call(Function("createUser"), data.ref, data.username, data.isAdmin)
    );
    return c.json(result);
  } catch (e) {
    return c.json(e);
  }
}

export const addInstructoruserSchema = z.object({
  ref: z
    .string()
    .trim()
    .regex(/^[0-9]+$/, {
      message: "Ref must be a number",
    }),
  class_id: z
    .string()
    .trim()
    .regex(/^[0-9]+$/, {
      message: "Class ID must be a number",
    }),
  isAdmin: z.boolean(),
});

export async function addInstructorClassForUser(c) {
  // get parameters:
  const data = await c.req.json();
  // get user reference authorization:
  const token = await c.req.header("Authorization");
  const ref = await retrieveUserReference(token);
  // query the database:
  try {
    const result = await faunaClient.query(
      Call(
        Function("addInstructorClassForUser"),
        ref,
        data.classID,
        data.isAdmin
      )
    );
    return c.json(result);
  } catch (e) {
    return c.json(e);
  }
}

export async function getEstimatedWaitTime(c) {
  const session_id = await c.req.header("session_id");
  try {
    const result = await faunaClient.query(
      Call(Function("getEstimatedWaitTime"), session_id)
    );
    return c.json(result);
  } catch (e) {
    return c.json(e);
  }
}

export async function deleteUser(c) {
  // get user reference:
  const token = await c.req.header("Authorization");
  const ref = await retrieveUserReference(token);
  // remove user:
  try {
    const result = await faunaClient.query(Call(Function("deleteUser"), ref));
    return c.json(result);
  } catch (e) {
    return c.json(e);
  }
}