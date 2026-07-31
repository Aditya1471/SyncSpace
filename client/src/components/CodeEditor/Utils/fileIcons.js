import {

FaReact,
FaJs,
FaJava,
FaPython,
FaHtml5,
FaCss3Alt,
FaMarkdown,

} from "react-icons/fa";

import {

SiTypescript,
SiJson,

} from "react-icons/si";

import {

FaFolder,
FaFolderOpen,
FaFile,

} from "react-icons/fa";

export function getFileIcon(name){

const extension =

name.split(".").pop();

switch(extension){

case "js":

return FaJs;

case "jsx":

return FaReact;

case "ts":

case "tsx":

return SiTypescript;

case "java":

return FaJava;

case "py":

return FaPython;

case "html":

return FaHtml5;

case "css":

return FaCss3Alt;

case "json":

return SiJson;

case "md":

return FaMarkdown;

default:

return FaFile;

}

}

export {

FaFolder,

FaFolderOpen,

};