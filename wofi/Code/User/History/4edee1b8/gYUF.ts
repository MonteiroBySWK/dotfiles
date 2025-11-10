import { NextApiRequest, NextApiResponse } from "next";

export default function POST(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({message: "yes"})
}