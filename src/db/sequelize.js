import { Sequelize } from "sequelize";
import sqlite3 from "sqlite3";
import fs from "fs";

let fliename = "D:\\db";
if (!fs.existsSync(fliename)) {
  fs.mkdirSync(fliename);
  console.log("创建文件夹" + fliename);
}
const sequelize = new Sequelize("database", null, null, {
  dialect: "sqlite",
  storage: "D:\\db\\scennicSpot.db",
  define: {
    timestamps: false,
    freezeTableName: true,
    // operatorsAliases: false
  },
  dialectModule: sqlite3,
  // logging: console.log
});

sequelize
  .authenticate()
  .then(function() {
    console.log("Connection has been established successfully.");
  })
  .catch(function(err) {
    console.log("Unable to connect to the database:", err);
  });

export default sequelize;
