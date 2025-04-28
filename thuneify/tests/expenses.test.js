import request from "supertest";
import app from "../backend/server.mjs";

describe("Expenses API", () => {
  let createdId;

  it("GET /api/expenses should return 200", async () => {
    const res = await request(app).get("/api/expenses");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/expenses should create an expense", async () => {
    const res = await request(app)
      .post("/api/expenses")
      .send({ date: "2025-04-28", perso: 10, commun: 5 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    createdId = res.body.id;
  });

  it("PUT /api/expenses/:id should update an expense", async () => {
    const res = await request(app)
      .put(`/api/expenses/${createdId}`)
      .send({ date: "2025-04-29", perso: 20, commun: 10 });
    expect(res.statusCode).toBe(200);
    expect(res.body.perso).toBe(20);
  });

  it("DELETE /api/expenses/:id should delete an expense", async () => {
    const res = await request(app).delete(`/api/expenses/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });
});
