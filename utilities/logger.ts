import winston, { createLogger, format, Logger } from "winston";

const LogstashTransport = require("@alfalab/winston3-logstash-transport");

const LOGSTASH_MODE = process.env.LOGSTASH_MODE;
const LOGSTASH_HOST = process.env.LOGSTASH_HOST;
const LOGSTASH_PORT = process.env.LOGSTASH_PORT;
const LOGGING_LEVELS = process.env.LOGGING_LEVELS ?? "error,warn";
const LOGFILE_PATH = process.env.LOGFILE_PATH ?? "";

/**
 * Server logger instance - configured via env.
 * OBS! Use only on server running code (nodejs)
 *
 * uses winston and console logging
 *
 * @returns {ServerLogger} Logger instance
 */
export class ServerLogger {
  private static instance: ServerLogger;
  private _logger: Logger | undefined;

  constructor() {
    this._logger = createLogger();

    const levels =
      LOGGING_LEVELS && LOGGING_LEVELS.includes(",")
        ? LOGGING_LEVELS.split(",")
        : [LOGGING_LEVELS];

    levels.forEach((level) => {
      //add console transports (OBS might lead to duplicates in console output)
      this._logger?.add(
        new winston.transports.Console({
          level: level,
          format: format.combine(
            format.colorize(),
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
            format.printf(
              (info) => `${info.timestamp} ${info.level}: ${info.message}`,
            ),
          ),
        }),
      );

      //add logstash transports
      if (LOGSTASH_HOST) {
        this._logger?.add(
          new LogstashTransport({
            mode: LOGSTASH_MODE ?? "tcp",
            host: LOGSTASH_HOST,
            port: LOGSTASH_PORT ?? 5000,
            level: level,
            format: format.combine(format.json()),
            trailingLineFeed: true,
          }),
        );
      }

      if (LOGFILE_PATH?.length > 0)
        this._logger?.add(
          new winston.transports.File({
            level: level,
            filename: LOGFILE_PATH,
            tailable: true,
            maxFiles: 1,
            maxsize: 100000,
            format: format.combine(
              format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
              format.printf(
                (info) => `${info.timestamp} ${info.level}: ${info.message}`,
              ),
              format.json(),
            ),
          }),
        );
    });
  }

  public static getInstance(): ServerLogger {
    if (!ServerLogger.instance) {
      ServerLogger.instance = new ServerLogger();
    }
    return ServerLogger.instance;
  }

  public static getWinstonInstance(): Logger | undefined {
    if (!ServerLogger.instance) {
      ServerLogger.instance = new ServerLogger();
    }
    return ServerLogger.instance._logger;
  }

  error(err: any) {
    this._logger?.error(err);
  }

  warning(warn: any) {
    this._logger?.warning(warn);
  }

  info(info: any) {
    this._logger?.info(info);
  }
}

export default ServerLogger;
