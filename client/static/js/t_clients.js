
function getAllClients(){
    var clients = ManagerCache.getListClients();

    if (clients)return clients;

    on_success = (res) =>{
        if (!res.success){
            popup(1, res.title, res.notice);
        }

        const clients = res.clients;
        ManagerCache.setListClients(clients)

    }

    do_api(RouteApi.ListClients,{}, on_success);

}

function startRentEquipment(){
    const sidebar = document.getElementById('newrent');
    if (sidebar.classList.contains("show"))return
    sidebar.classList.add('show');
    NewRentShowNextStep(NewRentSteps.step1.code-1);
    // cache
    const rent = ManagerCache.newRentExist()
    if (rent){
        document.getElementById("raddress").value = rent.address;
        const checkAll = () =>{
            for (const [key, value] of Object.entries(NewRentSteps)){
                value.code != NewRentSteps.done.code?NewRentCompleteStep(value.code):null
            }
        }
        setTimeout(checkAll, 500)
    }
    else{
        ManagerCache.newRent()
    }

    flatpickr("#rstarttime", {
      enableTime: true,
      dateFormat: "Y.m.d H:i",
      time_24hr: true
    });
    flatpickr("#rendtime", {
      enableTime: true,
      dateFormat: "Y.m.d H:i",
      time_24hr: true
    });
}

function NewRentShowNextStep(index){
    document.getElementById("nrstep"+index)?.classList.remove("show");
    document.getElementById("nritem"+(index+1))?.classList.add("show");
    document.getElementById("nrstep"+(index+1))?.classList.add("show");
        if ((index+1) == NewRentShowNextStep){
        finishNewClient()
        return
    }
}

function toggleSidebarItem(index){
    document.getElementById("nrstep"+index).classList.toggle("show");
}


function cancelNewRent(){
    const sidebar = document.getElementById("newrent");
    sidebar.classList.remove("show")
    for (const [key, value] of Object.entries(NewRentSteps)){
        document.getElementById("nrstep"+value.code)?.classList.remove("show");
        document.getElementById("nritem"+value.code)?.classList.remove("show");
    }
    
}

function NewRentCompleteStep(step){
    const icon = document.getElementById("nriconstep"+step);
    var valid= true;
    key= null;
    v= null
    if (NewRentSteps.step1.code == step){
        key = "address"
        v = document.getElementById("r"+key).value;
        valid = v.length>5
    }
    if (valid){
        ManagerCache.addStepRent(key, v)
        icon.classList.add("done");
        icon.classList.add("fa-square-check")
        icon.classList.remove("fa-square"); 
    }else{
        icon.classList.remove("done");
        icon.classList.remove("fa-square-check")
        icon.classList.add("fa-square"); 
    }
}


function toggleClienMenu(event, title, client_id){
    toggleGeneralMenu(event, title);
    CLIENT_INFO_INDEX = parseInt(client_id)-1
    
}


async function showClientDetails(){
    let clients = ManagerCache.getListClients()
    if (!clients){popup(1, ErrorCode.cache.msg, ErrorCode.cache.code)}

    const client = clients[CLIENT_INFO_INDEX]
    const sidebar = document.getElementById('clientinfo');
    const title = document.getElementById("clientinfoname")
    const fullname = document.getElementById('ci-fullname')
    const phone = document.getElementById('ci-phone')
    const identify = document.getElementById('ci-identify')
    const address = document.getElementById('ci-address')
    const email = document.getElementById('ci-email')
    title.textContent = client.fullname.split(" ")[0];
    fullname.textContent = client.fullname
    phone.textContent = client.phone;
    identify.textContent = client.identify;
    address.textContent = !client.address?"Unknwon":client.address;
    email.textContent = !client.email?"Unknwon":client.email;

    if (sidebar.classList.contains("show"))return
    sidebar.classList.add('show');
}


function closeClientDetails(){
    const sidebar = document.getElementById("clientinfo");
    sidebar.classList.remove("show")
}




/* GLOBAL */

getAllClients()