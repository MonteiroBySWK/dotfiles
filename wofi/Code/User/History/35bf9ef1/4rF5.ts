import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { ConfigModule } from '@nestjs/config';
import { config } from 'dotenv';

config();

let cachedServer: any;

async function bootstrapServer() {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);
    await app.init();
    cachedServer = app.getHttpAdapter().getInstance();
  }
  return cachedServer;
}

// Exporta o handler para a Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const server = await bootstrapServer();
  server(req, res);
}

if (process.env.PROFILE === 'development') {
  bootstrapServer()
    .then(async (server) => {
      const PORT = process.env.PORT;
      server.listen(PORT, () => console.log(`Rodando na porta  ${PORT}`));
    })
    .catch();
}
