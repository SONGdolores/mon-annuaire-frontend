import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// async function bootstrap() {
//   const app = await NestFactory.create<NestExpressApplication>(AppModule);

//   // Servir les fichiers statiques depuis le dossier "uploads"
//   app.useStaticAssets(join(process.cwd(), 'uploads'), {
//     prefix: '/uploads/',
//   });

//   await app.listen(3000);
// }

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
