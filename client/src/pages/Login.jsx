import "../css/Login.css";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCode,
  FaGoogle,
  FaGithub,
  FaArrowRight,
  FaUsers,
  FaLaptopCode,
  FaPaintBrush,
  FaShieldAlt,
} from "react-icons/fa";



function Login() {


  const navigate = useNavigate();

  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);

    setTimeout(() => {
      setToastMsg("");
    }, 3000);
  };

  const [loading,setLoading] = useState(false);


  const [showPassword,setShowPassword] = useState(false);



  const [loginData,setLoginData] = useState({

    email:"",

    password:"",

    remember:false

  });




  const handleChange = (e)=>{


    const {
      name,
      value,
      type,
      checked
    } = e.target;



    setLoginData(prev=>({

      ...prev,

      [name]:
      type==="checkbox"
      ? checked
      : value

    }));

  };







  const handleSubmit = async(e)=>{


    e.preventDefault();



    if(
      !loginData.email ||
      !loginData.password
    ){

      alert(
        "Enter email and password"
      );

      return;

    }





    try{


      setLoading(true);



      const API_URL =
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000";





      const response =
      await axios.post(

        `${API_URL}/api/auth/login`,

        {

          email:
          loginData.email,


          password:
          loginData.password

        }

      );





      console.log(
        "LOGIN RESPONSE",
        response.data
      );





      /*
      Backend expected:

      {
        success:true,
        token:"",
        user:{}
      }

      */



      const token =
      response.data.token;



      const user =
      response.data.user;





      if(!token){

        throw new Error(
          "Token not received"
        );

      }





      if(loginData.remember){


        localStorage.setItem(
          "token",
          token
        );


        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        localStorage.setItem(
          "syncspace_user",
          user.username
        );


      }
      else{


        sessionStorage.setItem(
          "token",
          token
        );


        sessionStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        localStorage.setItem(
          "syncspace_user",
          user.username
        );


      }







      showToast(
        response.data.message ||
        "Logged in successfully"
      );



      navigate(
        "/dashboard"
      );





    }
    catch(error){


      console.log(
        error
      );


      alert(

        error.response?.data?.message
        ||
        "Invalid email or password"

      );


    }
    finally{


      setLoading(false);


    }


  };







return (

<div className="login-page">


<div className="login-bg"></div>



<div className="login-wrapper">



{/* LEFT */}

<div className="login-info">


<div className="brand">

<FaCode/>

<h2>
SyncSpace
</h2>

</div>




<h1>

Collaborate.
<br/>

Code.

<span>
Create.
</span>

</h1>




<p>

A modern workspace where teams can
collaborate, share ideas and build
amazing products together.

</p>





<div className="info-cards">


<div>

<FaUsers/>

<span>
Real Time Team Collaboration
</span>

</div>




<div>

<FaLaptopCode/>

<span>
Live Code Workspace
</span>

</div>





<div>

<FaPaintBrush/>

<span>
Interactive Whiteboard
</span>

</div>





<div>

<FaShieldAlt/>

<span>
Secure Workspace
</span>

</div>



</div>


</div>






{/* LOGIN */}

<div className="login-box">



<div className="login-header">


<h1>
Welcome Back
</h1>


<p>
Login to access your workspace
</p>


</div>





<form onSubmit={handleSubmit}>



<div className="field">


<FaEnvelope/>


<input

type="email"

name="email"

placeholder="Enter email address"

value={loginData.email}

onChange={handleChange}

required

/>


</div>






<div className="field">


<FaLock/>


<input


type={
showPassword
?
"text"
:
"password"
}


name="password"


placeholder="Enter password"


value={loginData.password}


onChange={handleChange}


required


/>



<span

className="password-eye"

onClick={()=>
setShowPassword(!showPassword)
}

>


{
showPassword
?
<FaEyeSlash/>
:
<FaEye/>
}


</span>


</div>







<div className="login-extra">


<label>


<input


type="checkbox"


name="remember"


checked={
loginData.remember
}


onChange={handleChange}


/>


Remember me


</label>





<Link to="/forgot-password">

Forgot Password?

</Link>



</div>








<button


type="submit"


className="login-submit"


disabled={loading}



>


{


loading

?

"Logging in..."

:

<>

Login

<FaArrowRight/>

</>


}



</button>





</form>








<div className="or">

<span>
OR
</span>

</div>






<div className="social-login">


<button type="button">

<FaGoogle/>

Google

</button>




<button type="button">

<FaGithub/>

GitHub

</button>



</div>







<p className="register">


Don't have an account?


<Link to="/signup">

Create Account

</Link>


</p>




</div>





</div>

{toastMsg && (
  <div className="toast">
    {toastMsg}
  </div>
)}
</div>

);

}


export default Login;