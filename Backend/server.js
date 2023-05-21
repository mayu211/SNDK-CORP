const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");

const dbConfig = require("./app/config/db.config");
const config = require("./app/config/auth.config");

const app = express();

app.use(cors({ origin: config.corsOrigin, credentials: true }));

// parse requests of content-type - application/json
app.use(express.json());
app.use(cookieParser());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "sndk-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true,
  })
);

const db = require("./app/models");
db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Successfully connected to MongoDB.");
  })
  .catch(() => {
    process.exit();
  });
app.use("/public", express.static("public"));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Tech application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${config.port}.`);
});
