import express from "express";

export const UserController = express.Router()

UserController.get("/auth/login", (req, res) => {
  res.send("<h1>Você está em /User</h1>")
})




