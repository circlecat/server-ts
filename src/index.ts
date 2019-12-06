import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { config } from 'dotenv';
import { Request, Response } from 'express';
import { Routes } from './router';

config();

(async () => {
  const app = express();
  app.use(bodyParser.json());

  await createConnection();
  console.log('PG connected');

  // Routes
  Routes.forEach(route => {
    (app as any)[route.method](route.route, async (req: Request, res: Response, next: Function) => {
      try {
        await new (route.controller as any)()[route.action](req, res, next);
      } catch (error) {
        next(error);
      }
    });
  });

  // Error handling
  app.use((req: Request, res: Response, next: Function) => {
    const err: any = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  app.use((err, _req, res: Response, _next) => {
    res.status(err.status || 500);
    console.log(err.stack);
    res.json({
      errors: {
        message: err.message,
        error: +process.env.PRODUCTION ? null : err,
      },
    });
  });

  app.listen(process.env.PORT, () => console.log(`server started at ${process.env.PORT} port`));
})();
