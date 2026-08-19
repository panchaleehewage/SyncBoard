import app from './app.js';
import { config } from './config.js';

app.listen(config.port, () => {
  console.log(`Syncboard Server running in ${config.env} mode on port ${config.port}...`);
});