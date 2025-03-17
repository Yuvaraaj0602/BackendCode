const FpoOrganization = require("../models/appFPOUser");

// Update FPO Organization Profile
exports.updateProfile = async (req, res) => {
  try {
    const { _id, ...updateData } = req.body;

    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid or missing FPO organization ID",
        error: {
          code: "INVALID_FPO_ID",
          description: "Please provide a valid MongoDB ObjectId.",
        },
      });
    }

    const updatedProfile = await FpoOrganization.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).send({
        success: false,
        message: "FPO organization not found",
        error: {
          code: "FPO_ORGANIZATION_NOT_FOUND",
          description: `No FPO organization found with ID: ${_id}`,
        },
      });
    }

    res.status(200).send({
      success: true,
      message: "FPO organization updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating FPO organization:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error while updating FPO organization",
      error: {
        code: "FPO_ORGANIZATION_UPDATE_ERROR",
        description: error.message,
      },
    });
  }
};
// Get FPO Organization by ID
exports.getProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    const fpoProfile = await FpoOrganization.findById(id);

    if (!fpoProfile) {
      return res.status(404).send({
        success: false,
        message: "FPO organization not found",
        error: {
          code: "FPO_ORGANIZATION_NOT_FOUND",
          description: `No FPO organization found with ID: ${id}`,
        },
      });
    }

    res.status(200).send({
      success: true,
      message: "FPO organization retrieved successfully",
      data: fpoProfile,
    });
  } catch (error) {
    console.error("Error retrieving FPO organization:", error);
    res.status(400).send({
      success: false,
      message: "Error retrieving FPO organization",
      error: {
        code: "FPO_ORGANIZATION_RETRIEVAL_ERROR",
        description: error.message,
      },
    });
  }
};

// Get FPO Organization by contact number (excluding password)
exports.getProfileByContactNumber = async (req, res) => {
  try {
    const { contactNumber } = req.params;

    const fpoProfile = await FpoOrganization.findOne({ contactNumber }).select(
      "-password"
    );

    if (!fpoProfile) {
      return res.status(404).send({
        success: false,
        message: "FPO organization not found",
        error: {
          code: "FPO_ORGANIZATION_NOT_FOUND",
          description: `No FPO organization found with contact number: ${contactNumber}`,
        },
      });
    }

    res.status(200).send({
      success: true,
      message: "FPO organization retrieved successfully",
      data: fpoProfile,
    });
  } catch (error) {
    console.error("Error retrieving FPO organization:", error);
    res.status(400).send({
      success: false,
      message: "Error retrieving FPO organization",
      error: {
        code: "FPO_ORGANIZATION_RETRIEVAL_ERROR",
        description: error.message,
      },
    });
  }
};

exports.updateProfileByContactNumber = async (req, res) => {
  try {
    const { contactNumber } = req.params;
    const updateData = req.body;

    delete updateData.contactNumber;
    delete updateData.password;

    const updatedProfile = await FpoOrganization.findOneAndUpdate(
      { contactNumber },
      updateData,
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).send({
        success: false,
        message: "FPO organization not found",
        error: {
          code: "FPO_ORGANIZATION_NOT_FOUND",
          description: `No FPO organization found with contact number: ${contactNumber}`,
        },
      });
    }

    res.status(200).send({
      success: true,
      message: "FPO organization updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating FPO organization:", error);
    res.status(400).send({
      success: false,
      message: "Error updating FPO organization",
      error: {
        code: "FPO_ORGANIZATION_UPDATE_ERROR",
        description: error.message,
      },
    });
  }
};

