import {useContext,useState} from 'react';
import {AuthContext} from '../context/AuthContext';


function LoginForm(){

    const auth=useContext(AuthContext);

    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');

    async function submitForm(event:React.FormEvent<HTMLFormElement>){
        event.preventDefault();

        if(!auth){
            return;
        }

        try{
            await auth.login(email,password);
            console.log('login successful');

        }catch(error){

            console.error('Login failed',error);

        }
    }

return(<>

<form className="flex flex-col w-1/2" onSubmit={submitForm}>
        <input type="text" name="email" placeholder="email" className="mb-5 mt-5" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <input type="password" name="password" placeholder="password" className="mb-5" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <div>
            <button className="" type="submit">Login</button>
        </div>
    </form>
  
    </>);
};


export default LoginForm;