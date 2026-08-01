import api from "../api/axios";


export const executeCode = async(data)=>{


const res =
await api.post(
"/run",
data
);


return res.data;


};