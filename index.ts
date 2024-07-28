import { createServer } from "http";
import app from "./src/frameworks/configs/app";
import connectDB from "./src/frameworks/configs/db";

// Connect to Database
connectDB();

// Create HTTP server and attach Express app to it
const server = createServer(app);

// Start server
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
