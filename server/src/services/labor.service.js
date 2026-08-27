import {
  createLaborJob,
  getOpenLaborJobs,
  getLaborJobById,
  getLaborJobsByOwner,
  createWorkerProfile,
  getWorkerProfileByUserId,
  createLaborApplication,
  getApplicationsByJob,
  getApplicationsByWorker,
  getLaborApplicationById,
  updateLaborApplicationStatus,
} from "../repositories/labor.repository.js";

// =====================================
// LABOR JOB SERVICES
// =====================================

export const createLaborJobService = async (
  ownerId,
  jobData
) => {
  if (!ownerId) {
    const error = new Error("Owner authentication required");
    error.statusCode = 401;
    throw error;
  }

  if (!jobData.title || !jobData.estateName) {
    const error = new Error(
      "Job title and estate name are required"
    );
    error.statusCode = 400;
    throw error;
  }

  if (!jobData.location || !jobData.crop) {
    const error = new Error(
      "Location and crop are required"
    );
    error.statusCode = 400;
    throw error;
  }

  if (!jobData.workType) {
    const error = new Error("Work type is required");
    error.statusCode = 400;
    throw error;
  }

  const workersRequired = Number(
    jobData.workersRequired
  );

  const wagePerDay = Number(jobData.wagePerDay);

  if (
    !Number.isInteger(workersRequired) ||
    workersRequired < 1
  ) {
    const error = new Error(
      "Workers required must be a positive integer"
    );
    error.statusCode = 400;
    throw error;
  }

  if (!Number.isFinite(wagePerDay) || wagePerDay <= 0) {
    const error = new Error(
      "Wage per day must be a positive number"
    );
    error.statusCode = 400;
    throw error;
  }

  const startDate = new Date(jobData.startDate);
  const endDate = new Date(jobData.endDate);

  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime())
  ) {
    const error = new Error(
      "Valid start and end dates are required"
    );
    error.statusCode = 400;
    throw error;
  }

  if (endDate < startDate) {
    const error = new Error(
      "End date cannot be before start date"
    );
    error.statusCode = 400;
    throw error;
  }

  return createLaborJob({
    ownerId,
    title: jobData.title.trim(),
    estateName: jobData.estateName.trim(),
    location: jobData.location.trim(),
    crop: jobData.crop.trim(),
    workType: jobData.workType.trim(),
    workersRequired,
    startDate,
    endDate,
    wagePerDay,
    description: jobData.description?.trim() || null,
  });
};

export const getOpenLaborJobsService = async () => {
  return getOpenLaborJobs();
};

export const getLaborJobByIdService = async (id) => {
  if (!id) {
    const error = new Error("Job ID is required");
    error.statusCode = 400;
    throw error;
  }

  const job = await getLaborJobById(id);

  if (!job) {
    const error = new Error("Labor job not found");
    error.statusCode = 404;
    throw error;
  }

  return job;
};

export const getLaborJobsByOwnerService = async (
  ownerId
) => {
  return getLaborJobsByOwner(ownerId);
};

// =====================================
// WORKER PROFILE SERVICES
// =====================================

export const createWorkerProfileService = async (
  userId,
  profileData
) => {
  if (!userId) {
    const error = new Error("Authentication required");
    error.statusCode = 401;
    throw error;
  }

  const existingProfile =
    await getWorkerProfileByUserId(userId);

  if (existingProfile) {
    const error = new Error(
      "Worker profile already exists"
    );
    error.statusCode = 409;
    throw error;
  }

  const skills = Array.isArray(profileData.skills)
    ? profileData.skills
        .map((skill) => String(skill).trim())
        .filter(Boolean)
    : [];

  const experience =
    profileData.experience === undefined ||
    profileData.experience === null
      ? null
      : Number(profileData.experience);

  if (
    experience !== null &&
    (!Number.isInteger(experience) || experience < 0)
  ) {
    const error = new Error(
      "Experience must be a non-negative integer"
    );
    error.statusCode = 400;
    throw error;
  }

  return createWorkerProfile({
    userId,
    phone: profileData.phone?.trim() || null,
    location: profileData.location?.trim() || null,
    skills,
    experience,
    availability:
      profileData.availability === undefined
        ? true
        : Boolean(profileData.availability),
  });
};

export const getWorkerProfileService = async (userId) => {
  if (!userId) {
    const error = new Error("Authentication required");
    error.statusCode = 401;
    throw error;
  }

  const profile = await getWorkerProfileByUserId(userId);

  if (!profile) {
    const error = new Error(
      "Worker profile not found"
    );
    error.statusCode = 404;
    throw error;
  }

  return profile;
};

// =====================================
// APPLICATION SERVICES
// =====================================

export const applyForLaborJobService = async (
  userId,
  jobId
) => {
  if (!userId) {
    const error = new Error("Authentication required");
    error.statusCode = 401;
    throw error;
  }

  if (!jobId) {
    const error = new Error("Job ID is required");
    error.statusCode = 400;
    throw error;
  }

  const job = await getLaborJobById(jobId);

  if (!job) {
    const error = new Error("Labor job not found");
    error.statusCode = 404;
    throw error;
  }

  if (job.status !== "OPEN") {
    const error = new Error(
      "This labor job is no longer accepting applications"
    );
    error.statusCode = 400;
    throw error;
  }

  const workerProfile =
    await getWorkerProfileByUserId(userId);

  if (!workerProfile) {
    const error = new Error(
      "Create a worker profile before applying"
    );
    error.statusCode = 400;
    throw error;
  }

  if (!workerProfile.availability) {
    const error = new Error(
      "Your worker profile is currently unavailable"
    );
    error.statusCode = 400;
    throw error;
  }

  const alreadyApplied =
    job.applications.some(
      (application) =>
        application.workerId === workerProfile.id
    );

  if (alreadyApplied) {
    const error = new Error(
      "You have already applied for this job"
    );
    error.statusCode = 409;
    throw error;
  }

  return createLaborApplication({
    jobId,
    workerId: workerProfile.id,
  });
};

export const getJobApplicationsService = async (
  ownerId,
  jobId
) => {
  const job = await getLaborJobById(jobId);

  if (!job) {
    const error = new Error("Labor job not found");
    error.statusCode = 404;
    throw error;
  }

  if (job.ownerId !== ownerId) {
    const error = new Error(
      "You are not authorized to view these applications"
    );
    error.statusCode = 403;
    throw error;
  }

  return getApplicationsByJob(jobId);
};

export const getWorkerApplicationsService = async (
  userId
) => {
  const workerProfile =
    await getWorkerProfileByUserId(userId);

  if (!workerProfile) {
    const error = new Error(
      "Worker profile not found"
    );
    error.statusCode = 404;
    throw error;
  }

  return getApplicationsByWorker(workerProfile.id);
};

export const updateApplicationStatusService = async (
  ownerId,
  applicationId,
  status
) => {
  const validStatuses = [
    "ACCEPTED",
    "REJECTED",
  ];

  if (!validStatuses.includes(status)) {
    const error = new Error(
      "Invalid application status"
    );
    error.statusCode = 400;
    throw error;
  }

  const application =
    await getLaborApplicationById(applicationId);

  if (!application) {
    const error = new Error(
      "Application not found"
    );
    error.statusCode = 404;
    throw error;
  }

  if (application.job.ownerId !== ownerId) {
    const error = new Error(
      "You are not authorized to update this application"
    );
    error.statusCode = 403;
    throw error;
  }

  return updateLaborApplicationStatus(
    applicationId,
    status
  );
};