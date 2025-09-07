

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
        valid = v.split(" ").length >= 2 && v.length > 6
    }
    else if (step == NewClientSteps.step2.code){
        key = "phone"
        v = document.getElementById("c"+key).value;
        valid = __valid_phone(v)
    }
    else if (step == NewClientSteps.step3.code){
        key = "cid"
        v = document.getElementById(key).value;
        valid = isValidIsraeliID(v)
    }
    else if (step == NewClientSteps.step4.code){
        key = "address"
        v = document.getElementById("c"+key).value;
        valid = __valid_step4(v);
    }
    else if (step == NewClientSteps.step5.code){
        key = "email"
        v = document.getElementById("c"+key).value;
        valid = __valid_step5(v)
    }
    if (valid){
        icon.classList.add("done");
        icon.classList.add("fa-square-check")
        icon.classList.remove("fa-square"); 
    }else{
        icon.classList.remove("done");
        icon.classList.remove("fa-square-check")
        icon.classList.add("fa-square"); 
    }
    ManagerCache.addStepClient(key, v)
    
}


 // STEPS VALID
 function __valid_phone(phone){return phoneRegex.test(phone) && phone.length  >9;}
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



function createContractEventLink(contract_id, client_id, rent_id){
  const link = `${location.origin}/contract?ctid=${contract_id}&cid=${client_id}&rid=${rent_id}`;

  try{
  navigator.clipboard.writeText(link)
    .then(() => {
      popup(1, "קישור", "הקישור הועתק!", 1000)
    })
    .catch(err => {
      console.error("Clipboard error:", err);
    });

    }catch{
            popup(1, "בעיה", "משהו השתבש")
    }
}

function showMenuDeleteRent(id, rent_id, event){
    toggleGeneralMenu(id, event, "למחוק את האירוע?")
    RENT_ID = rent_id

}

function removeRent(){
    on_success = (res) => {
        if (!res.success){ }else{location.reload()}

        popup(1, res.title, res.notice)
        
    }
    data = {rid:RENT_ID, status:HomeView.DELETED.code}
    do_api(RouteApi.RemoveRent, data, on_success)
}

function deleteRent(){
    on_success = (res) => {
        if (!res.success){ }else{location.reload()}

        popup(1, res.title, res.notice)
        
    }
    data = {rid:RENT_ID, status:HomeView.DELETED.code}
    do_api(RouteApi.DeleteRent, data, on_success)
}


function completeRent(){
    on_success = (res) => {
        if (!res.success){ }else{location.reload()}

        popup(1, res.title, res.notice)
        RENT_ID = ''
        
    }
    data = {rid:RENT_ID, status:HomeView.COMPLETE.code}
    do_api(RouteApi.CompleteRent, data, on_success)
}

function showMenuCompleteRent(id, rent_id, event){
    toggleGeneralMenu(id, event, "הסתיים האירוע?")
    RENT_ID = rent_id
}

function canceledRent(){
    on_success = (res) => {
        if (!res.success){ }else{location.reload()}

        popup(1, res.title, res.notice)
        
    }
    data = {rid:RENT_ID, status:HomeView.CANCELED.code}
    do_api(RouteApi.CanceledRent, data, on_success)
}
function showMenuCanceledRent(id, rent_id, event){
    toggleEquipmentMenu(id, event, "להשהות את אירוע?")
    RENT_ID = rent_id;
}

function restoreRent(rid){
    on_success = (res) =>{
        if (!res.success){}
        else{
            location.reload()
        }
        popup(1, res.title, res.notice)
    }
    data = {rid:rid, status:HomeView.LIVE.code}
    do_api(RouteApi.RestoreRent, data, on_success)
}

function showMenuSelectHomeView(id, event){
    toggleGeneralMenu(id, event, "בחר סוג אירועים")
    if (document.getElementById("homeviewmenu").children.length> 1){return}
    for (const [key, item] of Object.entries(HomeView)){
        __createViewMenu(item)
    }

}
function __createViewMenu(item){
    const parent = document.getElementById("homeviewmenu")
    const div = document.createElement("div");
    div.className = "general-menu-item";

    const icon = document.createElement("i");
    icon.className = "fa-solid fa-users-viewfinder";
    icon.style.color = "#74C0FC";

    const span = document.createElement("span");
    span.textContent = item.name;

    div.appendChild(icon);
    div.appendChild(span);

    div.onclick = () => {selectHomeView(item.code)}

    // Append to body (or wherever you want)
    parent.appendChild(div);
}

function selectHomeView(code, href = true){
    if (!parseInt(code+1)){return}
    let view = undefined
    if (!code){
        view = DEFAULT_HVIEW
    }
    else{
        view = getHomeViewByCode(code)
    }
    const namev = document.getElementById("nameview")
    namev.textContent = view.name
    
    if (!href){return}
    location.href = '/home?status='+code
}


function showMenuLink(id, event, ctid, cid, rid, phone){
    toggleGeneralMenu(id, event, "חוזה ללקוח - קישורים")
    LINK_CONTRACT = `${location.origin}/contract?ctid=${ctid}&cid=${cid}&rid=${rid}`;
    PHONE_CLIENT = phone

}

function sendToClientWhatsApp(){
    var phone = PHONE_CLIENT
    const link = encodeURIComponent(LINK_CONTRACT)
    if (phone.substring(0, 1) == "0")
        phone = phone.substring(1, 2222)
    window.open("https://wa.me/972"+phone+"?text="+link)
}
    
function onDocumentReloadSelectHView(){
    selectHomeView(location.href.substring(location.href.indexOf('status=')+7), false)
}


onDocumentReloadSelectHView()