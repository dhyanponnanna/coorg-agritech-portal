
import { randomBytes } from "node:crypto";
import prisma from "../config/prisma.js";
import { sendEmail } from "./email.service.js";

const generateToken = () => randomBytes(32).toString("hex");

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);

// Subscribe a farmer to weather alerts

export const subscribeToWeatherAlerts = async ({
  email,
  locationIds,
  preferences = {},
}) => {
  const normalizedEmail = email?.trim().toLowerCase();

  if (
    !normalizedEmail ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
  ) {
    throw new Error("Please provide a valid email address");
  }

  const uniqueLocationIds = [...new Set(locationIds || [])];

  if (uniqueLocationIds.length === 0) {
    throw new Error("Please select at least one location");
  }

  const locations = await prisma.location.findMany({
    where: {
      id: { in: uniqueLocationIds },
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (locations.length !== uniqueLocationIds.length) {
    throw new Error("One or more selected locations are invalid");
  }

  // Default preferences
  const preferenceData = {
    receiveHighTemperature:
      preferences.receiveHighTemperature ?? true,
    receiveLowTemperature:
      preferences.receiveLowTemperature ?? true,
    receiveHeavyRain:
      preferences.receiveHeavyRain ?? true,
    receiveStrongWind:
      preferences.receiveStrongWind ?? true,
  };

  const existing = await prisma.emailSubscription.findUnique({
    where: { email: normalizedEmail },
  });

  // Reactivate an already verified subscription
  // without requiring email verification again.
  if (existing?.isVerified) {
    await prisma.emailSubscription.update({
      where: { id: existing.id },
      data: {
        isActive: true,
        ...preferenceData,
        locations: {
          set: uniqueLocationIds.map((id) => ({ id })),
        },
      },
    });

    return {
      message: "Your weather alert subscription is active.",
      requiresVerification: false,
    };
  }

  const verificationToken = generateToken();
  const tokenExpiresAt = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  );

  let subscription;

  if (existing) {
    subscription = await prisma.emailSubscription.update({
      where: { id: existing.id },
      data: {
        isActive: true,
        verificationToken,
        tokenExpiresAt,
        ...preferenceData,
        locations: {
          set: uniqueLocationIds.map((id) => ({ id })),
        },
      },
    });
  } else {
    subscription = await prisma.emailSubscription.create({
      data: {
        email: normalizedEmail,
        verificationToken,
        unsubscribeToken: generateToken(),
        tokenExpiresAt,
        ...preferenceData,
        locations: {
          connect: uniqueLocationIds.map((id) => ({ id })),
        },
      },
    });
  }

  const clientUrl = process.env.CLIENT_URL;

  if (!clientUrl) {
    throw new Error("CLIENT_URL is not configured");
  }

  const verificationUrl =
    `${clientUrl.replace(/\/$/, "")}/verify-email?token=${verificationToken}`;

  const locationNames = locations
    .map((location) => escapeHtml(location.name))
    .join(", ");

  await sendEmail({
    to: normalizedEmail,
    subject: "Verify Your Coorg Agri-Tech Weather Alert Subscription",
    html: `
      <h2>Welcome to Coorg Agri-Tech!</h2>

      <p>You requested weather alerts for:</p>

      <p><strong>${locationNames}</strong></p>

      <p>Please verify your email address:</p>

      <p>
        <a href="${verificationUrl}"
           style="background:#16a34a;color:white;padding:12px 20px;
                  text-decoration:none;border-radius:6px;">
          Verify Email Address
        </a>
      </p>

      <p>This verification link expires in 24 hours.</p>

      <p>If you did not request this subscription, ignore this email.</p>
    `,
  });

  return {
    message: "Verification email sent. Please check your inbox.",
    requiresVerification: true,
  };
};


// Verify a farmer's email address

export const verifyEmailSubscription = async (token) => {
  if (!token) {
    throw new Error("Verification token is required");
  }

  const subscription = await prisma.emailSubscription.findUnique({
    where: { verificationToken: token },
    include: {
      locations: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!subscription) {
    throw new Error("Invalid or already used verification link");
  }

  if (
    !subscription.tokenExpiresAt ||
    subscription.tokenExpiresAt < new Date()
  ) {
    throw new Error(
      "Verification link has expired. Please subscribe again."
    );
  }

  // Activate the subscription
  await prisma.emailSubscription.update({
    where: { id: subscription.id },
    data: {
      isVerified: true,
      isActive: true,
      verificationToken: null,
      tokenExpiresAt: null,
    },
  });

  // Send subscription confirmation email
  try {
    const locationNames = subscription.locations
      .map((location) => escapeHtml(location.name))
      .join(", ");

    const clientUrl = process.env.CLIENT_URL;

    const unsubscribeUrl =
      `${clientUrl.replace(/\/$/, "")}/unsubscribe?token=${encodeURIComponent(subscription.unsubscribeToken)}`;

    await sendEmail({
      to: subscription.email,
      subject: "Successfully Subscribed - Coorg Agri-Tech Weather Alerts",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:25px;">

          <h2 style="color:#15803d;">
            Welcome to Coorg Agri-Tech!
          </h2>

          <h3>Your Weather Alert Subscription Is Active!</h3>

          <p>Hello,</p>

          <p>
            Your email address has been successfully verified.
            You are now subscribed to Coorg Agri-Tech weather alerts.
          </p>

          <h3>Your Selected Locations</h3>

          <p>${locationNames}</p>

          <p>
            You will receive email notifications about important
            weather conditions affecting your selected locations.
          </p>

          <p>
            Thank you for using Coorg Agri-Tech!
          </p>

          <p style="color:#6b7280;font-size:13px;">
            This is an automated confirmation email.
          </p>

          <hr />

          <p style="font-size:12px;color:#6b7280;">
            No longer wish to receive alerts?
            <a href="${unsubscribeUrl}">Unsubscribe here</a>.
          </p>

        </div>
      `,
    });

    console.log(
      "Subscription confirmation email sent to:",
      subscription.email
    );
  } catch (emailError) {
    console.error(
      "Subscription verified, but confirmation email failed:",
      emailError.message
    );
  }

  return {
    message:
      "Email verified successfully. Weather alerts are now active.",
  };
};


// Unsubscribe from weather alerts
export const unsubscribeFromWeatherAlerts = async (token) => {
  if (!token) {
    throw new Error("Unsubscribe token is required");
  }

  const subscription = await prisma.emailSubscription.findUnique({
    where: { unsubscribeToken: token },
  });

  if (!subscription) {
    throw new Error("Invalid unsubscribe link");
  }

  await prisma.emailSubscription.update({
    where: { id: subscription.id },
    data: {
      isActive: false,
    },
  });

  return {
    message: "You have successfully unsubscribed from weather alerts.",
  };
};


export const sendWeatherAlertEmails = async (alert, locationId) => {
  
  // Map each alert title to its corresponding preference field
  const preferenceMap = {
    "High Temperature Alert": "receiveHighTemperature",
    "Low Temperature Alert": "receiveLowTemperature",
    "Heavy Rain Alert": "receiveHeavyRain",
    "Strong Wind Alert": "receiveStrongWind",
  };

  const preferenceField = preferenceMap[alert.title];

  if (!preferenceField) {
    console.log("Unknown weather alert type:", alert.title);
    return;
  }

  const subscriptions = await prisma.emailSubscription.findMany({
    where: {
      isVerified: true,
      isActive: true,
      [preferenceField]: true,
      locations: {
        some: { id: locationId },
      },
    },
    select: {
      email: true,
      unsubscribeToken: true,
    },
  });


  if (subscriptions.length === 0) {
    console.log("No active email subscribers for this location.");
    return;
  }

  const clientUrl = process.env.CLIENT_URL;

  if (!clientUrl) {
    throw new Error("CLIENT_URL is not configured");
  }

  const unsubscribeBaseUrl =
    `${clientUrl.replace(/\/$/, "")}/unsubscribe`;

  const safeTitle = escapeHtml(alert.title);
  const safeMessage = escapeHtml(alert.message);
  const safeLocation = escapeHtml(alert.location?.name || "Kodagu");

  const emailResults = await Promise.allSettled(
    subscriptions.map((subscription) =>
      sendEmail({
        to: subscription.email,
        subject: `Weather Alert: ${alert.title}`,
        html: `
          <h2>Weather Alert - Coorg Agri-Tech</h2>

          <h3>${safeTitle}</h3>

          <p><strong>Location:</strong> ${safeLocation}</p>

          <p>${safeMessage}</p>

          <p><strong>Severity:</strong> ${escapeHtml(alert.severity)}</p>
          <p><strong>Temperature:</strong> ${alert.temperature ?? "N/A"} °C</p>
          <p><strong>Wind Speed:</strong> ${alert.windSpeed ?? "N/A"} km/h</p>

          <hr />

          <p>
            <a href="${unsubscribeBaseUrl}?token=${encodeURIComponent(subscription.unsubscribeToken)}">
              Unsubscribe from weather alerts
            </a>
          </p>
        `,
      })
    )
  );

  const successful = emailResults.filter(
    (result) => result.status === "fulfilled"
  ).length;

  const failed = emailResults.length - successful;

  console.log(
    `Weather alert emails: ${successful} sent, ${failed} failed.`
  );
};
