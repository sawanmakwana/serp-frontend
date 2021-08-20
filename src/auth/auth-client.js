// import axios from "axios";

// async function authClient(endpoint, data) {
//   const config = {
//     method: data ? 'POST' : 'GET',
//     body: data ? JSON.stringify(data) : undefined,
//     headers: {'Content-Type': 'application/json'},
//   }

//   return axios.post(`${process.env.REACT_APP_PLATFORM_ENDPOINT}/login`, submitdata).then(async response => {
//     const responseData = await response.json()
//     if (response.ok) {
//       return responseData
//     }
//     return Promise.reject(responseData)
//   })
// }

// export {authClient}
