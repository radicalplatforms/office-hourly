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



export async function getClasses(c) {
    try { 
        const username = await c.req.header("username");
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


export async function putClasses(c) {
    const data = await c.req.json();

    try {
        const result = await faunaClient.query(
            Call(Function("updateClass"), data.ref, data.title, data.number)
        );
        return c.text("Completed");
    } catch(e) {
        return c.json(e);
    }

}


export async function postClasses(c) {
    const data = await c.req.json();
    try{
        const result = await faunaClient.query(
            Call(Function("createClass"), data.ref, data.title, data.number)
        );
        return c.json(result);
    } catch(e) {
        return c.json(e);
    }
}

export async function deleteClasses(c) {
    const ref = await c.req.header("ref");
    try{
        const result = await faunaClient.query(
            Call(Function("deleteClass"), ref)
        );
        return c.text("Completed");
    }
    catch(e) {
        return c.json(e);
    }
}