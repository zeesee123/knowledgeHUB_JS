import LoginForm from './components/LoginForm';
import {useContext} from 'react';
import {AuthContext} from './context/AuthContext';


function App(){

  const auth=useContext(AuthContext);

  if(!auth){
    return null;
  }
  return(<>
  <div className="container text-center mt-32 mx-auto">
  <h1 className="text-7xl">KnowledgeHub</h1>
  {/* <p className="mt-6">Login page coming next</p> */}
  </div>
  <div className="container mx-auto">
{auth.token?(<h2>Dashboard</h2>):( <LoginForm/>)}
   
  </div>
 
  </>)
}

export default App;