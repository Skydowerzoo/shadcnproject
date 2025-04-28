import request from "supertest";
import app from "../backend/server.mjs";

describe("Grocery API", () => {
  let createdId;

  it("GET /api/grocery should return 200", async () => {
    const res = await request(app).get("/api/grocery");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/grocery should create a grocery item", async () => {
    const res = await request(app)
      .post("/api/grocery")
      .send({ name: "Test produit", category: "Test" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    createdId = res.body.id;
  });

  it("PUT /api/grocery/:id should update a grocery item", async () => {
    const res = await request(app)
      .put(`/api/grocery/${createdId}`)
      .send({ name: "Produit modifié", category: "Test" });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Produit modifié");
  });

  it("DELETE /api/grocery/:id should delete a grocery item", async () => {
    const res = await request(app).delete(`/api/grocery/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });
});
