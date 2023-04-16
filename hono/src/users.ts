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


export async function addStudentClassForUser(c) {
    const data = await c.req.json();

    try {
        const result = await faunaClient.query(
            Call(Function("addStudentClassForUser"), data.ref, data.class_id)
        );
        return c.json(result);
    } catch(e) {
        return c.json(e);
    }

}

export async function createUser(c) {
    const data = await c.req.json();
    try{
        const result = await faunaClient.query(
            Call(Function("createUser"), data.ref, data.username, data.isAdmin)
        );
        return c.json(result);
    } catch(e) {
        return c.json(e);
    }
}

export async function addInstructorClassForUser(c) {
    const data = await c.req.json();
    try{
        const result = await faunaClient.query(
            Call(Function("addInstructorClassForUser"), data.ref, data.classID, data.isAdmin)
        );
        return c.json(result);
    } catch(e) {
        return c.json(e);
    }
}

export async function deleteUser(c) {
    const data = await c.req.json();
    try{
        const result = await faunaClient.query(
            Call(Function("deleteUser"), data.ref)
        );
        return c.json(result);
    }
    catch(e) {
        return c.json(e);
    }
}
