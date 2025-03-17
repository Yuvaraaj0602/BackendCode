const sendSMS = require("./routes/sendsms");
const { uploadFile, getFile } = require("./controllers/appimage");
const multer = require("multer");
const fs = require("fs").promises;
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const scheduleFetchData = require("./middleware/scheduler.js");
const sendWhatsappSMS = require("./routes/sendWhatappSMS.js");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const verifyRequest = require("./middleware/apimiddleware.js");
// const logger = require("morgan");
const path = require("path");
const connectDB = require("./db");
const bearerToken = require("express-bearer-token");
const cookieParser = require("cookie-parser");
const { tokenAuth } = require("./middleware/tokenAuth");
const {
  adminAuthorizer,
  superAdminAuthorizer,
} = require("./middleware/adminAuthorizer");
// //Logger
// app.use(logger("dev"));
const OTP = require("./models/Otp");
const Crop = require("./models/crop");
const Variety = require("./models/varities");
const varities = require("./models/varities");
//BodyParser
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

//CORS
app.use(cors());
app.use(cookieParser());
app.use(bearerToken());
//.env
dotenv.config();

//Authorization

app.use("*/role-admin/*", tokenAuth, adminAuthorizer);
app.use("*/role-superAdmin/*", tokenAuth, superAdminAuthorizer);
app.use("/api/check-admin", tokenAuth, adminAuthorizer);
app.use("/api/check-superAdmin", tokenAuth, superAdminAuthorizer);

const upload = multer({ storage: multer.memoryStorage() });
//scheduler
scheduleFetchData();
//Routes
app.get("/", (req, res) => {
  res.send("Server is working");
});

// app.use("/api/farmer", require("./routes/farmer")); //Farmer Api
app.use("/api/crop", verifyRequest, require("./routes/crop")); //Crop Api
app.use("/api/cropCalendar", verifyRequest, require("./routes/cropCalendar")); //Crop Api
app.use("/api/varitie", verifyRequest, require("./routes/varities")); //varities Api
app.use("/api/pest", verifyRequest, require("./routes/pest")); //Pest Api
app.use("/api/pesticide", verifyRequest, require("./routes/pesticide")); //Pesticide Api
app.use("/api/weed", verifyRequest, require("./routes/weed")); //weed Api
app.use("/api/herbicide", verifyRequest, require("./routes/herbicide")); //herbicide Api
app.use("/api/disease", verifyRequest, require("./routes/disease"));
app.use("/api/fungicide", verifyRequest, require("./routes/fungicide"));
app.use("/api/yield-crop", verifyRequest, require("./routes/yieldCrop"));
app.use("/api/add-inventory", verifyRequest, require("./routes/inventory"));
app.use("/api/credit", verifyRequest, require("./routes/credit"));
app.use("/api/support", verifyRequest, require("./routes/support"));
app.use("/api/cropHealth", verifyRequest, require("./routes/cropHealth"));
app.use("/api/auth", require("./routes/authentication"));
app.use("/api/admin", tokenAuth, require("./routes/admin"));
app.use("/api/farmer", verifyRequest, require("./routes/farmer"));
app.use("/api", require("./routes/popup.js"));
app.use("/api", verifyRequest, require("./routes/emailsender.js"));
app.use("/api/farmers", verifyRequest, require("./routes/farmerR.js"));
app.use("/api", require("./routes/Weather.js"));
app.use("/api/me", verifyRequest, require("./routes/MandiPrices.js"));
app.use("/api", verifyRequest, require("./routes/DataModel.js"));

//App routes

app.use("/api", verifyRequest, require("./routes/fpoRoutes"));
app.use(
  "/api/appFarmer",
  verifyRequest,
  require("./routes/appFarmerRoutes.js")
);
app.use("/api", verifyRequest, require("./routes/appEditaddress.js"));
app.use("/api", verifyRequest, require("./routes/appEditProfile.js"));
app.use("/api", verifyRequest, require("./routes/appBankDetails.js"));
app.use("/api", verifyRequest, require("./routes/appOtherDetails.js"));
app.use("/api", verifyRequest, require("./routes/appEnqiry.js"));
app.use("/api", verifyRequest, require("./routes/appMandi.js"));
app.use("/api", verifyRequest, require("./routes/appCropRoutes.js"));
app.use("/api", verifyRequest, require("./routes/appVerifyDetails.js"));
app.use("/api", verifyRequest, require("./routes/appNews.js"));
app.use("/api", verifyRequest, require("./routes/appInsightData.js"));
app.use(
  "/api/market",
  verifyRequest,
  require("./routes/appMarketInsightYealeyData.js")
);
app.use("/api/appData", verifyRequest, require("./routes/appMarketInsight.js"));
app.use("/api/whatsapp", verifyRequest, require("./routes/sendWhatappSMS.js"));
app.post(
  "/api/upload",
  verifyRequest,
  upload.single("image"),
  async (req, res) => {
    const file = req.file;
    console.log("file", file);

    if (!file) {
      return res.status(400).send("File not found");
    }

    try {
      const result = await uploadFile(file);
      console.log("result", result);

      res.send(result);
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).send("Error uploading file");
    }
  }
);
app.get("/images/:key", async (req, res) => {
  const fileKey = req.params.key;
  await getFile(fileKey, res);
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send({ message: err.message || "Internal Server Error" });
});

app.get("/api/ping", (req, res) => {
  res.send("pong");
});
// app.use("/api/pos",require("./routes/pos")) // POS module
app.post("/api/sendsms", async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    await sendSMS(phoneNumber);
    console.log("cllaed index");

    res.status(200).json({ message: "SMS sent successfully" });
  } catch (error) {
    console.error("Error sending SMS:", error);
    res
      .status(500)
      .json({ message: "Error sending SMS", error: error.message });
  }
});

// Route for sending WhatsApp SMS

//verify otp
app.post("/api/verify-otp", async (req, res) => {
  const { phoneNumber, otp } = req.body;

  const otpRecord = await OTP.findOne({ phoneNumber, otp });
  if (otpRecord) {
    res.status(200).json({ success: true, otpRecord: otpRecord });
  } else {
    res.status(200).json({ success: false });
  }
});

//popup

//Connect to DB.
connectDB();
async function databaseAdjust() {
  // {
  //   n.name = n.name.split(" ")[0]
  // }
  const crops = await Crop.find({});
  for (let cr of crops) {
    if (Object.keys(cr?.weedManagement[0]).length == 1) {
      cr.weedManagement.slice(1);
      await cr.save();
    }
  }
  // crop.nutrient.splice(0,crop.nutrient.length);
  // await crop.save();
  // console.log("saved for crop ", crop.localName)
}
// databaseAdjust();

// //static files
app.use(express.static(path.join(__dirname, "./krishiiyan/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./krishiiyan/build/index.html"));
});

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`server running at port:${port}`);
});

//harvest model
