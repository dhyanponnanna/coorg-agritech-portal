import {
  createLaborJobService,
  getOpenLaborJobsService,
  getLaborJobByIdService,
  getLaborJobsByOwnerService,
  createWorkerProfileService,
  getWorkerProfileService,
  applyForLaborJobService,
  getJobApplicationsService,
  getWorkerApplicationsService,
  updateApplicationStatusService,
  matchWorkersToJob,
} from "../services/labor.service.js";

export const createLaborJobController = async (
  req,
  res,
  next
) => {
  try {
    const job = await createLaborJobService(
      req.user.userId,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Labor job created successfully",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

export const getOpenLaborJobsController = async (
  req,
  res,
  next
) => {
  try {
    const jobs = await getOpenLaborJobsService();

    res.status(200).json({
      success: true,
      message: "Open labor jobs retrieved successfully",
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

export const getLaborJobByIdController = async (
  req,
  res,
  next
) => {
  try {
    const job = await getLaborJobByIdService(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Labor job retrieved successfully",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

export const getLaborJobsByOwnerController = async (
  req,
  res,
  next
) => {
  try {
    const jobs = await getLaborJobsByOwnerService(
      req.user.userId
    );

    res.status(200).json({
      success: true,
      message: "Owner labor jobs retrieved successfully",
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

export const createWorkerProfileController = async (
  req,
  res,
  next
) => {
  try {
    const profile =
      await createWorkerProfileService(
        req.user.userId,
        req.body
      );

    res.status(201).json({
      success: true,
      message: "Worker profile created successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkerProfileController = async (
  req,
  res,
  next
) => {
  try {
    const profile =
      await getWorkerProfileService(req.user.userId);

    res.status(200).json({
      success: true,
      message: "Worker profile retrieved successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const applyForLaborJobController = async (
  req,
  res,
  next
) => {
  try {
    const application =
      await applyForLaborJobService(
        req.user.userId,
        req.params.jobId
      );

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobApplicationsController = async (
  req,
  res,
  next
) => {
  try {
    const applications =
      await getJobApplicationsService(
        req.user.userId,
        req.params.jobId
      );

    res.status(200).json({
      success: true,
      message: "Job applications retrieved successfully",
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkerApplicationsController = async (
  req,
  res,
  next
) => {
  try {
    const applications =
      await getWorkerApplicationsService(
        req.user.userId
      );

    res.status(200).json({
      success: true,
      message:
        "Worker applications retrieved successfully",
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatusController = async (
  req,
  res,
  next
) => {
  try {
    const application =
      await updateApplicationStatusService(
        req.user.userId,
        req.params.applicationId,
        req.body.status
      );

    res.status(200).json({
      success: true,
      message:
        "Application status updated successfully",
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

export const matchWorkersToJobController = async (
  req,
  res,
  next
) => {
  try {
    const matches = await matchWorkersToJob(
      req.params.jobId
    );

    res.status(200).json({
      success: true,
      message: "Worker matches retrieved successfully",
      data: matches,
    });
  } catch (error) {
    next(error);
  }
};