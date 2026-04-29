import { Router } from "express";
import { auth } from "../middlewares/auth.ts";

const habitRoutes = Router();

habitRoutes.get("/", auth ,async (_req, res) => {
  res.status(200).json({
    message: "habits",
  });
});

habitRoutes.get("/:id", auth, async (_req, res) => {
  res.status(200).json({
    message: "got one habit",
  });
});

habitRoutes.post("/", auth, async (_req, res) => {
  res.status(201).json({
    message: "created habit",
  });
});

habitRoutes.post("/:id/complete", auth ,async(_req, res) => {
    res.status(201).json({
        message: "completed habit"
    })
})


export default habitRoutes;
