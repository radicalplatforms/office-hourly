import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const schema = z.object({
  title: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9 ]+$/, {
      message: "Title can only contain letters, numbers, and spaces",
    })
    .min(6, { message: "Title must be 6-24 characters long" })
    .max(24, { message: "Title must be 6-24 characters long" }),
  num: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9 ]+$/, {
      message:
        "Subject, Course Number can only contain letters, numbers, and spaces",
    })
    .min(6, { message: "Subject, Course Number must be 6-12 characters long" })
    .max(12, {
      message: "Subject, Course Number must be 6-12 characters long",
    }),
  term: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9 ]+$/, {
      message: "Term can only contain letters, numbers, and spaces",
    })
    .min(6, { message: "Title must be 6-12 characters long" })
    .max(12, { message: "Title must be 6-12 characters long" }),
});

export class Course {
  title: string = "";
  num: string = "";
  term: string = "";

  state: DurableObjectState;
  app: Hono = new Hono();

  constructor(state: DurableObjectState) {
    this.state = state;

    this.state.blockConcurrencyWhile(async () => {
      this.title = (await this.state.storage.get("title")) || "";
      this.num = (await this.state.storage.get("num")) || "";
      this.term = (await this.state.storage.get("term")) || "";
    });

    this.app.get("/api/course", async (c) => {
      return c.json({
        title: this.title,
        num: this.num,
        term: this.term,
      });
    });

    this.app.post("/api/course", zValidator("json", schema), async (c) => {
      let body = await c.req.valid("json");

      await this.state.storage?.put("title", body.title);
      await this.state.storage?.put("num", body.num);
      await this.state.storage?.put("term", body.term);

      return c.json({
        title: (this.title = body.title),
        num: (this.num = body.num),
        term: (this.term = body.term),
      });
    });

    this.app.delete("/api/course", async (c) => {
      return this.state.storage?.deleteAll();
    });
  }

  async fetch(request: Request) {
    return this.app.fetch(request);
  }
}