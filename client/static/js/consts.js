
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
    getEquip:'/get_equip'

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
    step3:{code:3},
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



const equipmentList = [
    "Turbosound Floodlight",
    "Line array TLA-101",
    "Beta3 MU21BA",
    "Turbosound IQ-15",
    "Pioneer XDJ-XZ",
    "NEC P420x",
    "מקרן",
    "לייזר 2 ראשים",
    "מתנפח ילדים",
    "גנרטור תלת פאזי",
    "לייקרה זוהרת",
    "עמוד תאורה",
    "מסך הקרנה",
    "RCF ART-915A",
    "Protech 500A"
    // תוסיף עוד ככל שצריך
  ];