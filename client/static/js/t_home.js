

function startNewClient(){

    const sidebar = document.getElementById('newclient');
    sidebar.classList.add('show');
    NewClientShowNextStep(NewClientSteps.step1.code-1);
    // cache
    const client = ManagerCache.newClientExist()
    if (client){
        document.getElementById("cname").value = client.name;
        document.getElementById("cphone").value = client.phone;
        document.getElementById("cid").value = client.cid;
        document.getElementById("caddress").value = client.address;
        document.getElementById("cemail").value = client.email;
        const checkAll = () =>{
            for (const [key, value] of Object.entries(NewClientSteps)){
                value.code != 6?NewClientCompleteStep(value.code):null
            }
        }
        setTimeout(checkAll, 500)
    }
    else{
        ManagerCache.newClient()
    }


}
function finishNewClient(){
    document.getElementById("addclient").classList.add("show")
}
function addNewClient(){
    
    on_success = (data) =>{
        if (!data.success){
            loading(0)
        }
        else{
            ManagerCache.deleteNewClient()
            cancelNewClient();
        }

        loading(0)
        getAllClients(true)
        popup(1, data.title, data.notice);
    }
    const data = ManagerCache.newClientExist();
    if (!data){
        popup(1, "שגיאה", "בעיה בהוספת הלקוח")
    }

    do_api(RouteApi.addClient,data,on_success)
    
}


function NewClientShowNextStep(index){
    
    document.getElementById("step"+index)?.classList.remove("show");
    document.getElementById("item"+(index+1))?.classList.add("show");
    document.getElementById("step"+(index+1))?.classList.add("show");
        if ((index+1) == NewClientSteps.step6.code){
        finishNewClient()
        return
    }
}


function tuggleSidebarItem(index){
    document.getElementById("step"+index).classList.toggle("show");
}

function NewClientCompleteStep(step){
    const icon = document.getElementById("iconstep"+step);
    let valid = false
    let v = "Unknown"
    let key = null;
    if (step == NewClientSteps.step1.code){
        key = "name"
        v = document.getElementById("c"+key).value;
        valid = __valid_step1(v)
    }
    else if (step == NewClientSteps.step2.code){
        key = "phone"
        v = document.getElementById("c"+key).value;
        valid = __valid_step2(v)
    }
    else if (step == NewClientSteps.step3.code){
        key = "cid"
        v = document.getElementById(key).value;
        valid = __valid_step3(v)
    }
    else if (step == NewClientSteps.step4.code){
        key = "address"
        v = document.getElementById("c"+key).value;
        valid = __valid_step4(v);
    }
    else if (step == NewClientSteps.step5.code){
        key = "email"
        v = document.getElementById("c"+key).value;
        console.log(v)
        valid = __valid_step5(v)
    }
    if (valid){
        ManagerCache.addStepClient(key, v)
        icon.classList.add("done");
        icon.classList.add("fa-square-check")
        icon.classList.remove("fa-square"); 
    }else{
        icon.classList.remove("done");
        icon.classList.remove("fa-square-check")
        icon.classList.add("fa-square"); 
    }
    
}


 // STEPS VALID
function __valid_step1(name){return name.split(" ").length >= 2 && name.length > 6}
function __valid_step2(phone){return phoneRegex.test(phone) && phone.length  >9;}
function __valid_step3(cid){return isValidIsraeliID(cid)}
function __valid_step4(address){return address.length > 5}
function __valid_step5(email){return emailRegex.test(email)}
function cancelNewClient(){
    const sidebar = document.getElementById("newclient");
    sidebar.classList.remove("show")
    for (const [key, value] of Object.entries(NewClientSteps)){
        document.getElementById("step"+value.code)?.classList.remove("show");
        document.getElementById("item"+value.code)?.classList.remove("show");
    }
    document.getElementById("addclient").classList.remove("show")
}