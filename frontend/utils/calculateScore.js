export const calculateScore = (questions , answers)=> {
    let total = 0;
    questions.forEach((q,index)=>{
        if(answers[index] === q.correct_option){
            total += q.marks;
        }
    });
    return total;
}