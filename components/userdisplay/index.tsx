import { useState, useContext } from 'react';
import {UserContext} from '@/lib/usercontext';

export default function UserDisplay() {
    const user = useContext(UserContext);
    const [imgerr, setImgerr] = useState(false);
    
    return (
     <div className="text-center">
        <div
            className="text-xl my-4"
            >
            {user?.isLoggedIn ? 'You are logged in!': 'You are not logged in!'}
        </div>
        {user?.isLoggedIn && (
            <div>
            {user?.photoURL && !imgerr &&
                 // eslint-disable-next-line @next/next/no-img-element
                 <img
                   src={user?.photoURL}
                   className="rounded-full m-auto"
                   width={250}
                   height={250}
                   onError={(e) => {setImgerr(true)}}
                   alt=""
                 />
            }
            {user?.displayName &&
                <div>{user?.displayName}</div>
            }
            {user?.email &&
                <div>{user?.email}</div>
            }
            </div>
        )}
     </div>
    );
} 
