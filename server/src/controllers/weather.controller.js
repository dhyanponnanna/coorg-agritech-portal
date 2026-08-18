import { getCurrentWeather } from "../services/weather.service.js";

export const getCurrentWeatherController = async (req, res, next) => {
  try {
    const weather = await getCurrentWeather(req.params.location);

    res.status(200).json({
      success: true,
      message: "Current weather retrieved successfully",
      data: weather,
    });
  } catch (error) {
    next(error);
  }
};