var models = require('../models');
var Sequelize = require('sequelize');

//Autoload el quiz asociado a :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId).then(function(quiz) {
		if(quiz) {
			req.quiz = quiz;
			next();
		} else {
			next(new Error('No existe quizId= ' + quizId));
		}
	}).catch(function(error) {
		next(error);
	});
};

// GET /quizzes
exports.index = function(req, res, next) {
	models.Quiz.findAll({where: {question: {$like: "%" + req.query.search + "%"}}}).then(function(quizzes) {
		if(req.params.format === 'json') {
			var texto_div = JSON.stringify(quizzes).split(',');
			var texto = '';
			for(var i in texto_div) {
				if(texto_div[i].match(/^{/)) {
					texto += '<br>';
				}
				texto += texto_div[i] + '<br>';
			}
			res.send(texto);
		} else {
			res.render('quizzes/index.ejs', {quizzes: quizzes});
		}
	}).catch(function(error) {
		next(error);
	});
};


// GET /quizzes/:id
exports.show = function(req, res, next) {
	models.Quiz.findById(req.params.quizId).then(function(quiz) {
		if (quiz) {
			if(req.params.format === 'json') {
				var texto_div = JSON.stringify(quiz).split(',');
				var texto = '';
				for(var i in texto_div) {
					texto += texto_div[i] + '<br>';
				}
				res.send(texto);
			} else {
				var answer = req.query.answer || '';
				res.render('quizzes/show', {quiz: req.quiz, answer: answer});
			}
		} else {
			throw new Error('No existe ese quiz en la BDD.');
		}
	}).catch();
};

// GET /quizzes/:id/check
exports.check = function(req, res, next) {
	models.Quiz.findById(req.params.quizId).then(function(quiz) {	// Busca la primera pregunta existente
		if (quiz) {
			var answer = req.query.answer || "";
			var result = (answer === req.quiz.answer) ? 'Correcta' : 'Incorrecta';
			res.render('quizzes/result', { quiz: req.quiz, result: result, answer: answer });
	    } else {
	    	throw new Error('No hay preguntas en la BBDD.');
	    }
	}).catch(function(error) {
		next(error);
	});
};

// GET /quizzes/new
exports.new = function(req, res, next) {
	var quiz = models.Quiz.build({question: '', answer: ''});
	res.render('quizzes/new', {quiz: quiz});
};


// POST /quiezzes/create
exports.create = function(req, res, next) {
	var quiz = models.Quiz.build({question: req.body.quiz.question, answer: req.body.quiz.answer});

	// Guarda en DB los campos pregunta y respuesta de quiz
	quiz.save({fields: ['question', 'answer']}).then(function(quiz) {
		req.flash('success', 'Quiz creado con éxito');
		res.redirect('/quizzes?search=');	// res.redirect:
	}).catch(Sequelize.ValidationError, function(error) {
      req.flash('error', 'Errores en el formulario:');
      for (var i in error.errors) {
          req.flash('error', error.errors[i].value);
      };
      res.render('quizzes/new', {quiz: quiz});
    }).catch(function(error) {
    	req.flash('error', 'Error al crear un Quiz: '+error.message);
		next(error);
	});
};
// GET /quizzes/:id/edit
exports.edit = function(req, res, next) {
  var quiz = req.quiz;  // req.quiz: autoload de instancia de quiz

  res.render('quizzes/edit', {quiz: quiz});
};


// GET /quizzes/:id/edit
exports.edit = function(req, res, next) {
	var quiz = req.quiz;
	res.render('quizzes/edit', {quiz: quiz});
};

// PUT /quizzes/:id
exports.update = function(req, res, next) {
	req.quiz.question = req.body.quiz.question;
	req.quiz.answer = req.body.quiz.answer;
	req.quiz.save({fields: ['question', 'answer']}).then(function(quiz) {
		req.flash('success', 'Quiz editado con éxito');
		res.redirect('/quizzes?search=');
	}).catch(Sequelize.ValidationError, function(error) {
		req.flash('error', 'Errores en el formulario:');

		for(var i in error.errors) {
			req.flash('error', error.errors[i].value);
		};
		res.render('quizzes/edit', {quiz: req.quiz});
	}).catch(function(error) {
		req.flash('error', 'Error al editar el Quiz: ' + error.message);
		next(error);
	});
};
