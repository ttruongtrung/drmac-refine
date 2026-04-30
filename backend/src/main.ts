import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication
  const frontendUrls = (process.env.FRONTEND_URL || 'http://localhost:3000')
    .split(',')
    .map((url) => url.trim());
  frontendUrls.push('https://drmac-refine.vercel.app');
  app.enableCors({
    origin: frontendUrls,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });
  console.log('CORS allowed origins:', frontendUrls);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Backend is running on http://localhost:${port}`);
}
bootstrap();
