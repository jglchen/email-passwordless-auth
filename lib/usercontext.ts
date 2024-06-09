import { createContext } from 'react';
import {User, UserAction} from "@/lib/types";


export const UserContext = createContext<User | null>(null);
export const UserDispatchContext = createContext<any>(null);
