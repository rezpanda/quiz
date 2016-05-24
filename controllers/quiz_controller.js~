var models= require('../models');

exports.question=function(req,res,next){
	models.Quiz.findOne().then(function(quiz){
		if(quiz){
			var answer= req.query.answer || '';
			res.render('quizes/question', {question: quiz.question, answer: answer});
		}
		else{
			throw new Error ('Theres no any question at the DDBB.');
		}
	}).catch(function(error) { next(error);});
};


exports.check=function(req,res,next){
	models.Quiz.findOne().then(function(quiz){
		if(quiz){
			var answer= req.query.answer || "";
			var result = answer === quiz.answer ? 'Correcta' : 'Incorrecta';
			res.render('quizes/result', { result:result, answer:answer});
		}
		else{
			throw new Error ('Theres no any question at the DDBB.');
		}
	}).catch(function(error) { next(error);});
};