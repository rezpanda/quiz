exports.question=function(req,res,next){
	var answer= req.query.answer || '';
	res.render('quizes/question', {question: 'Capital de Italia', answer:answer});
};
exports.check=function(req,res,next){

	var answer= req.query.answer || "";

	var result= req.query.answer === 'Roma' ? 'YEA' : 'NO';
	res.render('quizes/result', {result: result, answer:answer});
};
