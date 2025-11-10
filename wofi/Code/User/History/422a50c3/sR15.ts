import mongoose from "mongoose";
import { User } from "../../domain/entities/user/User";
import { UserProps } from "../../domain/entities/user/User";

async function main() {
  await mongoose.connect("");

  const UserModel = new mongoose.Schema(User)

  console.log(UserModel);

}

main().catch(e => console.error(e));