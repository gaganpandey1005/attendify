const Teacher = require("../model/teacherModel");

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
// console.log("Token",token);

    if (!token) {
      return res.status(400).json({ message: "Missing or Invalid Token" });
    }

    const user = await Teacher.findOne({
        token,
      tokenExpiry: { $gt: Date.now() },
    });
// console.log("verification token",user);

    if (!user) {
      return res.status(404).json({ message: "Token Expired or Invalid" });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.tokenExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: "Email Verified Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = verifyEmail;
