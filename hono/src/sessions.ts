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

import { customAlphabet } from "nanoid";
const { Call, Function } = faunadb.query;

const nanoid = customAlphabet("1234567890", 6);

const faunaClient = new faunadb.Client({
  secret: "fnAFBncQWJAASbTQJZ9EssnEJxiaKKln11deXGwR",
});

// GET session from reference ID
export async function getSession(c) {
  const ref = await c.req.header("ref");

  try {
    const result = await faunaClient.query(Call(Function("getSession"), ref));
    return c.json(result);
  } catch (e) {
    return c.json(e);
  }
}

/**
 * Sets limits for what a valid input is
 *for a post request
 */
export const sessionSchema = z.object({
  // ref: z
  //   .string()
  //   .trim()
  //   .regex(/^[0-9]+$/, {
  //     message: "Ref must be a number",
  //   }),
  classRef: z
    .string()
    .trim()
    .regex(/^[0-9]+$/, {
      message: "Class ID must be a number",
    }),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters long",
  }),
  start: z.string(), // string().datetime(),
  end: z.string(), // string().datetime(),
  instructors: z.array(
    z
      .string()
      .min(2, {
        message: "Instructor name must be at least 1 character long",
      })
      .max(24, { message: "Instructor name must be 1-24 characters long" })
  ),
});

// CREATE a new session
export async function postSession(c) {
  const data = await c.req.json();
  // console.log(data);
  try {
    // console.log(data.instructors[0]);
    const result = await faunaClient.query(
      Call(
        Function("createSession"),
        nanoid(),
        data.classRef,
        data.title,
        data.start + ":00Z",
        data.end + ":00Z",
        data.instructors
      )
    );
    // console.log(result);
    // console.log(result.ref.id);
    return c.json(result);
  } catch (e) {
    return c.json(e);
  }
}

/**
 * Sets limits for what a valid input is
 *for a put request of a session and instructor
 */

export const putSessionSchema = z.object({
  ref: z
    .string()
    .trim()
    .regex(/^[0-9]+$/, {
      message: "Ref must be a number",
    }),
  classID: z
    .string()
    .trim()
    .regex(/^[0-9]+$/, {
      message: "Class ID must be a number",
    }),
  title: z.string().max(50),
  start: z.string().datetime(),
  end: z.string().datetime(),
  instructor: z.array(
    z
      .string()
      .min(2, {
        message: "Instructor name must be at least 1 character long",
      })
      .max(24, {
        message: "Instructor name must be 1-24 characters long",
      })
  ),
});

// UPDATE sesssion
export async function putSession(c) {
  const data = await c.req.json();
  try {
    const result = await faunaClient.query(
      Call(
        Function("updateSession"),
        data.ref,
        data.classID,
        data.title,
        data.start,
        data.end,
        data.instructor
      )
    );
    return c.text("Complete");
  } catch (e) {
    return c.json(e);
  }
}

export const addInstructorSchema = z.object({
  ref: z
    .string()
    .trim()
    .regex(/^[0-9]+$/, {
      message: "Ref must be a number",
    }),
  instructor: z
    .string()
    .min(2, {
      message: "Instructor name must be at least 1 character long",
    })
    .max(24, {
      message: "Instructor name must be 1-24 characters long",
    }),
});

// ADD instructor to the session
export async function addInstructor(c) {
  const data = await c.req.json();
  try {
    const result = await faunaClient.query(
      Call(Function("addInstructorToSession"), data.ref, data.Instructor)
    );
    return c.text("Complete");
  } catch (e) {
    return c.json(e);
  }
}

// DELETE the session
export async function deleteSession(c) {
  const ref = await c.req.header("ref");
  try {
    const result = faunaClient.query(Call(Function("deleteSession"), ref));
    return c.text("Complete");
  } catch (e) {
    return c.json(e);
  }
}