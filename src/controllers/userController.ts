import express from "express";
import { authenticateUser } from "../db/users";

// Handle user login
export const loginUser = async (
  req: express.Request,
  res: express.Response
) => {
  const { userName, password } = req.body;
  try {
    const user = await authenticateUser(userName, password);
    if (user) {
      res.json({ message: "Login successful", user });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Could not authenticate user" });
  }
};
