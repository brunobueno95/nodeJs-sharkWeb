import mongoose from "mongoose";
import {cloudinary}  from "../utils/cloudinary"

const SharksSchema = new mongoose.Schema({
  commonName: { type: String, required: true },
  specie: { type: String, required: true },
  family: { type: String, required: true },
  countries: { type: [String], required: true },
  depth: { type: String, required: true },
  info: { type: String, required: true },
  image: { type: String, required: false },
});

export const SharkModel = mongoose.model("Shark", SharksSchema);

export const getSharks = () => SharkModel.find();

export const getSharkById = (id: string) => SharkModel.findById(id);

export const createShark = (values: Record<string, any>) =>
  new SharkModel(values).save().then((user) => user.toObject());

export const deleteSharkById = (id: string) =>
  SharkModel.findOneAndDelete({ _id: id });


  export const updateSharkById = async (id: string, updatedValues: Record<string, any>) => {

    return SharkModel.findOneAndUpdate(
      { _id: id },
      { $set: updatedValues },
      { new: true } // Return the updated document
    );
  };

