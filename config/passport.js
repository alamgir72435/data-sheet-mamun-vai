
const LocalStrategy=require('passport-local').Strategy;
let user = {id:1, name:"shadesh"}
const init=(passport)=>{
   passport.use(new LocalStrategy(
      async function (username,password,done) {
         if(username !== "shadesh"){
            return done(null,false,{message:'No user Found!'})
         }
         try {
            if(password == "#abc123#"){
               return done(null,user)
            }else{
               return done(null,false,{message:'Password Incorrect'})
            }
         } catch (error) {
            return done(error)
         }
      }
   ))

   passport.serializeUser((user,done)=>done(null,user.id));
   passport.deserializeUser((id,done)=>done(null,()=>{
      return [{id:1, name:"shadesh"}];
   }))
}

module.exports=init