import mongoose from "mongoose";
import { User } from "../../domain/entities/user/User";
import { type UserProps } from "../../domain/entities/user/User";
import { UserType } from "../../domain/entities/user/UserType";

async function main() {
  await mongoose.connect("");

  new mongoose.Schema(UserType)

}