export default((req,res,next,env) => {
    env.addGlobal('message' , req.session.message);
    env.addGlobal('error', req.session.error);
    next();
});