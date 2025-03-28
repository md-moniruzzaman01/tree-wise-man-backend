import cors from 'cors'
import express, { Application, NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import routes from './app/routes'

import cookieParser from 'cookie-parser'

const app: Application = express();

app.use(cors());
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));






app.get('/', (req, res) => {
  res.send('The Tree wise man')
})

app.use('/api/v1', routes)

//global error handler
app.use(globalErrorHandler)

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  })
  next()
})

export default app
