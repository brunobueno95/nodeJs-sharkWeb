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
      return null; 
    }

    const isPasswordValid = user.password === password;

    if (!isPasswordValid) {
      return null; 
    }

    return user; 
  } catch (error) {
    throw error;
  }
};
