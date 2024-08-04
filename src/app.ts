import express from "express";
import { settings } from "@config/settings";
import { appRouter } from "@api/v1/routes/AppRoutes";
import { ExceptionHandler, Logger } from "@api/v1/middlewares";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(Logger);

app.use("/api/v1", appRouter);
app.use((_req, res) => res.status(404).send({ errors: [{ detail: "Not found" }] }));
app.use(ExceptionHandler);

app.listen(settings.port, () => {
  console.log(
    `[server] listening on port ${settings.port}\n[mode] ${settings.env}\n[local] http://localhost:${settings.port}`
  );
});
