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
const { Call, Function } = faunadb.query;

const faunaClient = new faunadb.Client({
  secret: "fnAFBncQWJAASbTQJZ9EssnEJxiaKKln11deXGwR",
});

// GET session from reference ID
export async function getSession(c) {
    const { ref } = c.req.query();

    try {
        const result = await faunaClient.query(
            Call(Function("getSession"), ref)
        );
    } catch(e) {
        return c.json(e);
    }
}

// CREATE a new session
export async function postSession(c) {
    const data = c.req.json();
    try {
        const result = await faunaClient.query(
            Call(Function("createSession"), data.ref, data.classID, data.title, data.Start, data.End, data.Instructor)
        );
        return c.json(result);
    } catch(e) {
        return c.json(e);
    }
}

// UPDATE sesssion
export async function putSession(c) {
    const data = c.req.json();
    try {
        const result = await faunaClient.query(
            Call(Function("updateSession"), data.ref, data.classID, data.title, data.Start, data.End, data.Instructor)
        );
        return c.json(result);
    } catch(e) {
        return c.json(e);
    }
}


// ADD instructor to the session
export async function addInstructor(c) {
    const data = c.req.json();
    try {
        const result = await faunaClient.query(
            Call(Function("addInstructorToSession"), data.ref, data.instructor)
        )
        return c.json(result);
    } catch(e) {
        return c.json(e);
    }
}

// DELETE the session
export async function deleteSession(c) {
    const { ref } = c.req.query();
    try {
        const result = faunaClient.query(
            Call(Function("deleteSession"), ref)
        )
        return c.json(result);
    } catch (e) {
        return c.json(e);
    }
}