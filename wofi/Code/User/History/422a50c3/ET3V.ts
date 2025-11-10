import mongoose from "mongoose";
import { User } from "../../domain/entities/user/User";
import { type UserProps } from "../../domain/entities/user/User";

async function main() {
  await mongoose.connect("");

  new mongoose.Schema(UserProps)

}