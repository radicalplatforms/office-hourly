import { Hono } from "hono";

class Course {
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}

export class User {
  courses: Course[] = [];
  state: DurableObjectState;
  app: Hono = new Hono();

  constructor(state: DurableObjectState) {
    this.state = state;

    this.state.blockConcurrencyWhile(async () => {
      this.courses = (await this.state.storage.get("courses")) || [];
    });

    this.app.get("/courses", async (c) => {
      return c.text(this.courses.toString());
    });

    this.app.post("/course", async (c) => {
      return c.text(this.courses.toString());
    });
  }

  async fetch(request: Request) {
    return this.app.fetch(request);
  }
}