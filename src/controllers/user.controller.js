import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import * as http from "node:http";
import { getReasonPhrase, ReasonPhrases, StatusCodes } from "http-status-codes";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinaryService.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(
  async (req, res) => {
    //Get user details from UI/RestClient
    //validation - not empty
    //Check if user already exists username
    //Check for images, check for avatar
    //Upload them to cloudinary get response url
    //Create User Object - create entry in db Call
    //Check for user creation
    //Return res
    const { fullName, email, username, password } = req.body;
    if (
      [fullName, email, username, password]
        .some(
          (field) => field?.trim() === "",
        )) {
      throw new ApiError(StatusCodes.BAD_REQUEST, ReasonPhrases.PARTIAL_CONTENT);
    }
    const getUserByIdOrUsername = await User.findOne({
        $or: [{ username }, { email }],
      },
    );
    if (getUserByIdOrUsername) {
      throw new ApiError(StatusCodes.CONFLICT, ReasonPhrases.CONFLICT + " User already Exists");
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImagePath = req.files?.coverImage[0]?.path;
    if (!avatarLocalPath) throw new ApiError(StatusCodes.BAD_REQUEST, "Avatar is missing");
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImagePath);
    if (!avatar) throw new ApiError(StatusCodes.BAD_REQUEST, "Avatar was not sent to cloudinary");

    const user = await User.create({
      fullName: fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase(),
    });
    const userFoundById = await User.findById(user._id)
      //Yeh vale ke alava saare ayege
      .select("-password -refreshToken");
    if (!userFoundById) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong with server");
    const apiResponse = new ApiResponse(StatusCodes.ACCEPTED, `User created with id ${user._id} `, `Details: ${userFoundById}`);
    return res.json(apiResponse);
  },
);
export { registerUser };
