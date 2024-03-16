const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const Router = require('./Router');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(Router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
