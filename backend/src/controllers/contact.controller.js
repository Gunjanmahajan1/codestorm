const Contact = require("../models/Contact.model");

/* -------------------- GET CONTACT -------------------- */
exports.getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOne();

    if (!contact) {
      return res.status(200).json({
        success: true,
        data: {
          email: "",
          linkedin: "",
          instagram: "",
          whatsapp: "",
        },
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } 
    catch (error) {
  console.error("Contact controller error:", error);

  return res.status(500).json({
    success: false,
    message: "Internal server error while updating contact",
  });
}

  
};

/* -------------------- UPDATE CONTACT -------------------- */
exports.updateContact = async (req, res) => {
  try {
    // 🔒 Defensive body handling
    const {
      email = "",
      linkedin = "",
      instagram = "",
      whatsapp = "",
    } = req.body || {};

    let contact = await Contact.findOne();

    if (!contact) {
      contact = new Contact({
        email,
        linkedin,
        instagram,
        whatsapp,
      });
    } else {
      contact.email = email;
      contact.linkedin = linkedin;
      contact.instagram = instagram;
      contact.whatsapp = whatsapp;
    }

    await contact.save();

    return res.status(200).json({
      success: true,
      message: "Contact details updated successfully",
      data: contact,
    });
  } catch (error) {
    console.error("UPDATE CONTACT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update contact details",
    });
  }
};
