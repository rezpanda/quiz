var path = require('path');
//Cargar modelo ORM
var Sequelize = require('sequelize');
//Usar BBDD SQlite:
// DATABASE_URL= sqlite:///
// DATABASE_STORAGE = qquiz.sqlite
// USAR BBDD Postgres:
// DATABASE_URL = postgres://user:passwd@ohst:port/database
var url, storage
if(!process.env.DATABASE_URL){
		url = 'sqlite:///';
		storage = 'quiz.sqlite';
} else {
		url = process.env.DATABASE_URL;
		storage = process.env.DATABASE_STORAGE || "";
}

var sequelize = new Sequelize(url,{storage: storage,omitNull: true});

//Importar la definicion de la tabla quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

//Importar la definicion de la tabla Comments de comment.js
var Comment = sequelize.import(path.join(__dirname,'comment'));

//Importar la definicion de la tabla Users de user.js
var User = sequelize.import(path.join(__dirname,'user'));

//Importar la definicion de la tabla Attachment de attachment.js
var Attachment = sequelize.import(path.join(__dirname,'attachment'));


//Relaciones entre modelos
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// Relacion 1 a N entre User y Quiz
User.hasMany(Quiz, {foreignKey: 'AuthorId'});
Quiz.belongsTo(User, {as: 'Author', foreignKey: 'AuthorId'});

//Relacion 1 a 1 entre Quiz y Attachment
Attachment.belongsTo(Quiz);
Quiz.hasMany(Attachment);

User.hasMany(Comment, { foreignKey: 'AuthorId'});
Comment.belongsTo(User, {as: 'Author', foreignKey: 'AuthorId'});

exports.Quiz = Quiz; // exportar definición de tabla Quiz
exports.Comment = Comment; // exportar definicion de tabla Comments
exports.User = User; // exportar definicion de tabla Users
exports.Attachment = Attachment; //exportar definicion de tabla Attachments