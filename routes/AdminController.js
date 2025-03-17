const Admin = require("../models/admin");
const Dealer = require("../models/dealer");

const makeAdmin = async (req, res) => {
  const { dealerId, isSuperAdmin } = req.body;

  try {
    const dealer = await Dealer.findById(dealerId);
    if (!dealer) {
      return res.status(404).json({ message: "Dealer not found" });
    }

    let admin = await Admin.findOne({ user: dealerId });
    if (admin) {
      admin.isSuperAdmin = isSuperAdmin || false;
      admin.active = true;
    } else {
      admin = new Admin({
        user: dealerId,
        isSuperAdmin: isSuperAdmin || false,
        active: true,
      });
    }

    await admin.save();
    return res
      .status(200)
      .json({ message: "Dealer has been made an admin", admin });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  makeAdmin,
};
