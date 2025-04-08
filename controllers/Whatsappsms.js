const Otp = require("../models/Otp");
const axios = require("axios");

const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

exports.sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    const otp = generateOtp();

    const otpEntry = new Otp({ phoneNumber, otp });
    await otpEntry.save();

    const apiPayload = {
      apiKey:
        process.env.Whatsapp_api_key, // replace with your actual apiKey
      campaignName: "OTP Verificatiom",
      destination: phoneNumber,
      userName: "Dealer registration",
      templateParams: [otp],
      source: "new-landing-page form",
      media: {},
      buttons: [
        {
          type: "button",
          sub_type: "url",
          index: 0,
          parameters: [
            {
              type: "text",
              text: otp,
            },
          ],
        },
      ],
      carouselCards: [],
      location: {},
      paramsFallbackValue: {
        FirstName: phoneNumber,
      },
    };

    const response = await axios.post(
      process.env.Whatsapp_api_url,
      apiPayload
    );

    if (response.status === 200) {
      return res.status(200).json({
        success: true,
        message: "OTP sent successfully",
        data: { otp },
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP",
        error: {
          code: "OTP_SEND_FAILURE",
          description: "An error occurred while sending the OTP.",
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: {
        code: "SERVER_ERROR",
        description: error.message,
      },
    });
  }
};

exports.checkOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({
      success: false,
      message: "Phone number and OTP are required",
      error: {
        code: "MISSING_PARAMETERS",
        description: "Please provide both phone number and OTP.",
      },
    });
  }

  try {
    const otpEntry = await Otp.findOne({ phoneNumber, otp });

    if (otpEntry) {
      return res.status(200).json({
        success: true,
        message: "Yes, otp exists",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No, it does not exist",
        error: {
          code: "NOT_FOUND",
          description:
            "The provided phone number and OTP combination does not exist.",
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: {
        code: "SERVER_ERROR",
        description: error.message,
      },
    });
  }
};

exports.checkOtpEmail = async (req, res) => {
  const { Email, otp } = req.body;

  if (!Email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
      error: {
        code: "MISSING_PARAMETERS",
        description: "Please provide both Email and OTP.",
      },
    });
  }

  try {
    const otpEntry = await Otp.findOne({ phoneNumber: Email, otp });

    if (otpEntry) {
      return res.status(200).json({
        success: true,
        message: "Yes, otp exists",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No, it does not exist",
        error: {
          code: "NOT_FOUND",
          description: "The provided Email and OTP combination does not exist.",
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: {
        code: "SERVER_ERROR",
        description: error.message,
      },
    });
  }
};
