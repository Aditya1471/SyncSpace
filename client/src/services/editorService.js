import api from "../api/axios";



export const getFileContent = async(id)=>{


const res =
await api.get(
`/editor/${id}`
);


return res.data;


};



export const saveFile = async(data)=>{


const res =
await api.put(
"/editor/save",
data
);


return res.data;


};