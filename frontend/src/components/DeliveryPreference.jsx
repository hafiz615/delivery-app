import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../utils/api";
import "./DeliveryPreference.css";

const DeliveryPreference = () => {
  const [deliveryType, setDeliveryType] = useState("IN_STORE");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = localStorage.getItem("orderData");
    if (savedData) {
      const data = JSON.parse(savedData);
      setDeliveryType(data.deliveryType || "IN_STORE");
      setDeliveryAddress(data.deliveryAddress || "");
      setDeliveryTime(data.deliveryTime || "");
      setPickupLocation(data.pickupLocation || "");
      setSpecialInstructions(data.specialInstructions || "");
    }
  }, []);

  useEffect(() => {
    const orderData = {
      deliveryType,
      deliveryAddress,
      deliveryTime,
      pickupLocation,
      specialInstructions,
    };
    localStorage.setItem("orderData", JSON.stringify(orderData));
  }, [
    deliveryType,
    deliveryAddress,
    deliveryTime,
    pickupLocation,
    specialInstructions,
  ]);

  const validateForm = () => {
    const newErrors = {};

    if (deliveryType === "DELIVERY" && !deliveryAddress.trim()) {
      newErrors.deliveryAddress = "Delivery address is required";
    }

    if (
      (deliveryType === "IN_STORE" || deliveryType === "CURBSIDE") &&
      !pickupLocation.trim()
    ) {
      newErrors.pickupLocation = "Pickup location is required";
    }

    if (!deliveryTime) {
      newErrors.deliveryTime = "Delivery/pickup time is required";
    } else {
      const selectedTime = new Date(deliveryTime);
      const now = new Date();
      if (selectedTime <= now) {
        newErrors.deliveryTime = "Time must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const orderData = {
        delivery_type: deliveryType,
        delivery_address: deliveryType === "DELIVERY" ? deliveryAddress : null,
        delivery_time: deliveryTime,
        pickup_location: deliveryType !== "DELIVERY" ? pickupLocation : null,
        special_instructions: specialInstructions || null,
      };

      const order = await createOrder(orderData);
      localStorage.setItem("currentOrderId", order.id);
      navigate("/summary");
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.error ||
          "Failed to create order. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="delivery-preference">
      <h2>Delivery Preference</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Delivery Type</label>
          <div>
            <label>
              <input
                type="radio"
                value="IN_STORE"
                checked={deliveryType === "IN_STORE"}
                onChange={(e) => setDeliveryType(e.target.value)}
              />
              In Store
            </label>

            <label>
              <input
                type="radio"
                value="DELIVERY"
                checked={deliveryType === "DELIVERY"}
                onChange={(e) => setDeliveryType(e.target.value)}
              />
              Delivery
            </label>

            <label>
              <input
                type="radio"
                value="CURBSIDE"
                checked={deliveryType === "CURBSIDE"}
                onChange={(e) => setDeliveryType(e.target.value)}
              />
              Curbside
            </label>
          </div>
        </div>

        {deliveryType === "DELIVERY" && (
          <div>
            <label htmlFor="deliveryAddress">Delivery Address *</label>
            <textarea
              id="deliveryAddress"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter your delivery address"
              rows="3"
            />
            {errors.deliveryAddress && (
              <p className="error">{errors.deliveryAddress}</p>
            )}
          </div>
        )}

        {(deliveryType === "IN_STORE" || deliveryType === "CURBSIDE") && (
          <div>
            <label htmlFor="pickupLocation">Pickup Location *</label>
            <input
              id="pickupLocation"
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="Enter store location"
            />
            {errors.pickupLocation && (
              <p className="error">{errors.pickupLocation}</p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="deliveryTime">
            {deliveryType === "DELIVERY" ? "Delivery" : "Pickup"} Time *
          </label>
          <input
            id="deliveryTime"
            type="datetime-local"
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
          />
          {errors.deliveryTime && (
            <p className="error">{errors.deliveryTime}</p>
          )}
        </div>

        <div>
          <label htmlFor="specialInstructions">Special Instructions</label>
          <textarea
            id="specialInstructions"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Any special instructions? (optional)"
            rows="3"
          />
        </div>

        {errors.submit && <p className="error">{errors.submit}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Continue to Summary"}
        </button>
      </form>

      <button onClick={handleLogout}>Sign Out</button>
    </div>
  );
};

export default DeliveryPreference;
