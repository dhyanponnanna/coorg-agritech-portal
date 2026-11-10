
import {
  subscribeToWeatherAlerts,
  verifyEmailSubscription,
  unsubscribeFromWeatherAlerts,
} from "../services/emailSubscription.service.js";

// Subscribe to weather alerts
export const subscribe = async (req, res) => {
  try {
    const {
      email,
      locationIds,
      preferences,
    } = req.body;

    const result = await subscribeToWeatherAlerts({
      email,
      locationIds,
      preferences,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Subscription error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Verify email subscription
export const verifySubscription = async (req, res) => {
  try {
    const { token } = req.query;

    const result = await verifyEmailSubscription(token);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Unsubscribe from weather alerts
export const unsubscribe = async (req, res) => {
  try {
    const { token } = req.query;

    const result = await unsubscribeFromWeatherAlerts(token);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
