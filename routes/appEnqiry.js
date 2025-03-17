const express = require("express");
const router = express.Router();
const commodityController = require("../controllers/appEnquiry");

// Route for creating or updating commodity details
router.post("/commodity", commodityController.createOrUpdateCommodity);

// Route for fetching commodity details by UID
router.get("/commodity/:uid", commodityController.getCommodityByUid);

// Route for fetching all commodities
router.get("/commodity/commodities", commodityController.getAllCommodities);

// Route to update a single commodity by UID and _id
router.put(
  "/commodities/:uid/:id",
  commodityController.updateCommodityByUidAndId
);

router.get(
  "/commodities/:commodity",
  commodityController.getCommoditiesByValue
);

router.get(
  "/commodities/:uid/:commodity",
  commodityController.getCommoditiesByUidOperationCommodity
);

router.patch(
  "/commodity/:uid/verified",
  commodityController.updateVerifiedStatus
);

router.delete("/commodity/delete/:uid", commodityController.deleteEnquiryByUid);

module.exports = router;
