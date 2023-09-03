import Cookie from 'js-cookie';

const SetCookie = (cookiename, utente) => {
 
    let secure=true

    if(window.$produrl === "http://localhost:10000") {
       secure=false;
    }

Cookie.set(cookiename,utente, {
expires:360,
secure:secure,
sameSite:'strict',
push:'/'
})

}
export default SetCookie