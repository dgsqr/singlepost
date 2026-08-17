import express from "express";
import type { Application, Request, Response } from "express";
import { prisma } from "./prisma";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { validation } from "./middlewares/validation";
import { user } from "./middlewares/user";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
const PORT = 8376;

const app: Application = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.get("/ping", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server running..." });
});
app.get(
  "/posts",
  rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 50,
    message: "Too many attempts to retrieve posts. Try again later.",
  }),
  async (req: Request, res: Response) => {
    try {
      const posts = await prisma.post.findMany({
        select: {
          username: true,
          content: true,
          createdAt: true,
        },
      });
      return res.status(200).json({ posts });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Something went wrong. Try again later.",
        statusCode: 500,
      });
    }
  },
);
app.post(
  "/post",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: "Too many attempts to make your post. Try again later.",
  }),
  user,
  validation,
  async (req: Request, res: Response) => {
    try {
      const postBody = {
        username: req.body.username,
        content: req.body.content,
        uuid: String(req.body.uuid),
        ip: String(req.ip),
      };

      const post = await prisma.post.create({
        data: postBody,
      });

      console.log(post);

      return res
        .status(200)
        .json({ message: "Post successfully made.", statusCode: 200 });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Internal server error.", statusCode: 500 });
    }
  },
);

app.listen(PORT, () => {
  console.log("App running on port " + PORT);
});
