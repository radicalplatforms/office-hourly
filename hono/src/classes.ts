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
const fetch = require('node-fetch');
const { Call, Function, Paginate, Match, Index, Lambda, Get, Var, Map } =
    faunadb.query;

const faunaClient = new faunadb.Client({
  secret: "fnAFBncQWJAASbTQJZ9EssnEJxiaKKln11deXGwR",
});



export async function getClasses(c) {
    try { 
        const token = await c.req.header("Authorization");
        const username = await c.req.header("username");
        // get username from Auth0r:
        const response = await fetch('https://api.author.rakerman.com/api/auth0/user', {
            method: 'GET',
            headers: { 'Authorization': token }
        });
        console.log(response.body);
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

export const classSchema = z.object({
    ref: z
      .string()
      .trim()
      .regex(/^[0-9]+$/, {
        message: "Ref must be a number",
      }),
    title: z
      .string()
      .trim()
      .min(1, { message: "Title is required" })
      .max(255, { message: "Title must be 50 characters or fewer" }),
    number: z
      .string()
      .trim()
      .max(5, { message: "Number must be 5 numbers or fewer" })
  });
  
export async function postClasses(c) {
    const username = c.req.header("username");
    // const ref = c.req.header("ref");
    const data = await c.req.json();
    try{
        // create the class
        const temp = await faunaClient.query(
            Call(Function("createClass"), data.ref, data.title, data.number)
        );
        // get ref from username:
        const temp2 = await faunaClient.query(
            Call(Function("getUserByUsername"), username)
        );
        // put user as an admin of the course
        const result = await faunaClient.query(
            Call(Function("addInstructorClassForUser"), temp2.data[0], temp.data.ref, true)
        );
        return c.json(temp); 
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