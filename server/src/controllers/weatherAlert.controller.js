import {
  generateWeatherAlertsService,
  getLocationWeatherAlertsService,
  getRecentWeatherAlertsService,
  getWeatherAlertByIdService,
  deleteWeatherAlertService,
} from "../services/weatherAlert.service.js";

export const generateWeatherAlertsController = async (
  req,
  res,
  next
) => {
  try {
    const alerts = await generateWeatherAlertsService(
      req.params.locationId
    );

    res.status(201).json({
      success: true,
      message: "Weather alerts generated successfully",
      data: alerts,
      
    });
  } catch (error) {
    next(error);
  }
};

export const getLocationWeatherAlertsController = async (
  req,
  res,
  next
) => {
  try {
    const alerts =
      await getLocationWeatherAlertsService(
        req.params.locationId
      );

    res.status(200).json({
      success: true,
      message: "Weather alerts retrieved successfully",
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentWeatherAlertsController = async (
  req,
  res,
  next
) => {
  try {
    const alerts =
      await getRecentWeatherAlertsService(
        req.query.hours || 24
      );

    res.status(200).json({
      success: true,
      message: "Recent weather alerts retrieved successfully",
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};

export const getWeatherAlertByIdController = async (
  req,
  res,
  next
) => {
  try {
    const alert = await getWeatherAlertByIdService(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Weather alert retrieved successfully",
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteWeatherAlertController = async (
  req,
  res,
  next
) => {
  try {
    const alert = await deleteWeatherAlertService(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Weather alert deleted successfully",
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};