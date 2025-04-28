import request from "supertest";
import app from "../backend/server.mjs";

describe("Users API", () => {
  let userId;
  let token;
  const email = `testuser${Date.now()}@test.com`;
  const password = "testpass123";

  it("POST /api/register should create a user", async () => {
    const res = await request(app)
      .post("/api/register")
      .send({ firstname: "Test", lastname: "User", email, password });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    userId = res.body.id;
  });

  it("POST /api/users/login should login and return a token", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email, password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("GET /api/users/:id should return user info", async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", email);
  });

  it("PUT /api/users/:id should update user info", async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ firstname: "Updated", lastname: "User", email });
    expect(res.statusCode).toBe(200);
    expect(res.body.firstname).toBe("Updated");
  });
});
