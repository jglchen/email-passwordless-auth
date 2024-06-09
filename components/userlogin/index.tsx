import { useState, useContext, useEffect, useRef, FormEvent } from 'react';
import validator from 'email-validator';
import { auth } from '@/lib/firebaseConfig';
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import {UserDispatchContext} from '@/lib/usercontext';

function UserLogIn(){
    const dispatch = useContext(UserDispatchContext);
    const [emailSignIn, setEmailSignIn] = useState('');
    const [emailerr, setEmailErr] = useState('');
    const emailEl = useRef(null);
    const [pending, setPending] = useState(false);

    useEffect(() => {
      if (isSignInWithEmailLink(auth, window.location.href)){
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
            email = window.prompt('Please provide your email for confirmation');
            if (email){
                window.localStorage.setItem('emailForSignIn', email);
            }
        }
        if (!email) {
            return;
        }

        signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
            window.localStorage.removeItem('emailForSignIn');           
            const user = result.user;
            const authUser = {
              isLoggedIn: true,
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL
            }
            window.localStorage.setItem('authuser', JSON.stringify(authUser));
            dispatch({
              type: 'changed',
              userSet: authUser
            })
            window.location.href = window.location.href.replace(window.location.search,'');
        })
        .catch((error) => {
            setEmailErr('Error: ' + error.message);
        });
      }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }); 
  

    function handleChange(e: FormEvent<HTMLInputElement>){
      let { value } = e.currentTarget;
      //Remove all the markups to prevent Cross-site Scripting attacks
      value = value.replace(/<\/?[^>]*>/g, "");
      setEmailSignIn(value);
      setEmailErr('');
    }
  
    function resetErrMsg(){
      setEmailSignIn('');
      setEmailErr('');
    }

    function resetForm(){
      setEmailSignIn('');
      setEmailErr('');    
    }

    const submitForm = async (e: any) => {
      e.preventDefault();

      //Reset all the err messages
      setEmailErr('');
      //Check if Email is filled
      if (!emailSignIn){
        setEmailErr("Please type your email, this field is required!");
        (emailEl.current as any).focus();
        return;
      }
      //Validate the email
      if (!validator.validate(emailSignIn)){
        setEmailErr("This email is not a legal email.");
        (emailEl.current as any).focus();
        return;
      }

      setPending(true);
      try {
        const actionCodeSettings = {
            url: window.location.href,
            handleCodeInApp: true
        }
        await sendSignInLinkToEmail(auth, emailSignIn, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', emailSignIn);
        const successRemark = 'Please go to your mail box, click the sign in link in the email sent to you.';
        setEmailErr(successRemark);
      }catch(error: any){
        setEmailErr('Error: ' + error.message);
      }
      setPending(false);
    }

    return (
        <div>
          <form
            onSubmit={submitForm}
            >
            <div className="py-0 px-1 bg-[#ffffe8] text-red-600">{emailerr}</div>
            <input className="block border border-solid border-[#cdcdcd] rounded-[4px] p-2 outline-none bg-transparent mb-2 text-base w-full max-w-full hover:border-[#b4b4b4] focus:border-[#0366EE] active:border-[#0366EE]"
                type="text"
                name="email"
                id="email"
                value={emailSignIn}
                placeholder="Email"
                ref={emailEl}
                onChange={handleChange}
                required
                />
            <div>
              <button 
                disabled={pending}
                className="inline-block border border-solid border-[#0366EE] rounded-[4px] bg-[#0366EE] text-white font-semibold font-sans text-base leading-4 normal-case py-3 px-5 mt-0 mr-4 mb-2 ml-0 align-middle text-center cursor-pointer hover:border-[#0250bc] hover:bg-[#0250bc] focus:border-[#0250bc] focus:bg-[#0250bc] active:border-[#0250bc] active:bg-[#0250bc]"
                >{pending ? "Logging In ...": "Log In"}</button>
              <input 
                type="reset" 
                className="inline-block border border-solid border-[#0366EE] rounded-[4px] bg-[#0366EE] text-white font-semibold font-sans text-base leading-4 normal-case py-3 px-5 mt-0 mr-4 mb-2 ml-0 align-middle text-center cursor-pointer hover:border-[#0250bc] hover:bg-[#0250bc] focus:border-[#0250bc] focus:bg-[#0250bc] active:border-[#0250bc] active:bg-[#0250bc]"
                value="Reset" 
                onClick={resetForm}
                />
            </div>
          </form>
        </div>
    );    
    

}



export default UserLogIn;
