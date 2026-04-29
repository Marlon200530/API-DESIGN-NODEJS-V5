import { Router } from "express";

const userRoutes = Router();

userRoutes.get("/", async (_req, res) => {
  res.json({
    message: "users",
  });
});

userRoutes.get("/:id", async (_req, res) => {
  res.json({
    message: "Got user",
  });
});

userRoutes.put("/:id", async (_req, res) => {
  res.json({
    message: "user updated",
  });
});

export default userRoutes;