// Update Entity by contact number
exports.updateByContactNumber = async (req, res) => {
  try {
    const { contactNumber } = req.params;
    const {
      nameOfEntity,
      typeOfEntity,
      incorporationDate,
      incorporationNumber,
      businessLocation,
      contactPersonName,
      contactNumberUpadte,
      yourDesignation,
      Email,
      URL,
    } = req.body;

    const fpo = await FpoOrganization.findOne({ contactNumber });

    if (!fpo) {
      return res.status(404).send({
        success: false,
        message: "Entity not found",
        error: {
          code: "Entity_NOT_FOUND",
          description: `No Entity found with contact number: ${contactNumber}`,
        },
      });
    }

    if (nameOfEntity) fpo.nameOfFpo = nameOfEntity;
    if (typeOfEntity) fpo.typeOfFpo = typeOfEntity;
    if (incorporationDate) fpo.dateOfFpo = incorporationDate;
    if (incorporationNumber) fpo.IncorportionNumber = incorporationNumber;
    if (businessLocation) fpo.BusinessLocation = businessLocation;
    if (contactPersonName) fpo.promoterName = contactPersonName;
    if (contactNumberUpadte) fpo.contactNumber = contactNumberUpadte;
    if (yourDesignation) fpo.yourDesignation = yourDesignation;
    if (Email) fpo.organizationalEmail = Email;
    if (URL) fpo.URl = URL;

    await fpo.save();

    const updatedFields = {
      contactNumber,
    };

    if (nameOfEntity) updatedFields.nameOfFpo = nameOfEntity;
    if (typeOfEntity) updatedFields.typeOfFpo = typeOfEntity;
    if (incorporationDate) updatedFields.dateOfFpo = incorporationDate;
    if (incorporationNumber)
      updatedFields.IncorportionNumber = incorporationNumber;
    if (businessLocation) updatedFields.BusinessLocation = businessLocation;
    if (contactPersonName) updatedFields.promoterName = contactPersonName;
    if (contactNumberUpadte) updatedFields.contactNumber = contactNumberUpadte;
    if (yourDesignation) updatedFields.yourDesignation = yourDesignation;
    if (Email) updatedFields.organizationalEmail = Email;
    if (URL) updatedFields.URL = URL;

    res.status(200).send({
      success: true,
      message: "Entity updated successfully",
      data: updatedFields,
    });
  } catch (error) {
    console.error("Error updating Entity:", error);
    res.status(500).send({
      success: false,
      message: "Error updating Entity",
      error: {
        code: "Entity_UPDATE_ERROR",
        description: error.message,
      },
    });
  }
};

// Get FPO Organization by contact number
exports.getByContactNumber = async (req, res) => {
  try {
    const { contactNumber } = req.params;

    const fpo = await FpoOrganization.findOne({ contactNumber });

    if (!fpo) {
      return res.status(404).send({
        success: false,
        message: "Entity not found",
        error: {
          code: "Entity_NOT_FOUND",
          description: `No entity found with contact number: ${contactNumber}`,
        },
      });
    }

    const response = {
      success: true,
      message: "Entity fetched successfully",
      data: {
        nameOfEntity: fpo.nameOfFpo,
        typeOfEntity: fpo.typeOfFpo,
        incorporationDate: fpo.dateOfFpo,
        incorporationNumber: fpo.IncorportionNumber,
        businessLocation: fpo.BusinessLocation,
        contactPersonName: fpo.promoterName,
        yourDesignation: fpo.yourDesignation,
        URL: fpo.URl,
        Email: fpo.organizationalEmail,
        contactNumber: fpo.contactNumber,
        URL: fpo.URl,
      },
    };
    res.status(200).send(response);
  } catch (error) {
    console.error("Error fetching Entity:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching Entity",
      error: {
        code: "Entity_FETCH_ERROR",
        description: error.message,
      },
    });
  }
};

// Get FPO data based on type of organization
exports.getFpoByTypeOfOrganization = async (req, res) => {
  try {
    const { typeOfOrganization } = req.params;
    const fpoData = await FpoOrganization.find({ typeOfOrganization });

    if (fpoData.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No Entity found for the specified type of organization",
        error: {
          code: "FPO_TYPE_ORG_NOT_FOUND",
          description: `No Entity found with type of organization: ${typeOfOrganization}`,
        },
      });
    }

    res.status(200).send({
      success: true,
      message: "Entity data retrieved successfully",
      data: fpoData,
    });
  } catch (error) {
    console.error("Error retrieving ENTITY data:", error);
    res.status(500).send({
      success: false,
      message: "Error retrieving ENTITY data",
      error: {
        code: "ENTITY_ORGANIZATION_RETRIEVAL_ERROR",
        description: error.message,
      },
    });
  }
};

// Get FPO data based on type of FPO
exports.getFpoByTypeOfFpo = async (req, res) => {
  try {
    const { typeOfFpo } = req.params;
    const fpoData = await FpoOrganization.find({ typeOfFpo });

    if (fpoData.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No entity found for the specified type of entity",
        error: {
          code: "ENTITY_TYPE_ENTITY_NOT_FOUND",
          description: `No Entity found with type of entity: ${typeOfFpo}`,
        },
      });
    }

    res.status(200).send({
      success: true,
      message: "Entity data retrieved successfully",
      data: fpoData,
    });
  } catch (error) {
    console.error("Error retrieving Entity data:", error);
    res.status(500).send({
      success: false,
      message: "Error retrieving Entity data",
      error: {
        code: "ENTITY_TYPE_ENTITY_RETRIEVAL_ERROR",
        description: error.message,
      },
    });
  }
};
