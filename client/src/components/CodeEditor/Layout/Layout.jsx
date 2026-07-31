import React from "react";
import "./Layout.css";

import ActivityBar from "./ActivityBar";
import SideBar from "./SideBar";
import EditorLayout from "./EditorLayout";
import BottomPanel from "./BottomPanel";
import StatusBar from "./StatusBar";


export default function Layout() {

  return (

    <div className="layout">


      {/* Left Activity Icons */}
      <ActivityBar />


      {/* File Explorer */}
      <SideBar />



      {/* Main Workspace */}
      <section className="workspace">


        {/* Editor Area */}
        <EditorLayout />


        {/* Terminal */}
        <BottomPanel />


      </section>



      {/* Bottom Status */}
      <StatusBar />


    </div>

  );

}