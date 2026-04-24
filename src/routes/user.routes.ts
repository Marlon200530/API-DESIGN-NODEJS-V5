import { Router } from "express";

const userRoutes = Router();

userRoutes.get("/", async (req, res) => {
  res.json({
    message: "users",
  });
});

userRoutes.get("/:id", async (req, res) => {
  res.json({
    message: "Got user",
  });
});

userRoutes.put("/:id", async (req, res) => {
  res.json({
    message: "user updated",
  });
});

export default userRoutes;
