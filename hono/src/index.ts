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
import {getClasses, putClasses, postClasses, deleteClasses } from "./classes";
import {getStudentClasses, addStudentClassForUser, createUser, addInstructorClassForUser, deleteUser} from "./users";
import {getSession, postSession, putSession, addInstructor, deleteSession} from "./sessions";
const { Call, Function, Paginate, Match, Index, Lambda, Get, Var, Map } =
    faunadb.query;

const faunaClient = new faunadb.Client({
  secret: "fnAFBncQWJAASbTQJZ9EssnEJxiaKKln11deXGwR",
});

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", logger());
app.use("*", prettyJSON());
app.get("/", (c) => c.text("OH! API v1.0.0"));

// CLASSES REQUESTS:
app.get('/classes', getClasses);
app.put('/classes', putClasses);
app.post('/classes', postClasses);
app.delete('/classes', deleteClasses);

app.get('/users', getStudentClasses);
app.put('/users/student', addStudentClassForUser);
app.post('/users', createUser);
app.put('/users/instructor', addInstructorClassForUser);
app.delete('/users', deleteUser);

app.get('/sessions', getSession);
app.put('/sessions', putSession);
app.post('/sessions', postSession);
app.put('/sessions/instructor', addInstructor);
app.delete('/sessions', deleteSession);





export default app;