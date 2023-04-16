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

// Fetches all students waiting on TA
// @param:session {string} session reference string
async function getActiveQueue(c) {
    const session = await c.req.query();

    try {
      const result = await faunaClient.query(
          Call(Function("getActiveQueue"), session)
      );
  
      return c.json(result);
    } catch (e) {
      return c.json(e);
    }
}

// Fetches all students currently with TAs
// @param:session {string}
async function getCurrentStudents(c) {
  const session = await c.req.query();

  try {
    const result = await faunaClient.query(
        Call(Function("getCurrentStudents"), session)
    );
    return c.json(result);
  } catch (e) {
    return c.json(e);
  }
};

// Returns student currently with specific TA
// @param:session {string}
// @param:instructor {string} username
async function getMyCurrentStudent(c) {
  const { session, instructor } = await c.req.json();

  try {
    const result = await faunaClient.query(
        Call(Function("getMyCurrentStudent"), session, instructor)
    );
    return c.json(result);
  } catch (e) {
    return c.json(e);
  }
};

// Add student to the queue
// @param:ref {string}
// @param:username {string}
// @param:sessionID {string}
// @param:position {int}
// @param:time {string ISO} - check pinned messages for formatting time strings!
async function createTicket(c) {
  const { ref, username, sessionID, position, time } = await c.req.json();

  try {
    const result = await faunaClient.query(
      Call(Function("createTicket"), ref, username, sessionID, position, time)
    );

    return c.json(result);
  } catch (e) {
    return c.json(e);
  }
};

// TA takes student in
// @param:ref {string}  reference to Ticket
// @param:instructor {string} TA username
async function acceptStudentTicket (c) {
  const { ref, instructor } = await c.req.json();

  try {
    const result = await faunaClient.query(
      Call(Function("acceptStudentTicket"), ref, instructor)
    );

    return c.json(result);
  } catch (e) {
    return c.json(e);
  }
};

// Deletes a ticket by reference
// @param:query ref - unique id of the ticket to delete
app.delete("/tickets", async (c) => {

    const { ref } = await c.req.json();
    
    try {
        const result = await faunaClient.query(
        Call(Function("deleteTicket"), ref)
        );
    
        return c.json(result);
    } catch (e) {
        return c.json(e);
    }
});

