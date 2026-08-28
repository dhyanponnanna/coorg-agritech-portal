import prisma from "../config/prisma.js";

export const createLaborInvitation = async ({
  jobId,
  workerId,
}) => {
  return prisma.laborInvitation.create({
    data: {
      jobId,
      workerId,
    },
    include: {
      job: true,
      worker: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      },
    },
  });
};

export const getInvitationByJobAndWorker = async (
  jobId,
  workerId
) => {
  return prisma.laborInvitation.findUnique({
    where: {
      jobId_workerId: {
        jobId,
        workerId,
      },
    },
  });
};

export const getInvitationsByWorker = async (workerId) => {
  return prisma.laborInvitation.findMany({
    where: {
      workerId,
    },
    include: {
      job: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getInvitationsByJob = async (jobId) => {
  return prisma.laborInvitation.findMany({
    where: {
      jobId,
    },
    include: {
      worker: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getLaborInvitationById = async (id) => {
  return prisma.laborInvitation.findUnique({
    where: {
      id,
    },
    include: {
      job: true,
      worker: {
        include: {
          user: true,
        },
      },
    },
  });
};

export const updateLaborInvitationStatus = async (
  id,
  status
) => {
  return prisma.laborInvitation.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
};