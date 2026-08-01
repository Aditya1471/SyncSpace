import React, {
  useEffect,
  useState
} from "react";


import {
  FaRegFileCode,
  FaSearch,
  FaCodeBranch,
  FaPlay,
  FaPuzzlePiece,
  FaCog,
  FaBolt,
  FaBell,
  FaCircle
} from "react-icons/fa";


import ActivityButton from "./ActivityButton";


import {
  getGitStatus,
  getNotifications
} from "../../services/activityService";





export default function ActivityBar({
  setActivePanel
}) {



  const [active,setActive] =
    useState("explorer");



  const [gitCount,setGitCount] =
    useState(0);



  const [notificationCount,setNotificationCount] =
    useState(0);





  useEffect(()=>{


    loadActivity();


  },[]);







  const loadActivity = async()=>{


    try{


      const git =
      await getGitStatus();



      const notification =
      await getNotifications();



      setGitCount(
        git?.changedFiles || 0
      );



      setNotificationCount(
        notification?.count || 0
      );



    }


    catch(error){


      console.log(
        error.message
      );


    }


  };









  const handleClick=(id)=>{


    setActive(id);


    if(setActivePanel){

      setActivePanel(id);

    }


  };









  const activities=[


    {
      id:"explorer",
      icon:<FaRegFileCode/>,
      title:"Explorer"
    },


    {
      id:"search",
      icon:<FaSearch/>,
      title:"Search"
    },


    {
      id:"git",
      icon:<FaCodeBranch/>,
      title:"Source Control",
      badge:gitCount
    },


    {
      id:"run",
      icon:<FaPlay/>,
      title:"Run & Debug"
    },


    {
      id:"extensions",
      icon:<FaPuzzlePiece/>,
      title:"Extensions"
    }


  ];









return (


<aside className="activity-bar">





{/* LOGO */}


<div className="activity-logo">


    <div className="logo-box">

        <FaBolt/>

    </div>



    <span className="logo-tooltip">

        SyncSpace IDE

    </span>



    <FaCircle className="online-dot"/>


</div>









{/* MAIN ACTIONS */}


<div className="activity-top">


{

activities.map((item)=>(


<div
key={item.id}
className="activity-item"
>


<ActivityButton

icon={item.icon}

title={item.title}

active={
active===item.id
}

onClick={()=>
handleClick(item.id)
}

/>



{

item.badge > 0 && (

<span className="activity-badge">

{item.badge}

</span>

)

}



</div>


))


}



</div>









{/* BOTTOM ACTIONS */}


<div className="activity-bottom">



<div className="activity-item">


<ActivityButton

icon={<FaBell/>}

title="Notifications"

active={
active==="notifications"
}

onClick={()=>
handleClick(
"notifications"
)
}

/>



{

notificationCount>0 && (

<span className="activity-badge">

{notificationCount}

</span>

)

}



</div>







<div className="activity-item">


<ActivityButton

icon={<FaCog/>}

title="Settings"

active={
active==="settings"
}

onClick={()=>
handleClick(
"settings"
)
}

/>


</div>





</div>





</aside>


);


}