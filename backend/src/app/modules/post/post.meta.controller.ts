import { Request, Response } from "express";
import { Post } from "./post.model";

export class PostMetaController {
  static async serveOgShell(req: Request, res: Response) {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).send("Not found");
      }
      const title = post.title || "Story Spark AI";
      const description = (post.content || "").slice(0, 150);
      const image = post.imageURL || "";
      const url = `${process.env.FRONTEND_URL}/post/${post._id}`;

      return res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${title}</title>
  <meta property="og:title" content="${title}"/>
  <meta property="og:description" content="${description}"/>
  <meta property="og:image" content="${image}"/>
  <meta property="og:url" content="${url}"/>
  <meta property="og:type" content="article"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${title}"/>
  <meta name="twitter:description" content="${description}"/>
  <meta name="twitter:image" content="${image}"/>
  <meta http-equiv="refresh" content="0;url=${url}"/>
</head>
<body>Redirecting...</body>
</html>`);
    } catch (err) {
      return res.status(500).send("Server error");
    }
  }
}
