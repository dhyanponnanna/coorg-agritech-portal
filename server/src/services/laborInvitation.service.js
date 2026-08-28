import {
  createLaborInvitation,
  getInvitationByJobAndWorker,
  getInvitationsByWorker,
  getInvitationsByJob,
  getLaborInvitationById,
  updateLaborInvitationStatus,
} from "../repositories/laborInvitation.repository.js";

import {
  getLaborJobById,
  getWorkerProfileByUserId,
} from "../repositories/labor.repository.js";

export const sendLaborInvitationService = async (
  ownerId,
  jobId,
  workerId
) => {
  if (!ownerId) {
    const error = new Error("Owner authentication required");
    error.statusCode = 401;
    throw error;
  }

  if (!jobId || !workerId) {
    const error = new Error(
      "Job ID and worker ID are required"
    );
    error.statusCode = 400;
    throw error;
  }

  const job = await getLaborJobById(jobId);

  if (!job) {
    const error = new Error("Labor job not found");
    error.statusCode = 404;
    throw error;
  }

  if (job.ownerId !== ownerId) {
    const error = new Error(
      "You are not authorized to invite workers to this job"
    );
    error.statusCode = 403;
    throw error;
  }

  if (job.status !== "OPEN") {
    const error = new Error(
      "This labor job is no longer accepting invitations"
    );
    error.statusCode = 400;
    throw error;
  }

  const workerProfile = await getWorkerProfileByUserId(workerId);

  if (!workerProfile) {
    const error = new Error("Worker profile not found");
    error.statusCode = 404;
    throw error;
  }

  if (!workerProfile.availability) {
    const error = new Error(
      "This worker is currently unavailable"
    );
    error.statusCode = 400;
    throw error;
  }

  const existingInvitation =
    await getInvitationByJobAndWorker(
      jobId,
      workerProfile.id
    );

  if (existingInvitation) {
    const error = new Error(
      "Worker has already been invited to this job"
    );
    error.statusCode = 409;
    throw error;
  }

  return createLaborInvitation({
    jobId,
    workerId: workerProfile.id,
  });
};

export const getWorkerInvitationsService = async (userId) => {
  if (!userId) {
    const error = new Error("Authentication required");
    error.statusCode = 401;
    throw error;
  }

  const workerProfile =
    await getWorkerProfileByUserId(userId);

  if (!workerProfile) {
    const error = new Error("Worker profile not found");
    error.statusCode = 404;
    throw error;
  }

  return getInvitationsByWorker(workerProfile.id);
};

export const getJobInvitationsService = async (
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
      "You are not authorized to view these invitations"
    );
    error.statusCode = 403;
    throw error;
  }

  return getInvitationsByJob(jobId);
};

export const updateInvitationStatusService = async (
  userId,
  invitationId,
  status
) => {
  if (!userId) {
    const error = new Error("Authentication required");
    error.statusCode = 401;
    throw error;
  }

  const validStatuses = [
    "ACCEPTED",
    "REJECTED",
  ];

  if (!validStatuses.includes(status)) {
    const error = new Error(
      "Invalid invitation status"
    );
    error.statusCode = 400;
    throw error;
  }

  const invitation =
    await getLaborInvitationById(invitationId);

  if (!invitation) {
    const error = new Error("Invitation not found");
    error.statusCode = 404;
    throw error;
  }

  if (invitation.worker.userId !== userId) {
    const error = new Error(
      "You are not authorized to update this invitation"
    );
    error.statusCode = 403;
    throw error;
  }

  if (invitation.status !== "PENDING") {
    const error = new Error(
      "This invitation has already been responded to"
    );
    error.statusCode = 400;
    throw error;
  }

  return updateLaborInvitationStatus(
    invitationId,
    status
  );
};