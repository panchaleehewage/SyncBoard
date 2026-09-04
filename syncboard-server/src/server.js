import app from './app.js';
import { config } from './config.js';
import { connectDB } from './db/connect.js';

await connectDB();

app.listen(config.port, () => {
  console.log(`Syncboard Server running in ${config.env} mode on port ${config.port}...`);
});