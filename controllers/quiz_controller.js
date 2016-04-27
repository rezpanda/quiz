exports.question=function(req,res,next){
	res.render('quizes/question', {question: 'Capital de Italia'});
};
exports.check=function(req,res,next){
	var result= req.query.answer === 'Roma' ? 'YEA' : 'NO';
	res.render('quizes/result', {result: result});
};
