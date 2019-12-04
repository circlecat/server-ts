import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { config } from 'dotenv';
import { Request, Response } from 'express';
import { Routes } from './routes';

config();

(async () => {
  const app = express();
  app.use(bodyParser.json());

  await createConnection();
  console.log('PG connected');

  Routes.forEach(route => {
    (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
      const result = new (route.controller as any)()[route.action](req, res, next);
      if (result instanceof Promise) {
        result.then(result =>
          result !== null && result !== undefined ? res.json(result) : res.status(400).end('REQEST_PARAMS_ERROR'),
        );
      } else if (result !== null && result !== undefined) {
        res.json(result);
      }
    });
  });

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
