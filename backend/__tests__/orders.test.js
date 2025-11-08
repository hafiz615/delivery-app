import request from "supertest";
import app from "../src/server.js";

let authToken;
let testOrderId;

beforeAll(async () => {
  // Login to get auth token
  const response = await request(app).post("/auth/login").send({
    email: "test@example.com",
    password: "password123",
  });
  authToken = response.body.token;
});

describe("Orders API", () => {
  describe("POST /orders", () => {
    test("should create DELIVERY order with valid data", async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 2);

      const response = await request(app)
        .post("/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          delivery_type: "DELIVERY",
          delivery_address: "123 Main St, City, State 12345",
          delivery_time: futureDate.toISOString(),
          special_instructions: "Ring doorbell twice",
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.delivery_type).toBe("DELIVERY");
      expect(response.body.delivery_address).toBe(
        "123 Main St, City, State 12345"
      );

      testOrderId = response.body.id;
    });

    test("should create IN_STORE order with pickup location", async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 3);

      const response = await request(app)
        .post("/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          delivery_type: "IN_STORE",
          pickup_location: "Downtown Store",
          delivery_time: futureDate.toISOString(),
        });

      expect(response.status).toBe(201);
      expect(response.body.delivery_type).toBe("IN_STORE");
      expect(response.body.pickup_location).toBe("Downtown Store");
    });

    test("should create CURBSIDE order with pickup location", async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);

      const response = await request(app)
        .post("/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          delivery_type: "CURBSIDE",
          pickup_location: "Mall Location",
          delivery_time: futureDate.toISOString(),
        });

      expect(response.status).toBe(201);
      expect(response.body.delivery_type).toBe("CURBSIDE");
    });

    test("should reject past delivery time", async () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 1);

      const response = await request(app)
        .post("/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          delivery_type: "DELIVERY",
          delivery_address: "456 Oak Ave",
          delivery_time: pastDate.toISOString(),
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    test("should require delivery address for DELIVERY type", async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 2);

      const response = await request(app)
        .post("/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          delivery_type: "DELIVERY",
          delivery_time: futureDate.toISOString(),
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    test("should require pickup location for IN_STORE type", async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 2);

      const response = await request(app)
        .post("/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          delivery_type: "IN_STORE",
          delivery_time: futureDate.toISOString(),
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    test("should require authentication", async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 2);

      const response = await request(app).post("/orders").send({
        delivery_type: "DELIVERY",
        delivery_address: "123 Main St",
        delivery_time: futureDate.toISOString(),
      });

      expect(response.status).toBe(401);
    });
  });

  describe("GET /orders/:id", () => {
    test("should get order by id", async () => {
      const response = await request(app)
        .get(`/orders/${testOrderId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", testOrderId);
    });

    test("should return 404 for non-existent order", async () => {
      const response = await request(app)
        .get("/orders/999999")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    test("should require authentication", async () => {
      const response = await request(app).get(`/orders/${testOrderId}`);

      expect(response.status).toBe(401);
    });
  });

  describe("PUT /orders/:id", () => {
    test("should update order", async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 5);

      const response = await request(app)
        .put(`/orders/${testOrderId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          delivery_type: "DELIVERY",
          delivery_address: "789 New Address",
          delivery_time: futureDate.toISOString(),
          special_instructions: "Updated instructions",
        });

      expect(response.status).toBe(200);
      expect(response.body.delivery_address).toBe("789 New Address");
    });

    test("should validate on update", async () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 1);

      const response = await request(app)
        .put(`/orders/${testOrderId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          delivery_type: "DELIVERY",
          delivery_address: "123 Main St",
          delivery_time: pastDate.toISOString(),
        });

      expect(response.status).toBe(400);
    });
  });
});
