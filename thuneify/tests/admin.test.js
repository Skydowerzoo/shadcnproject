import request from "supertest";
import app from "../backend/server.mjs";

describe("Admin API", () => {
  let token;
  beforeAll(async () => {
    // Crée un utilisateur admin pour le test
    const email = `admin${Date.now()}@test.com`;
    const password = "adminpass123";
    await request(app)
      .post("/api/register")
      .send({ firstname: "Admin", lastname: "Test", email, password, role: "admin" });
    const res = await request(app)
      .post("/api/users/login")
      .send({ email, password });
    token = res.body.token;
  });

  it("GET /api/admin/stats-advanced should return 200 for admin", async () => {
    const res = await request(app)
      .get("/api/admin/stats-advanced")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("users");
    expect(res.body).toHaveProperty("logins30d");
  });
});
