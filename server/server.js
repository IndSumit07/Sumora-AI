import "dotenv/config";
import app from "./src/app.js";
import connectToMongoDB from "./src/configs/mongodb.config.js";

connectToMongoDB();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
