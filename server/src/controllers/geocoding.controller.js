import { reverseGeocode } from "../services/geocoding.service.js";

export const reverseGeocodeController = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query;

    const location = await reverseGeocode(
      latitude,
      longitude
    );

    res.status(200).json({
      success: true,
      message: "Location identified successfully",
      data: location,
    });
  } catch (error) {
    next(error);
  }
};