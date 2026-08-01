import api from "../api/axios";



export const executeTerminal =
async(command)=>{


const res =
await api.post(
"/terminal",
{
command
}
);


return res.data;


};