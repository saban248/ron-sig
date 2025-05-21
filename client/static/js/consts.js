
const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
const idRegex = /^\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RouteApi = {
    auth: "/auth",
    addClient: "/add_client"

}



const NewClientSteps = {
    step1: {title:"שם מלא", code:1},
    step2: {title:"מספר פאלפון", code:2},
    step3: {title:"תעודת זהות", code:3},
    step4: {title:"כתובת", code:4},
    step5: {title:"כתובת חשבון מייל", code:5},
    step6: {code:6}
}