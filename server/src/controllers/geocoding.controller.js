import { reverseGeocode, searchLocations, } from "../services/geocoding.service.js";

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

export const searchLocationsController = async (
  req,
  res,
  next
) => {
  try {
    const { q } = req.query;

    const locations = await searchLocations(q);

    res.status(200).json({
      success: true,
      message: "Locations found successfully",
      data: locations,
    });
  } catch (error) {
    next(error);
  }
};