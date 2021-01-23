// 图层
import axios from 'axios'
axios.defaults.withCredentials = true;
// axios.defaults.timeout =  10000;
// import qs from 'qs';
import { Message } from "element-ui";

axios.interceptors.request.use(config=> {
  return config;
}, err=> {
  // console.log("axios1", err)
  Message.error({message: '请求超时!'});
  return Promise.resolve(err);
})
axios.interceptors.response.use(data=> {
  // console.log("axios2", data)
  if (data.status && data.status == 200 && data.data.status == 'error') {
    Message.error({message: data.data.msg});
    return;
  }
  return data;
}, err=> {
  //  console.log("axios3", err)
  if (err.response && (err.response.status == 504 || err.response.status == 404)) {
    Message.error({message: '服务器被吃了⊙﹏⊙∥'});
  } else if (err.response && (err.response.status == 500)) {
    Message.error({message: '网络连接失败!'});
  } else if (err.response && (err.response.status == 403)) {
    Message.error({message: '权限不足,请联系管理员!'});
  }else {
    if(err.response && err.response.data) {
      Message.error({message: err.response.data.error});
    } else {
      Message.error({message: '未知错误,连网试试!'});
    }

  }
  return Promise.resolve(err);
})


export function putUserdata(data, id) {
  const url = `/api/earth/earthconfig/?uuid=${id}`;
  return axios.post(url, data).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function project_setting_put(id, data) {
  // const url = `/api/project_setting/${id}/`;
  const url = `/api/earth/earth_setting/?uuid=${id}`;
  return axios.put(url, data).then((res) => {
    return Promise.resolve(res.data)
  })
}
export function getMapConfigLocal(data){
  const url = `http://city.okaygis.com:8989/city/xrs/rs?r=0333331&H=18&D=${JSON.stringify(data)}`;
	// const url = `/cesium/manager/api/menus/${param}/`;
	// const data = '';
	return axios.get(url, {
    // params: data,
    dataType: "json",
	}).then(res => {
    // console.log("data--", res.data)
		return Promise.resolve(res.data);
	});
}
export async function Rest_api_service(data){
  const url = `http://city.okaygis.com:8989/city/xrs/rs?H=60528`;
	return axios.post(url, data).then((res) => {
    return Promise.resolve(res.data)
  })
}
export async function SyncuploadFiles(data, token){
  const url = `http://172.16.20.148:3000/clouddisk/project/ProjectSplitFileMinioUpload`;
  return axios({
      method: "POST",
      url: url,
      data: data,
      headers: {
        token: token,
        port: 7451
      }
  })
	// return axios.post(url, data, {
  //   headers: {
  //     token: data.token
  //   },
  //   port: 7451
  // }).then((res) => {
  //   return Promise.resolve(res.data)
  // })
}
export async function getUserProjectList(token){
  const url = `http://city.okaygis.com:8989/city/xrs/rs?H=60391`;
	return axios.get(url, {
    headers: {
      "XP_TOKEN": token
    },
    dataType: "json"
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
export async function okayDiskLogin(data){
  const url = `http://172.16.20.148:3000/clouddisk/user/login`;
	return axios.post(url, data).then((res) => {
    return Promise.resolve(res.data)
  })
}