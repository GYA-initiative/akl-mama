(function(){
const SB="https://jedjixrybyxhanaqokre.supabase.co",KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZGppeHJ5Ynl4aGFuYXFva3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU3MDI4NTYsImV4cCI6MjExMTI3ODg1Nn0.cDuijI1dkCsTh5ycPHUPCugEI1_4xQxCko-uhGBEVJs";
const K="mama_sess";
function get(){try{return JSON.parse(localStorage.getItem(K)||"null")}catch(e){return null}}
function put(j){const s={at:j.access_token,rt:j.refresh_token,exp:Date.now()+((j.expires_in||3600)-60)*1000,email:(j.user&&j.user.email)||""};localStorage.setItem(K,JSON.stringify(s));return s}
async function call(path,body){const r=await fetch(SB+"/auth/v1/"+path,{method:"POST",headers:{apikey:KEY,"Content-Type":"application/json"},body:JSON.stringify(body)});const j=await r.json().catch(()=>({}));return{ok:r.ok,j}}
function msg(j){const m=(j.msg||j.error_description||j.message||"")+"";
 if(/invalid login/i.test(m))return"البريد أو كلمة المرور غير صحيحة";
 if(/already|registered/i.test(m))return"البريد ده مسجل قبل كده، سجّل دخول بدل إنشاء حساب";
 if(/password/i.test(m)&&/6|short|weak/i.test(m))return"كلمة المرور لازم تكون 6 حروف أو أكتر";
 if(/rate|too many|seconds/i.test(m))return"محاولات كتير، استنى شوية وجرّب تاني";
 if(/confirm/i.test(m))return"لازم تأكد البريد من الرسالة اللي وصلتلك الأول";
 return"حصلت مشكلة، جرّب تاني"}
window.MA={
 session:get,
 async token(){let s=get();if(!s)return null;if(Date.now()<s.exp)return s.at;
  const r=await call("token?grant_type=refresh_token",{refresh_token:s.rt});if(!r.ok){localStorage.removeItem(K);return null}return put(r.j).at},
 async login(email,pw){const r=await call("token?grant_type=password",{email,password:pw});if(!r.ok)throw new Error(msg(r.j));return put(r.j)},
 async signup(email,pw){const r=await call("signup",{email,password:pw});if(!r.ok)throw new Error(msg(r.j));
  if(r.j.access_token)return put(r.j);
  if(r.j.user&&r.j.user.identities&&r.j.user.identities.length===0)throw new Error(msg({msg:"already registered"}));
  throw new Error("لازم تأكد البريد من الرسالة اللي وصلتلك وبعدين سجّل دخول")},
 logout(){localStorage.removeItem(K)}
};
})();
