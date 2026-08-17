import type { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma.js";

export async function validation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let username = req.body.username.trim() || "anonymous";
  const content = req.body.content.trim() || "";
  const uuid = req.cookies.uuid ?? req.body.uuid;

  const usernameCheck = await prisma.post.findFirst({
    where: { username },
  });

  if (usernameCheck) {
    username = username.concat(Math.floor(Math.random() * 100000));
  }

  req.body.username = username;
  req.body.content = content;
  req.body.uuid = uuid;

  if (username.length > 30)
    return res
      .status(400)
      .json({ message: "Invalid username.", statusCode: 400 });
  if (!content)
    return res
      .status(400)
      .json({ message: "Invalid post content.", statusCode: 400 });
  if (content.length > 200)
    return res
      .status(400)
      .json({ message: "Post content too long.", statusCode: 400 });

  next();
}
