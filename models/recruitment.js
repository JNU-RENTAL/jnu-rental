const Sequelize = require("sequelize");
class Recruitment extends Sequelize.Model {
  static initiate(sequelize) {
    Recruitment.init(
      {
        title: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        text: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        paranoid: true,
        modelName: "Recruitment",
        tableName: "recruitments",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Recruitment.belongsTo(db.User, {
      foreignKey: "user_id",
      targetKey: "id",
    });
    db.Recruitment.belongsTo(db.Place, {
      foreignKey: "place",
      targetKey: "id",
    });
    db.Recruitment.hasMany(db.Comment, {
      foreignKey: "recruitment_id",
      sourceKey: "id",
    });
  }
}
module.exports = Recruitment;
