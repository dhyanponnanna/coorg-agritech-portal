import prisma from "../config/prisma.js";

// ===============================
// LABOR JOBS
// ===============================

export const createLaborJob = async (job) => {
  return prisma.laborJob.create({
    data: {
      ownerId: job.ownerId,
      title: job.title,
      estateName: job.estateName,
      location: job.location,
      crop: job.crop,
      workType: job.workType,
      workersRequired: job.workersRequired,
      requiredSkills: job.requiredSkills,
      startDate: job.startDate,
      endDate: job.endDate,
      wagePerDay: job.wagePerDay,
      description: job.description,
    },
  });
};

export const getOpenLaborJobs = async () => {
  return prisma.laborJob.findMany({
    where: {
      status: "OPEN",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getLaborJobById = async (id) => {
  return prisma.laborJob.findUnique({
    where: {
      id,
    },
    include: {
      owner: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
      applications: {
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
      },
    },
  });
};

export const getLaborJobsByOwner = async (ownerId) => {
  return prisma.laborJob.findMany({
    where: {
      ownerId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// ===============================
// WORKER PROFILE
// ===============================

export const createWorkerProfile = async (profile) => {
  return prisma.workerProfile.create({
    data: {
      userId: profile.userId,
      phone: profile.phone,
      location: profile.location,
      skills: profile.skills,
      experience: profile.experience,
      availability: profile.availability ?? true,
    },
  });
};

export const getWorkerProfileByUserId = async (userId) => {
  return prisma.workerProfile.findUnique({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

// ===============================
// LABOR APPLICATIONS
// ===============================

export const createLaborApplication = async (
  application
) => {
  return prisma.laborApplication.create({
    data: {
      jobId: application.jobId,
      workerId: application.workerId,
    },
  });
};

export const getApplicationsByJob = async (jobId) => {
  return prisma.laborApplication.findMany({
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
      appliedAt: "desc",
    },
  });
};

export const getApplicationsByWorker = async (
  workerId
) => {
  return prisma.laborApplication.findMany({
    where: {
      workerId,
    },
    include: {
      job: true,
    },
    orderBy: {
      appliedAt: "desc",
    },
  });
};

export const getLaborApplicationById = async (id) => {
  return prisma.laborApplication.findUnique({
    where: {
      id,
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

export const updateLaborApplicationStatus = async (
  id,
  status
) => {
  return prisma.laborApplication.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
};

export const getAvailableWorkers = async () => {
  return prisma.workerProfile.findMany({
    where: {
      availability: true,
      user: {
        role: "WORKER",
      },
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });
};