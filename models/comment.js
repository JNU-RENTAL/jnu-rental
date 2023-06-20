const Sequelize = require("sequelize");
class Comment extends Sequelize.Model {
  static initiate(sequelize) {
    Comment.init(
      {
        comment_text: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        paranoid: true,
        modelName: "Comment",
        tableName: "comments",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Comment.belongsTo(db.User, { foreignKey: "user_id", targetKey: "id" });
    db.Comment.belongsTo(db.Recruitment, {
      foreignKey: "recruitment_id",
      targetKey: "id",
    });
  }
}
module.exports = Comment;
