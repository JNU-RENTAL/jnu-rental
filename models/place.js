const Sequelize = require("sequelize");
class Place extends Sequelize.Model {
  static initiate(sequelize) {
    Place.init(
      {
        name: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        modelName: "Place",
        tableName: "places",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Place.hasOne(db.Reservation, {
      foreignKey: "place",
      sourceKey: "id",
    });
    db.Place.hasMany(db.Recruitment, {
      foreignKey: "place",
      sourceKey: "id",
    });
  }
}
module.exports = Place;
