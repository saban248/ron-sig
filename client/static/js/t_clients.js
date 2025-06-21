
function getAllClients(force){
    var clients = ManagerCache.getListClients();

    if (!force && clients)return clients;

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


function toggleClienMenu(id, event, title, client_id){
    toggleGeneralMenu(id, event, title);
    CLIENT_INFO_INDEX = client_id;
    
}


async function showClientDetails(){
    let client = getCurrentClientIndex();
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


function searchClient(){
    const input = document.getElementById('inputsclient')
    csid = input.value
    
    clients = ManagerCache.getListClients();
    for (const [index, client] of Object.entries(clients)){
        if ((client.fullname.includes(csid) || 
            client.phone.includes(csid)    ||
            client.address.includes(csid)  ||
            client.identify.includes(csid))){
                document.getElementById(client.cid).style.display='flex';

        }
        else{
            document.getElementById(client.cid).style.display='none';
        }
    }
}

function clearSearchClient(){
    document.getElementById('inputsclient').value = ''
    searchClient()
}


function closeClientDetails(){
    const sidebar = document.getElementById("clientinfo");
    sidebar.classList.remove("show")
}

function callClient(){
    const client = getCurrentClientIndex()
    window.location.href = "tel:"+client.phone;
}

function openWhatsApp(){
    const client = getCurrentClientIndex();
    window.location.href = "https://wa.me/+972"+client.phone;
}

function deleteClient(){
    const client = getCurrentClientIndex()
    
    const data = {"cid":client.cid}
    const on_success = (res)=>{
        if (!res.success){
            popup(1, res.title, res.notice)
            return
        }
        const box = document.getElementById(client.cid)
        box?.classList.add("client-box-deleted")
        setTimeout(()=>{box?.remove();getAllClients(true)}, 500)
        
    }
    do_api(RouteApi.deleteClient, data, on_success)
    
}


function ShowMenuSelectEquipment(){
    const menu = document.getElementById('menuequip')
    const input = document.getElementById('requipment')
    const text = input.value.toLowerCase();
    menu.innerHTML = "";
    if (!text) {
      menu.style.display = "none";
      return;
    }

    const matches = equipmentList.filter(item =>
      item.toLowerCase().includes(text)
    );

    if (matches.length === 0) {
      menu.style.display = "none";
      return;
    }

    matches.forEach(item => {
          const wrapper = document.createElement("div");
    wrapper.classList.add("suggestion-item");

    const label = document.createElement("span");
    label.textContent = item;
    label.classList.add("equipment-name");

    const counterWrapper = document.createElement("div");
    counterWrapper.classList.add("counter-wrapper");

    const minusBtn = document.createElement("button");
    minusBtn.textContent = "−";
    minusBtn.classList.add("btn", "btn-minus");

    const countDisplay = document.createElement("span");
    countDisplay.textContent = "0";
    countDisplay.classList.add("count");

    const plusBtn = document.createElement("button");
    plusBtn.textContent = "+";
    plusBtn.classList.add("btn", "btn-plus");

    let count = 0;
    plusBtn.onclick = (e) => {
      e.stopPropagation();
      count++;
      countDisplay.textContent = count;
    };

    minusBtn.onclick = (e) => {
      e.stopPropagation();
      if (count > 0) count--;
      countDisplay.textContent = count;
    };

    counterWrapper.appendChild(minusBtn);
    counterWrapper.appendChild(countDisplay);
    counterWrapper.appendChild(plusBtn);

    wrapper.appendChild(label);
    wrapper.appendChild(counterWrapper);

    wrapper.addEventListener("click", () => {
      input.value = item;
      menu.style.display = "none";
    });

    menu.appendChild(wrapper);
  });

    menu.style.display = "block";
  
}





/* GLOBAL */

getAllClients(true)