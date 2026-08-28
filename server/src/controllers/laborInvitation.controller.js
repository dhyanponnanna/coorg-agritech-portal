import {
  sendLaborInvitationService,
  getWorkerInvitationsService,
  getJobInvitationsService,
  updateInvitationStatusService,
} from "../services/laborInvitation.service.js";

export const sendLaborInvitationController = async (
  req,
  res,
  next
) => {
  try {
    const invitation = await sendLaborInvitationService(
      req.user.userId,
      req.params.jobId,
      req.body.workerId
    );

    res.status(201).json({
      success: true,
      message: "Worker invitation sent successfully",
      data: invitation,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkerInvitationsController = async (
  req,
  res,
  next
) => {
  try {
    const invitations =
      await getWorkerInvitationsService(
        req.user.userId
      );

    res.status(200).json({
      success: true,
      message: "Worker invitations retrieved successfully",
      data: invitations,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobInvitationsController = async (
  req,
  res,
  next
) => {
  try {
    const invitations =
      await getJobInvitationsService(
        req.user.userId,
        req.params.jobId
      );

    res.status(200).json({
      success: true,
      message: "Job invitations retrieved successfully",
      data: invitations,
    });
  } catch (error) {
    next(error);
  }
};

export const updateInvitationStatusController = async (
  req,
  res,
  next
) => {
  try {
    const invitation =
      await updateInvitationStatusService(
        req.user.userId,
        req.params.invitationId,
        req.body.status
      );

    res.status(200).json({
      success: true,
      message: "Invitation status updated successfully",
      data: invitation,
    });
  } catch (error) {
    next(error);
  }
};