
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
        document.getElementById("rstarttime").value = rent.starttime;
        document.getElementById("rendtime").value = rent.endtime;
        document.getElementById('rmoney').value = rent.money;
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


function finishNewRent(){
    document.getElementById('addrent').classList.add("show")
}

function addNewRent(){
    on_success = (res) =>{
        if (!res.success){
            
        }
        else{
            cancelNewRent()
        }
        popup(1, res.title, res.notice)
        
        
    }

    const data = {
        address:document.getElementById('raddress').value,
        stime:document.getElementById('rstarttime').value,
        etime:document.getElementById('rendtime').value,
        equipments:JSON.stringify(EQUIPMENTS_SELECTED),
        amount:document.getElementById('rmoney').value,
        cid:CLIENT_INFO_INDEX
    }

    do_api(RouteApi.addRent, data, on_success)
}



function NewRentShowNextStep(index){
    document.getElementById("nrstep"+index)?.classList.remove("show");
    document.getElementById("nritem"+(index+1))?.classList.add("show");
    document.getElementById("nrstep"+(index+1))?.classList.add("show");
        if ((index+1) == NewRentSteps.done.code){
        finishNewRent()
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
    resetEquipmentSelected()
    
}

function NewRentCompleteStep(step){
    const icon = document.getElementById("nriconstep"+step);
    var valid = false;
    key = null;
    v = null
    if (NewRentSteps.step1.code == step){
        key = "address"
        v = document.getElementById("r"+key).value;
        valid = v.length>5
    }
    else if (NewRentSteps.step2.code == step){
        key = 'starttime'
        v = document.getElementById("r"+key).value
        valid = __valid_step2(v);
    }
    else if (NewRentSteps.step3.code == step){
        key = 'endtime'
        v = document.getElementById('r'+key).value
        valid = __valid_step2(v);
    }
    else if (NewRentSteps.step4.code == step){
        valid = Boolean(EQUIPMENTS_SELECTED.length)
    }
    else if (NewRentSteps.step5.code == step){
        key = "money"
        v = document.getElementById('r'+key).value
        valid = !!parseInt(v)
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

function __valid_step2(value){return value && !isNaN(new Date(value).getTime())}

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

    const matches = EQUIPMENTS.filter(item =>
      item.name.toLowerCase().includes(text)
    );

    if (matches.length === 0) {
      menu.style.display = "none";
      return;
    }

    matches.forEach(item => {
          const wrapper = document.createElement("div");
    wrapper.classList.add("suggestion-item");

    const label = document.createElement("span");
    label.textContent = item.name;
    label.classList.add("equipment-name");

    const counterWrapper = document.createElement("div");
    counterWrapper.classList.add("counter-wrapper");

    const minusBtn = document.createElement("button");
    minusBtn.textContent = "−";
    minusBtn.classList.add("btn", "btn-minus");

    const countDisplay = document.createElement("span");
    countDisplay.textContent = EQUIPMENTS_SELECTED.find(si => si.eid == item.eid)?.count??0;
    countDisplay.classList.add("count");

    const plusBtn = document.createElement("button");
    plusBtn.textContent = "+";
    plusBtn.classList.add("btn", "btn-plus");

    let count =  EQUIPMENTS_SELECTED.find(si => si.eid == item.eid)?.count??0;
    plusBtn.onclick = (e) => {
      e.stopPropagation();
      count++;
      setSelectEquip(item.eid, 1)
      countDisplay.textContent = count;
    };

    minusBtn.onclick = (e) => {
      e.stopPropagation();
      if (count>0)count--;
      setSelectEquip(item.eid, -1)
      countDisplay.textContent = count;
    };

    counterWrapper.appendChild(minusBtn);
    counterWrapper.appendChild(countDisplay);
    counterWrapper.appendChild(plusBtn);

    wrapper.appendChild(label);
    wrapper.appendChild(counterWrapper);

    wrapper.addEventListener("click", () => {
      menu.style.display = "none";
    });

    menu.appendChild(wrapper);
  });

    menu.style.display = "block";
  
}


function setSelectEquip(eid, value){
    const equipment = EQUIPMENTS_SELECTED.find(item => item.eid === eid)
    if (!equipment){
        EQUIPMENTS_SELECTED.push({eid:eid, count:1})
    }else{
        equipment.count+=value
        EQUIPMENTS_SELECTED = EQUIPMENTS_SELECTED.filter(item => item.count)
    }

    updateCountEquipSelected()
}


function updateCountEquipSelected(){
    const counter = document.getElementById("equipcount")
    counter.textContent = EQUIPMENTS_SELECTED.reduce((sum, item) => sum + item.count, 0)
}


function resetEquipmentSelected(){
    EQUIPMENTS_SELECTED = []
    updateCountEquipSelected()
}




function showSelectedEquipments() {
    const sidebar = document.getElementById('equipments-selected');
    if (sidebar.classList.contains("show"))return
    sidebar.classList.add('show');

    document.getElementById("equipslectedtitle").textContent = `${EQUIPMENTS_SELECTED.reduce((sum, item) => sum + item.count, 0)} פריטים`
    for (const [index, item] of Object.entries(EQUIPMENTS_SELECTED)  ){
        createEquipmentSelectedRow(item.eid ,item.count)
    }
    
}

function createEquipmentSelectedRow(equip_id, count) {
  const equip = EQUIPMENTS.find(e => e.eid === equip_id);
  if (!equip) return null;
    const parent = document.getElementById('equip-selected-items')
  const row = document.createElement("div");

  row.className = "client-info-item";

  const icon = document.createElement("i");
  icon.className = "fa-solid fa-box";
    const parent_span = document.createElement("div")
  const nameSpan = document.createElement("span");
  nameSpan.textContent = equip.name;

  const typeSpan = document.createElement("span");
  typeSpan.textContent = ` (${equip.etype})`;

  const countSpan = document.createElement("span");
  countSpan.textContent = ` × ${count}`;

  parent_span.appendChild(nameSpan)
  parent_span.appendChild(typeSpan)
  parent_span.appendChild(countSpan)
  row.appendChild(icon);
  row.appendChild(parent_span)

  parent.appendChild(row)
}


function closeEquipemtsSelected(){
    const sidebar = document.getElementById("equipments-selected");
    sidebar.classList.remove("show")
    document.getElementById('equip-selected-items').innerHTML = ''
}




/* GLOBAL */

getAllClients(true)