import React, { useState } from "react";

import "./CodeEditor.css";


// Layout
import Layout from "./Layout/Layout";
import ActivityBar from "./ActivityBar/ActivityBar";
import SideBar from "./Layout/SideBar";
import EditorLayout from "./Layout/EditorLayout";
import BottomPanel from "./Layout/BottomPanel";
import StatusBar from "./Layout/StatusBar";


// Explorer
import Explorer from "./Explorer/Explorer";


// Editor
import MonacoEditor from "./Editor/MonacoEditor";
import EditorTabs from "./Editor/EditorTabs";
import WelcomeScreen from "./Editor/WelcomeScreen";


// Terminal
import Terminal from "./Terminal/Terminal";


// Output
import OutputConsole from "./Output/OutputConsole";


// Run
import RunButton from "./Run/RunButton";
import LanguageSelector from "./Run/LanguageSelector";


// Search
import SearchPanel from "./Search/SearchPanel";


// Git
import GitPanel from "./Git/GitPanel";


// Problems
import Problems from "./Problems/Problems";


// Settings
import Settings from "./Settings/Settings";


// Minimap
import Minimap from "./Minimap/Minimap";


// Breadcrumb
import Breadcrumb from "./Breadcrumb/Breadcrumb";


// Command Palette
import CommandPalette from "./CommandPalette/CommandPalette";



// Context
import { EditorProvider } from "./Context/EditorContext";
import { ThemeProvider } from "./Context/ThemeContext";



export default function CodeEditor({roomId}) {


const [activePanel,setActivePanel] =
useState("explorer");


const [showSettings,setShowSettings] =
useState(false);



return (


<ThemeProvider>


<EditorProvider>


<div className="syncspace-editor">



{/* Activity Bar */}

<ActivityBar

activePanel={activePanel}

setActivePanel={setActivePanel}

/>




{/* Main Layout */}

<Layout>



{/* LEFT SIDEBAR */}


<div className="editor-sidebar">


{
activePanel==="explorer" &&
<Explorer/>

}



{
activePanel==="search" &&
<SearchPanel/>

}



{
activePanel==="git" &&
<GitPanel/>

}



{
activePanel==="problems" &&
<Problems/>

}



</div>







{/* CENTER EDITOR */}


<div className="editor-main">



<Breadcrumb/>



<EditorTabs/>




<EditorLayout>



<MonacoEditor

roomId={roomId}

/>



<Minimap/>




</EditorLayout>



</div>








{/* RIGHT SETTINGS */}



{
showSettings &&
<Settings/>

}




{/* BOTTOM PANEL */}


<BottomPanel>



<Terminal

roomId={roomId}

/>



<OutputConsole/>



</BottomPanel>





</Layout>






{/* TOP ACTIONS */}


<div className="editor-actions">


<LanguageSelector/>


<RunButton

roomId={roomId}

/>



<button

onClick={()=>setShowSettings(!showSettings)}

>

⚙ Settings

</button>


</div>







{/* Command Palette */}

<CommandPalette/>





{/* STATUS */}

<StatusBar/>



</div>


</EditorProvider>


</ThemeProvider>


);

}