import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
// CORS_ORIGIN may be "*" (default) or a comma-separated list of allowed origins.
const corsOrigin = process.env["CORS_ORIGIN"]?.trim();
const allowedOrigins =
  !corsOrigin || corsOrigin === "*"
    ? true
    : corsOrigin
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Unknown routes: respond with JSON instead of Express's default HTML page.
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

// Central error handler: log details server-side, never leak stack traces.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err }, "Unhandled error");
  const status =
    typeof (err as { status?: unknown })?.status === "number" &&
    (err as { status: number }).status >= 400 &&
    (err as { status: number }).status < 600
      ? (err as { status: number }).status
      : 500;
  res
    .status(status)
    .json({ error: status === 500 ? "Internal server error" : "Request failed" });
});

export default app;
