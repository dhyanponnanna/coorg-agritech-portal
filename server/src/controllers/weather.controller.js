import {
  getCurrentWeather,
  getWeatherForecast,
} from "../services/weather.service.js";

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

export const getWeatherForecastController = async (req, res, next) => {
  try {
    const forecast = await getWeatherForecast(req.params.location);

    res.status(200).json({
      success: true,
      message: "Weather forecast retrieved successfully",
      data: forecast,
    });
  } catch (error) {
    next(error);
  }
};