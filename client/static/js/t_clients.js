


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
    return
    const client = ManagerCache.newClientExist()
    if (client){
        document.getElementById("cname").value = client.name;
        document.getElementById("cphone").value = client.phone;
        document.getElementById("cid").value = client.cid;
        document.getElementById("caddress").value = client.address;
        document.getElementById("cemail").value = client.email;
        const checkAll = () =>{
            for (const [key, value] of Object.entries(NewClientSteps)){
                value.code != 6?completeStep(value.code):null
            }
        }
        setTimeout(checkAll, 500)
    }
    else{
        ManagerCache.newClient()
    }
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
        ManagerCache.addStepRent()
        icon.classList.add("done");
        icon.classList.add("fa-square-check")
        icon.classList.remove("fa-square"); 
    }else{
        icon.classList.remove("done");
        icon.classList.remove("fa-square-check")
        icon.classList.add("fa-square"); 
    }
}




function ShowClientDetails(){

}