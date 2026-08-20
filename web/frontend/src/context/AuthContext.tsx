import {createContext,useState} from 'react';
import {apiFetch,getToken,setToken,removeToken} from '../api';

type AuthContextType={
    token:string|null;
    login:(email:string,password:string)=>Promise<void>;
    logout:()=>void;
}

export const AuthContext=createContext<AuthContextType|null>(null);

export function AuthProvider({children}:{children:React.ReactNode}){

    const [token,setAuthToken]=useState<string|null>(getToken());

    async function login(email:string,password:string){

        const response=await apiFetch('/auth/login',{
            method:'POST',
            body:JSON.stringify({
                email,password
                }),
        });

        if(!response.ok){
            throw new Error('Login failed');
        }
    
        const data=await response.json();

        setToken(data.access_token);
        setAuthToken(data.access_token);
    };


    function logout(){
        removeToken();
        setAuthToken(null);
    }

    return(
        <AuthContext.Provider value={{token,login,logout}}>
            {children}
        </AuthContext.Provider>
    )

   

}

