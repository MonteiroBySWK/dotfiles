import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { config } from 'dotenv';

config();

let cachedServer: any;

async function bootstrapServer() {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);
    if (process.env.VERCEL_ENV !== 'production') {
      const port = process.env.PORT || 3001; // Usa a porta do .env ou 3001
      await app.listen(port);
      console.log(`Application is running on: http://localhost:${port}`);
    } else {
      // Se estiver na Vercel, apenas inicialize o app
      await app.init();
    }
    cachedServer = app.getHttpAdapter().getInstance();
  }
  return cachedServer;
}

// Exporta o handler para a Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const server = await bootstrapServer();
  server(req, res);
}

if (process.env.VERCEL_ENV !== 'production') {
  bootstrapServer();
}