import express from "express";
import Joi from "joi";
import pool from "../config/database.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

const orderSchema = Joi.object({
  delivery_type: Joi.string()
    .valid("IN_STORE", "DELIVERY", "CURBSIDE")
    .required(),
  delivery_address: Joi.string().when("delivery_type", {
    is: "DELIVERY",
    then: Joi.required(),
    otherwise: Joi.optional().allow(null, ""),
  }),
  delivery_time: Joi.date().iso().greater("now").required(),
  pickup_location: Joi.string().when("delivery_type", {
    is: Joi.string().valid("IN_STORE", "CURBSIDE"),
    then: Joi.required(),
    otherwise: Joi.optional().allow(null, ""),
  }),
  special_instructions: Joi.string().optional().allow(null, ""),
});

router.post("/orders", authenticateToken, async (req, res) => {
  try {
    const { error } = orderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const {
      delivery_type,
      delivery_address,
      delivery_time,
      pickup_location,
      special_instructions,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO orders (user_id, delivery_type, delivery_address, delivery_time, pickup_location, special_instructions)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        req.user.id,
        delivery_type,
        delivery_address,
        delivery_time,
        pickup_location,
        special_instructions,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/orders/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM orders WHERE id = $1 AND user_id = $2",
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/orders/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = orderSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const {
      delivery_type,
      delivery_address,
      delivery_time,
      pickup_location,
      special_instructions,
    } = req.body;

    const result = await pool.query(
      `UPDATE orders 
       SET delivery_type = $1, delivery_address = $2, delivery_time = $3, 
           pickup_location = $4, special_instructions = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [
        delivery_type,
        delivery_address,
        delivery_time,
        pickup_location,
        special_instructions,
        id,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
