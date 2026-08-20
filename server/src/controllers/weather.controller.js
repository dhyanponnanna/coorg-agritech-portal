import {
  getCurrentWeather,
  getWeatherForecast,
  getHistoricalWeather,
  getCurrentWeatherByCoordinates,
  getWeatherForecastByCoordinates,
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

export const getHistoricalWeatherController = async (
  req,
  res,
  next
) => {
  try {
    const { location } = req.params;
    const { hours = 24 } = req.query;

    const history = await getHistoricalWeather(
      location,
      hours
    );

    res.status(200).json({
      success: true,
      message: "Weather history retrieved successfully",
      data: {
        location,
        hours: Number(hours),
        count: history.length,
        records: history,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentWeatherByCoordinatesController = async (
  req,
  res,
  next
) => {
  try {
    const { latitude, longitude } = req.query;

    const weather = await getCurrentWeatherByCoordinates(
      latitude,
      longitude
    );

    res.status(200).json({
      success: true,
      message: "Current location weather retrieved successfully",
      data: weather,
    });
  } catch (error) {
    next(error);
  }
};

export const getWeatherForecastByCoordinatesController = async (
  req,
  res,
  next
) => {
  try {
    const { latitude, longitude } = req.query;

    const forecast = await getWeatherForecastByCoordinates(
      latitude,
      longitude
    );

    res.status(200).json({
      success: true,
      message:
        "Current location forecast retrieved successfully",
      data: forecast,
    });
  } catch (error) {
    next(error);
  }
};