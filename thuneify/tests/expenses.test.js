import request from "supertest";
import app from "../backend/server.mjs";
test("GET /api/expenses", async () => {
  const res = await request(app).get("/api/expenses");
  expect(res.statusCode).toBe(200);
});
