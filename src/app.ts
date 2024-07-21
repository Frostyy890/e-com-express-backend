import express from "express";
import { appConfig } from "@config/AppConfig";
import { appRouter } from "@api/v1/routes/AppRoutes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", appRouter);
app.use((_req, res) => res.status(404).send({ errors: [{ detail: "Not found" }] }));

app.listen(appConfig.port, () => {
  console.log(
    `[server] listening on port ${appConfig.port}\n[mode] ${appConfig.env}\n[local] http://localhost:${appConfig.port}`
  );
});
