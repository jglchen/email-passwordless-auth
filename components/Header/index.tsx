import { useContext } from 'react';
import {UserContext, UserDispatchContext} from '@/lib/usercontext';

export default function Header() {
   const user = useContext(UserContext);
   const dispatch = useContext(UserDispatchContext);
   
   return (
      <div>
         {user?.isLoggedIn && 
            <div 
               className="block pt-5 pb-5 w-full bg-black/[0.1] rounded-br-md rounded-bl-md before:clear-none before:block after:clear-none after:block after:clear-both"
               >
               <div 
                  className="inline-block text-base leading-10 ml-4 align-middle"
                  >
                  Hi! <b>{user?.displayName || user?.email}</b>
               </div>   
            <button 
               className="float-right inline-block border border-solid border-[#0366EE] rounded-[4px] bg-[#0366EE] text-white font-semibold font-sans text-base leading-4 normal-case py-3 px-5 mt-0 mr-4 mb-2 ml-0 align-middle text-center cursor-pointer hover:border-[#0250bc] hover:bg-[#0250bc] focus:border-[#0250bc] focus:bg-[#0250bc] active:border-[#0250bc] active:bg-[#0250bc]"
               onClick={() => {
                  window.localStorage.removeItem('authuser');
                  dispatch({
                    type: 'changed',
                    userSet: null
                  });
               }}
               >Sign Out</button>
          </div>
         }
         <div className="text-center text-2xl mt-6 mb-6">
         Welcome to Firebase Email Passwordless Link Authentication!
         </div>
      </div>
   );
}

