import express from "express";
import {
  getSharks,
  getSharkById,
  createShark,
  deleteSharkById,
  updateSharkById,
} from "../db/sharks";

import {cloudinary}  from "../utils/cloudinary"

export const getAllSharks = async (
  req: express.Request,
  res: express.Response
) => {
  const sharks = await getSharks();
  res.json(sharks);
};

export const getShark = async (req: express.Request, res: express.Response) => {
  const shark = await getSharkById(req.params.id);
  res.json(shark);
};

export const addShark = async (req: express.Request, res: express.Response) => {
  const { commonName, specie, family, size, countries, depth, info, image } = req.body;

  // Check if all required fields are provided
  if (!commonName || !specie || !family || !size || !countries || !depth || !info || !image) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Upload the image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(image, {
      folder: 'shark_images'
    });

    // Create the updated shark object with the Cloudinary URL
    const updatedShark = {
      commonName,
      specie,
      family,
      size,
      countries,
      depth,
      info,
      image: cloudinaryResponse.secure_url // Update the image property with the Cloudinary URL
    };

    // Create the shark object in the database
    const shark = await createShark(updatedShark);

    // Respond with success status and the created shark
    res.status(201).json({ message: "Shark created successfully", shark });
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error.message);

    // Respond with an appropriate error status and message
    res.status(500).json({ error: `Failed to upload image to Cloudinary: ${error.message}` });
  }
};

export const removeShark = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const sharkId = req.params.id;

    const sharkToDelete = await deleteSharkById(req.params.id); //

    if (!sharkToDelete) {
      return res.status(404).json({ error: "Shark not found" });
    }

    await deleteSharkById(sharkId);

    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting shark:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const updateShark = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const updatedShark = req.body;

  try {
    // Upload the image to Cloudinary if provided
    if (updatedShark.image) {
      const cloudinaryResponse = await cloudinary.uploader.upload(updatedShark.image, {
        folder: 'shark_images'
      });

      // Update the image property with the Cloudinary URL
      updatedShark.image = cloudinaryResponse.secure_url;
    }

    // Update the shark in the database
    const updatedSharkResult = await updateSharkById(id, updatedShark);

    if (!updatedSharkResult) {
      return res.status(404).json({ error: "Shark not found" });
    }

    // Respond with success status and the updated shark
    res.status(200).json({ message: "Shark updated successfully", shark: updatedSharkResult });
  } catch (error) {
    console.error('Error updating shark:', error.message);

    // Respond with an appropriate error status and message
    res.status(500).json({ error: `Failed to update shark: ${error.message}` });
  }
};

