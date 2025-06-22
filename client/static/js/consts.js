
const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
const idRegex = /^\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RouteApi = {
    auth: "/auth",
    addClient: "/add_client",
    ListClients:"/list_clients",
    deleteClient:"/delete_client",
    addEquip:"/add_equip",
    deleteEquip:'/delete_equip',
    getEquip:'/get_equip',
    addRent:'/add_rent'

}



const NewClientSteps = {
    step1: {title:"שם מלא", code:1},
    step2: {title:"מספר פאלפון", code:2},
    step3: {title:"תעודת זהות", code:3},
    step4: {title:"כתובת", code:4},
    step5: {title:"כתובת חשבון מייל", code:5},
    step6: {code:6}
}

const NewRentSteps = {
    step1: {title:"כתובת האירוע", code:1},
    step2: {title:"זמן ההשכרה", code:2},
    step3:{title:'סוף השכרה', code:3},
    step4:{title:"ציוד", code:4},
    step5:{title:"סכום העסקה", code:5},
    done:{code:0}
}

const ErrorCode = {
    cache:{code:1, msg:"LocalStorage no avalible"}
}



const NewEquipmentStep = {
    step1:{title:"",code:1},
    step2:{title:"",code:2},
    step3:{title:"",code:3},
    step4:{title:"",code:4},
    step5:{title:"",code:5},
    step6:{title:"",code:6},
    done:{code:0}
}

