import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";
import { prisma } from "../prisma.js";

export async function user(req: Request, res: Response, next: NextFunction) {
  const newUUID = randomUUID();

  let uuid = req.cookies.uuid;
  const ip = req.ip;

  if (!uuid) {
    uuid = newUUID;
    req.body.uuid = newUUID;
    req.cookies.uuid = newUUID;
    res.cookie("uuid", newUUID, {
      httpOnly: true,
    });
  }

  if (!ip)
    return res
      .status(400)
      .json({ message: "Missing user identification.", statusCode: 400 });

  try {
    const posts = await prisma.post.findFirst({
      where: {
        OR: [{ uuid }, { ip }],
      },
    });

    if (!posts) {
      next();
    } else {
      return res
        .status(401)
        .json({ message: "You already made a post.", statusCode: 401 });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error.", statusCode: 500 });
  }
}
