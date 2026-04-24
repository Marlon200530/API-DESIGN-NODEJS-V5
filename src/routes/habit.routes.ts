import { Router } from "express";

const habitRoutes = Router();

habitRoutes.get("/", async (req, res) => {
  res.status(200).json({
    message: "habits",
  });
});

habitRoutes.get("/:id", async (req, res) => {
  res.status(200).json({
    message: "got one habit",
  });
});

habitRoutes.post("/", async (req, res) => {
  res.status(201).json({
    message: "created habit",
  });
});

habitRoutes.post("/:id/complete", async(req, res) => {
    res.status(201).json({
        message: "completed habit"
    })
})


export default habitRoutes;