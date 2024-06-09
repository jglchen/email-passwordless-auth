"use client";

import { useReducer, useEffect } from 'react';
import UserLogIn from "@/components/userlogin";
import Header from '@/components/Header';
import UserDisplay from "@/components/userdisplay";
import {User, UserAction} from "@/lib/types";
import {UserContext, UserDispatchContext} from '@/lib/usercontext';

export default function Home() {
  const [user, dispatch] = useReducer(userReducer, null);
  
  useEffect(() => {
    function getAuthUser() {
      const authUserStr = window.localStorage.getItem('authuser'); 
      const authUser = authUserStr ? JSON.parse(authUserStr): null;
      dispatch({
        type: 'changed',
        userSet: authUser
      })
    }
    
    getAuthUser();
    window.setInterval(getAuthUser, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  function userReducer(user: User | null, action: UserAction){
    switch(action.type){
      case 'changed': {
        return action.userSet;
      }
      default: {
        throw Error('Unknown action: ' + action.type);
      }
    }
  }
  
  return (
    <div className="max-w-[800px] py-0 px-4 ml-auto mr-auto">
      <UserContext.Provider value={user}>
        <UserDispatchContext.Provider value={dispatch}>
          <Header />
          {!user?.isLoggedIn && 
          <UserLogIn />
          }
          <UserDisplay />
        </UserDispatchContext.Provider>
      </UserContext.Provider>
    </div>
  );    
}
