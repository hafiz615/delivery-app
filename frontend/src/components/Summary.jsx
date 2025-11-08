import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOrder, updateOrder } from "../utils/api";
import "./Summary.css";

const Summary = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [errors, setErrors] = useState({});
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      const orderId = localStorage.getItem("currentOrderId");
      if (!orderId) {
        navigate("/delivery");
        return;
      }

      const orderData = await getOrder(orderId);
      setOrder(orderData);
      setEditData({
        delivery_type: orderData.delivery_type,
        delivery_address: orderData.delivery_address || "",
        delivery_time: orderData.delivery_time
          ? new Date(orderData.delivery_time).toISOString().slice(0, 16)
          : "",
        pickup_location: orderData.pickup_location || "",
        special_instructions: orderData.special_instructions || "",
      });
    } catch (error) {
      console.error("Error loading order:", error);
      setErrors({ load: "Failed to load order details" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const validateForm = () => {
    const newErrors = {};

    if (
      editData.delivery_type === "DELIVERY" &&
      !editData.delivery_address?.trim()
    ) {
      newErrors.deliveryAddress = "Delivery address is required";
    }

    if (
      (editData.delivery_type === "IN_STORE" ||
        editData.delivery_type === "CURBSIDE") &&
      !editData.pickup_location?.trim()
    ) {
      newErrors.pickupLocation = "Pickup location is required";
    }

    if (!editData.delivery_time) {
      newErrors.deliveryTime = "Delivery/pickup time is required";
    } else {
      const selectedTime = new Date(editData.delivery_time);
      const now = new Date();
      if (selectedTime <= now) {
        newErrors.deliveryTime = "Time must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const updatedOrder = await updateOrder(order.id, editData);
      setOrder(updatedOrder);
      setEditing(false);
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.error ||
          "Failed to update order. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      delivery_type: order.delivery_type,
      delivery_address: order.delivery_address || "",
      delivery_time: order.delivery_time
        ? new Date(order.delivery_time).toISOString().slice(0, 16)
        : "",
      pickup_location: order.pickup_location || "",
      special_instructions: order.special_instructions || "",
    });
    setEditing(false);
    setErrors({});
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && !order) {
    return <p>Loading order details...</p>;
  }

  if (!order) {
    return <p>No order found</p>;
  }

  return (
    <div className="summary-container">
      <h2>Order Summary</h2>

      {editing ? (
        <div className="edit-form">
          <div>
            <label>Delivery Type</label>
            <div>
              <label>
                <input
                  type="radio"
                  value="IN_STORE"
                  checked={editData.delivery_type === "IN_STORE"}
                  onChange={(e) =>
                    setEditData({ ...editData, delivery_type: e.target.value })
                  }
                />
                In Store
              </label>

              <label>
                <input
                  type="radio"
                  value="DELIVERY"
                  checked={editData.delivery_type === "DELIVERY"}
                  onChange={(e) =>
                    setEditData({ ...editData, delivery_type: e.target.value })
                  }
                />
                Delivery
              </label>

              <label>
                <input
                  type="radio"
                  value="CURBSIDE"
                  checked={editData.delivery_type === "CURBSIDE"}
                  onChange={(e) =>
                    setEditData({ ...editData, delivery_type: e.target.value })
                  }
                />
                Curbside
              </label>
            </div>
          </div>

          {editData.delivery_type === "DELIVERY" && (
            <div>
              <label>Delivery Address *</label>
              <textarea
                value={editData.delivery_address}
                onChange={(e) =>
                  setEditData({ ...editData, delivery_address: e.target.value })
                }
                rows="3"
              />
              {errors.deliveryAddress && (
                <p className="error">{errors.deliveryAddress}</p>
              )}
            </div>
          )}

          {(editData.delivery_type === "IN_STORE" ||
            editData.delivery_type === "CURBSIDE") && (
            <div>
              <label>Pickup Location *</label>
              <input
                type="text"
                value={editData.pickup_location}
                onChange={(e) =>
                  setEditData({ ...editData, pickup_location: e.target.value })
                }
              />
              {errors.pickupLocation && (
                <p className="error">{errors.pickupLocation}</p>
              )}
            </div>
          )}

          <div>
            <label>
              {editData.delivery_type === "DELIVERY" ? "Delivery" : "Pickup"}{" "}
              Time *
            </label>
            <input
              type="datetime-local"
              value={editData.delivery_time}
              onChange={(e) =>
                setEditData({ ...editData, delivery_time: e.target.value })
              }
            />
            {errors.deliveryTime && (
              <p className="error">{errors.deliveryTime}</p>
            )}
          </div>

          <div>
            <label>Special Instructions</label>
            <textarea
              value={editData.special_instructions}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  special_instructions: e.target.value,
                })
              }
              rows="3"
            />
          </div>

          {errors.submit && <p className="error">{errors.submit}</p>}

          <div className="actions">
            <button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="order-details">
          <p>
            <strong>Delivery Type:</strong>{" "}
            {order.delivery_type.replace("_", " ")}
          </p>

          {order.delivery_type === "DELIVERY" && order.delivery_address && (
            <p>
              <strong>Delivery Address:</strong> {order.delivery_address}
            </p>
          )}

          {(order.delivery_type === "IN_STORE" ||
            order.delivery_type === "CURBSIDE") &&
            order.pickup_location && (
              <p>
                <strong>Pickup Location:</strong> {order.pickup_location}
              </p>
            )}

          <p>
            <strong>
              {order.delivery_type === "DELIVERY" ? "Delivery" : "Pickup"} Time:
            </strong>{" "}
            {formatDate(order.delivery_time)}
          </p>

          {order.special_instructions && (
            <p>
              <strong>Special Instructions:</strong>{" "}
              {order.special_instructions}
            </p>
          )}

          <h3>Order Details</h3>
          <p>Order ID: #{order.id}</p>
          <p>Created: {formatDate(order.created_at)}</p>
          {order.updated_at !== order.created_at && (
            <p>Last Updated: {formatDate(order.updated_at)}</p>
          )}

          <div className="actions">
            <button onClick={handleEdit}>Edit Order</button>
            <button onClick={handleLogout}>Sign Out</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Summary;
