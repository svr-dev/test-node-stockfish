import { NestFactory } from '@nestjs/core';
import { AppModule } from "./app.module.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;
  
  await app.listen(PORT, () => console.log(`[SERVER] Server running on port ${PORT}`));
}
bootstrap().then(() => {
  console.log(`------------------------------------`)
})
