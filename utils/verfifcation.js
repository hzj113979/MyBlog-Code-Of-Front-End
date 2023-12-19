 export function CkEmail(data) {
     let reg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/
     return !reg.test(data)?true:false


 }
 export function CkPass(data) {
     let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,15}$/
     return !reg.test(data)?true:false

 }