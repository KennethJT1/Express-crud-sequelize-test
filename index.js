const app = require('./src/app');
const sequelize = require('./src/config/database');

sequelize
  .sync()
  .then(() => console.log('Database connected...'.blue.bold))
  .catch(() => console.log('Db diconnected'.red.charAt));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is listening on http://localhost:${port}`.yellow.bold));
