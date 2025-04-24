import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// const fields = []; // Initialize fields as an empty array

const generateAccessAndRefereshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refereshToken = user.generateRefereshToken();

    // store in database for login without password as usual
    user.refereshToken = refereshToken;
    await user.save({ validateBeforeSave: true }); //save in db without validate

    return { accessToken, refereshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wront while generating referesh and access token"
    );
  }
};

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

  // here are some problems with formdata req == TypeError: fields.forEach is not a function with json req no problem

  // check for image
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  console.log(req.files);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // // // upload on cloudinary

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

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

const loginUser = asyncHandler(async (req, res) => {
  // req.body -> data
  // username or email
  // find the user
  // password check
  // access and refresh token
  // send cookie

  const { username, email, password } = req.body;
  if (!username || !email) {
    throw new ApiError(400, "username or password is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  // password check for this user from its password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Please enter correct password");
  }

  // call for tokens
  const { accessToken, refereshToken } = await generateAccessAndRefereshToken(
    user._id
  );
  // denie unwanted tpyes from user || optional work
  const loggedInUser = await User.findById(user._id).select(
    "-password -refereshToken"
  );
  // cookies modification false from frontend
  const options = {
    httpOnly: true,
    secure: true,
  };

  // return response
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refereshToken", refereshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refereshToken,
        },
        "User logged In successfully "
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // use middleware to access tokens or id for logout user
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refereshToken: undefined },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refereshToken", options)
    .json(200, {}, "user logged out");
});
export { registerUser, loginUser, logoutUser };
