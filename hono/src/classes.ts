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



async function getClasses(c) {
    try { 
        const { username } = await c.req.query();

        // try to query database:
        const result = await faunaClient.query(
            Call(Function("getStudentClasses"), username)
        );
        // send response
        return c.json(result);
    } catch (e) {
        return c.json(e);
    }
}


async function putClasses(c) {
    const data = await c.req.json();

    try {
        const result = await faunaClient.query(
            Call(Function("updateClass", data.ref, data.title, data.number))
        );
        return c.json(result);
    } catch(e) {
        return c.json(e);
    }

}

async function postClasses(c) {
    const data = await c.req.json();
    try{
        const result = await faunaClient.query(
            Call(Function("createClass", data.ref, data.title, data.number))
        );
        return c.json(result);
    } catch(e) {
        return c.json(e);
    }
}

async function deleteClasses(c) {
    const data = await c.req.json();
    try{
        const result = await faunaClient.query(
            Call(Function("deleteClass", data.ref))
        );
        return c.json(result);
    }
    catch(e) {
        return c.json(e);
    }
}