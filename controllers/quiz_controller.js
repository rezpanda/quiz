var models= require('../models');


//get quizzes

exports.index=function(req, res, next){
	models.Quiz.findAll().then(function(quizzes){
		res.render('quizes/index.ejs', {quizzes:quizzes});
	}).catch(function(error) { next(error);});
}


exports.show=function(req,res,next){
	models.Quiz.findById(req.params.quizId).then(function(quiz){
		if(quiz){
			var answer= req.query.answer || '';
			res.render('quizes/show', {quiz: quiz, answer: answer});
		}
		else{
			throw new Error ('Theres no any question at the DDBB.');
		}
	}).catch(function(error) { next(error);});
};


exports.check=function(req,res,next){
	models.Quiz.findById(req.params.quizId).then(function(quiz){
		if(quiz){
			var answer= req.query.answer || "";
			var result = answer === quiz.answer ? 'Correcta' : 'Incorrecta';
			res.render('quizes/result', {quiz:quiz, result:result, answer:answer});
		}
		else{
			throw new Error ('No existe ese quiz en la BBDD.');
		}
	}).catch(function(error) { next(error);});
};
