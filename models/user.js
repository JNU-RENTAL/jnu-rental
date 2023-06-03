const Sequelize = require("sequelize");
class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init(
      {
        username: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        jnu_mail: {
          type: Sequelize.STRING(50),
          allowNull: false,
          unique: true,
        },
        is_certified: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        is_admin: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        verification_code: {
          type: Sequelize.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        paranoid: true,
        modelName: "User",
        tableName: "users",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Reservation, { foreignKey: "user_id", sourceKey: "id" });
    db.User.hasMany(db.Recruitment, { foreignKey: "user_id", sourceKey: "id" });
    db.User.hasMany(db.Comment, { foreignKey: "user_id", sourceKey: "id" });
  }
}
module.exports = User;
