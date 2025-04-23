import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// const fields = []; // Initialize fields as an empty array

const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json({
  //   message: "ok",
  //   name: "bittu",
  // });
  // get user details from frontend
  // validation - non empty
  // check if user already exists:username,email
  // check for images, check for avatar
  // upload them on cloudinary ,avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return response

  // if (req.body) {
  //   const { fullName, email, username, password } = req.body;
  //   console.log(fullName, email, username, password);
  // } else {
  //   console.error("req.body is undefined or null");
  // }

  const { fullName, email, username, password } = req.body;
  console.log("email: ", email);
  // if (fullName === "") {
  //   throw new ApiError(400, "fullname is required");
  // }

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all fields are required");
  }

  // user exists checking
  // const existsUserOption = User.findOne({ email });

  const existsUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existsUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // here are some problems == TypeError: fields.forEach is not a function

  // check for image
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // if (!avatarLocalPath) {
  //   throw new ApiError(400, "Avatar file is required");
  // }

  // // // upload on cloudinary

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(avatarLocalPath);

  // if (!avatar) {
  //   throw new ApiError(400, "Avatar file is required");
  // }

  // create user object - create entry in db
  const user = await User.create({
    fullName,
    avatar: avatar?.url || "",
    coverImage: coverImage?.url || "",
    email,
    username: username.toLowerCase(),
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating user");
  }

  // return res.status(201).json({ createdUser });
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User register successfully"));
});

export default registerUser;
