import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
});

export const UserModel = mongoose.model("User", UsersSchema);

export const authenticateUser = async (userName: string, password: string) => {
  try {
    const user = await UserModel.findOne({ userName });

    if (!user) {
      return null; // User not found
    }

    const isPasswordValid = user.password === password;

    if (!isPasswordValid) {
      return null; // Password does not match
    }

    return user; // User authenticated successfully
  } catch (error) {
    throw error;
  }
};
