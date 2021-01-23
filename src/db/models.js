import { DataTypes } from "sequelize";
import sequelize from "./sequelize";

const appendage = sequelize.define("appendage", {
  rotationX: DataTypes.DECIMAL(15, 6),
  rotationY: DataTypes.DECIMAL(15, 6),
  rotationZ: DataTypes.DECIMAL(15, 6),
  x: DataTypes.DECIMAL(15, 6),
  y: DataTypes.DECIMAL(15, 6),
  z: DataTypes.DECIMAL(15, 6),
});


(async () => {
  // 如果表不存在，则会创建表（如果已经存在，则不执行任何操作）
  await sequelize.sync();
})();

const models = {

  appendage
};

export default models;
