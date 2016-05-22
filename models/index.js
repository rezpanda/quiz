var path = require('path');
var Sequelize = require('sequelize');

var url, storage;

if(!process.env.DATABASE_URL){
	url= "sqlite:///";
	storage = "quiz.sqlite";
} else {
	url = process.env.DATABASE_URL;
	storage= process.env.DATABASE_STORAGE || "";
}


//usen BBDD SQLITE
var sequelize = new Sequelize (url,{storage: storage, omitNull:true});

// Importar la definición de la table Quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// sequelize.sync() crea e inicia la tabla de preguntas en DB
sequelize.sync().then(function(){ 
	return Quiz.count().then(function(c){
		if(c===0){
			return Quiz.create({ question: "Captital de Italia", answer: "Roma"}).then(function(){
				console.log("Base de datos incializada con datos");
			});
		}
	});
}).catch(function(error){
	console.log("Error Sincronizando las tablas de las BBDD: ", error);
	process.exit(1);
});

exports.Quiz= Quiz; //exportar la definición de tabla quiz
