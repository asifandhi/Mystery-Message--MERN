import { User } from "../models/user.model.js";
import {
  apiError,
  apiResponse,
  asyncHandler,
} from "../utils/index.js";
import { sendOTPEmail } from "../utils/email.util.js";
export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new apiError(
      400,
      "All fields are required: username, email, password"
    );
  }

  const isUserExist = await User.findOne({ username, isVerified: true });
  if (isUserExist) throw new apiError(400, "Username is already taken");

  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
  const verifyCodeExpiry = new Date(Date.now() + 3600000 / 2);

  const isEmailExist = await User.findOne({ email });

  let newUser;

  if (isEmailExist) {
    if (isEmailExist.isVerified)
      throw new apiError(400, "User already exists with this email");
    isEmailExist.password = password;
    isEmailExist.verifyCode = verifyCode;
    isEmailExist.verifyCodeExpiry = verifyCodeExpiry;
    newUser = await isEmailExist.save();
  } else {
    newUser = await User.create({
      username,
      email,
      password,
      verifyCode,
      verifyCodeExpiry,
      isVerified: false,
      isAcceptingMessages: true,
      messages: [],
    });
  }

  await sendOTPEmail({ to: email, otp: verifyCode });
  return res
    .status(201)
    .json(
      new apiResponse(201, {}, "User registered. Please verify your account.")
    );
});

export const verifyCode = asyncHandler(async (req, res) => {
  const { username, code } = req.body;

  const user = await User.findOne({ username });
  if (!user) throw new apiError(404, "User not found");

  const isCodeValid = user.verifyCode === code;
  const isNotExpired = new Date(user.verifyCodeExpiry) > new Date();

  if (!isNotExpired)
    throw new apiError(400, "Verification code expired. Please sign up again.");
  if (!isCodeValid) throw new apiError(400, "Incorrect verification code");

  user.isVerified = true;
  await user.save();

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Account verified successfully"));
});

const options = {
  httpOnly: true,
  secure: true,
};

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new apiError(400, "Email and password are required");

  const user = await User.findOne({ email });
  if (!user) throw new apiError(404, "User not found");
  if (!user.isVerified) throw new apiError(403, "Account not verified");

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) throw new apiError(401, "Invalid credentials");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(200, { accessToken, refreshToken }, "Login successful")
    );
});

export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "Logged out successfully"));
});

export const getMe = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new apiResponse(200, req.user, "Current user fetched successfully"));
});

export const changeToggleForTheAcceptanceMSG = asyncHandler(
  async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) throw new apiError(404, "User not found");

    const status = user.isAcceptingMessages;

    user.isAcceptingMessages = !status;
    await user.save();

    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          { isAcceptingMessages: user.isAcceptingMessages },
          "Status updated"
        )
      );
  }
);

export const getAcceptStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new apiError(404, "User not found");

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { isAcceptingMessages: user.isAcceptingMessages },
        "Status fetched"
      )
    );
});

export const deleteAccount = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user._id);

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "Account deleted successfully"));
});

export const checkUsernameUnique = asyncHandler(async (req, res) => {
  const { username } = req.query;

  if (!username) throw new apiError(400, "Username is required");

  const existing = await User.findOne({ username, isVerified: true });

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { isUnique: !existing },
        existing ? "Username is already taken" : "Username is unique"
      )
    );
});

export const getPublicAcceptStatus = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) throw new apiError(404, "User not found");
  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { isAcceptingMessages: user.isAcceptingMessages },
        "Fetched"
      )
    );
});
