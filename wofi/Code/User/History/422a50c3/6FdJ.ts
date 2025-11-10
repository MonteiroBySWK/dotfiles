import mongoose from "mongoose";
import { User } from "../../domain/entities/user/User";
import { UserProps } from "../../domain/entities/user/User";

async function main() {
  await mongoose.connect("");

  const UserModel = new mongoose.Schema(UserProps);

  console.log(UserProps);

}

main().catch(e => console.error(e));