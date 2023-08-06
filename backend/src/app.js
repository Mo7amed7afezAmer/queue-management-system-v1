const express = require("express");
const helmet = require("helmet");
const cors= require("cors");
const cookieParser = require('cookie-parser'); 

const app = express();
const port = 3131;

// Import middleware
const createCookies = require("./middleware/createCookies")

// Import Router
const authRouter = require("./route/authRouter");
const doctorRouter = require("./route/doctorRouter");
const clinicRouter = require("./route/clinicRouter");
const patientRouter = require("./route/patientRouter");

app.use(helmet({ 
  crossOriginResourcePolicy: { policy: "same-site" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));

app.use(cors());
app.use(cookieParser());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// routes
app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

// routes => [ auth - doctor - clinic ]
app.use("/auth", [ authRouter, createCookies ]);
app.use("/doctor", doctorRouter);
app.use("/clinic", clinicRouter);
app.use("/patient", patientRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });

  return;
});

// run server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});