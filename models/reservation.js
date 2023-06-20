const Sequelize = require("sequelize");
class Reservation extends Sequelize.Model {
  static initiate(sequelize) {
    Reservation.init(
      {
        begin_time: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        end_time: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        reservation_name: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        reservation_student_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        reservation_phone_number: {
          type: Sequelize.CHAR(11),
          allowNull: false,
        },
        is_confirmed: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        paranoid: true,
        modelName: "Reservation",
        tableName: "reservations",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Reservation.belongsTo(db.User, {
      foreignKey: "user_id",
      targetKey: "id",
    });
    db.Reservation.belongsTo(db.Place, {
      foreignKey: "place",
      targetKey: "id",
    });
  }
}
module.exports = Reservation;
