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
const { Call, Function, Paginate, Match, Index, Lambda, Get, Var, Map } =
    faunadb.query;

const faunaClient = new faunadb.Client({
  secret: "fnAFBncQWJAASbTQJZ9EssnEJxiaKKln11deXGwR",
});

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", logger());
app.use("*", prettyJSON());
app.get("/", (c) => c.text("OH! API v1.0.0"));

async function getUsers(c) {
    try { 
        const { username } = await c.req.query();

        // try to query database:
        const result = await faunaClient.query(
            Call(Function("getUser"), username)
        );
        // send response
        return c.json(result);
    } catch (e) {
        return c.json(e);
    }
}


async function putUsers(c) {
    const data = await c.req.json();

    try {
        const result = await faunaClient.query(
            Call(Function("updateUser", data.ref, data.username, data.isInstructor, data.instructorClasses, data.isStudent, data.studentClasses))
        );
        return c.json(result);
    } catch(e) {
        return c.json(e);
    }

}

async function postUsers(c) {
    const data = await c.req.json();
    try{
        const result = await faunaClient.query(
            Call(Function("createUser", data.ref, data.username, data.isInstructor, data.instructorClasses, data.isStudent, data.studentClasses))
        );
        return c.json(result);
    } catch(e) {
        return c.json(e);
    }
}

async function deleteUsers(c) {
    const data = await c.req.json();
    try{
        const result = await faunaClient.query(
            Call(Function("deleteUser", data.ref))
        );
        return c.json(result);
    }
    catch(e) {
        return c.json(e);
    }
}

export default app;