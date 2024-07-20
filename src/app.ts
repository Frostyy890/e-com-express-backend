import express, { Request, Response } from "express";
import { appConfig } from "./config/app.config";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(appConfig.port, () => {
  console.log(
    `[server] listening on port ${appConfig.port}\n[mode] ${appConfig.env}\n[local] http://localhost:${appConfig.port}`
  );
});
