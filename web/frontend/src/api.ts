const API_URL=import.meta.env.VITE_API_URL||'http://localhost:3000';

const TOKEN_KEY='knowledgehub_token';

export function getToken():string|null{
    return localStorage.getItem('TOKEN_KEY');
}

export function setToken(token:string):void{
    localStorage.setItem(TOKEN_KEY,token);
}

export function removeToken():void{
    localStorage.removeItem(TOKEN_KEY);
}

export async function apiFetch(endpoint:string,options:RequestInit={}):Promise<Response>{
    const token=getToken();
    const headers=new Headers(options.headers);

    if(token){
        headers.set("AUthorization",`Bearer ${token}`);
    }

    if(!(options.body instanceof FormData)){
        headers.set("Content-Type","application/json");
    }

    return fetch(`${API_URL}${endpoint}`,{
        ...options,headers,
    })
}
