var CLIENT_INFO_INDEX = -1
var EQUIPMENT_INFO_INDEX = -1
var RENT_ID             = -1
var LINK_CONTRACT = -1
var EQUIPMENTS = [

]
var EQUIPMENTS_SELECTED = []


function loading(mode, timeout){
    if (mode == 1){
        document.getElementById('loader-overlay').style.display = 'flex';
    }
    else{
        document.getElementById('loader-overlay').style.display = 'none';
    }
}


function popup(mode, title, msg, timeout=undefined){

    if (mode == 1){
        document.getElementById('popup-title').innerText = title;
        document.getElementById('popup-message').innerText = msg;
        document.getElementById('popup').style.display = 'flex';
    }
    else{
        document.getElementById('popup').style.display = 'none';
    }
    if (timeout != undefined){
        setTimeout(()=>{popup(0)}, timeout)
    }
    
}

function do_api(route, data, success, err){
    loading(1)
    $.ajax({
        url:route,
        type:"POST",
        contentType: 'application/json',
        data:JSON.stringify(data),
        success:(res) =>{
            success(res);
            loading(0);
        },
        error:(xhr) => {
            loading(0);
            err?err(xhr):undefined

        }
    })

}

function select_tab(tab_index){
    // ui

    const _clist = "tab-selected"
    const old_tab = ManagerCache.currentTab()
    const index = tab_index??old_tab
    document.getElementById("tab"+old_tab).classList.remove(_clist)
    document.getElementById("tab"+index).classList.add(_clist);
    // set html content
    loadTabContent(index)
    showMenuTabs()
    // update cache
    ManagerCache.setTab(index);

}

function loadTabContent(tab_index){
    const old_tab_content = ManagerCache.currentTab()
    const _tcid = "tcontent"

    document.getElementById(_tcid+old_tab_content).style.display = "none";
    document.getElementById(_tcid+tab_index).style.display = "block";
    
}


function showMenuTabs(mode=undefined){
    if (mode !=undefined){
        document.getElementById("menutabs").classList.add("show");
    }else{
        document.getElementById("menutabs").classList.remove("show");
    }

}

const CacheData = {
    exist:true,
    current_tab: 0

}

const NewClientData = {
    name:"",
    phone:"",
    cid:"",
    email:"",
    address:"",
}

const NewClientRentData = {
    address: "",
    starttime:"",
    endtime:"",
    money:0
}

class ManagerCache{

    static create_cache(){
        if (ManagerCache.exist())return;

        for (const [key,value] of Object.entries(CacheData)){
            localStorage.setItem(key,value)
        }
    }
    static currentTab(){
        return localStorage.getItem("current_tab") ?? 0
    }
    static setTab(tab){
        if (!ManagerCache.exist())return

        localStorage.setItem("current_tab", tab);
    }

    static exist(){
        return Boolean(localStorage.getItem("exist"));
    }

    static newClient(data=undefined){
        let copy = !data?{...NewClientData}:data
        localStorage.setItem("newClient", JSON.stringify(copy))
    }
    /**
     * 
     * @returns NewClientData
     */
    static newClientExist(){
        const client = localStorage.getItem("newClient")
        if (!client)return null
        return JSON.parse(client)
    }

    static addStepClient(key, value){
        let cache = localStorage.getItem("newClient")
        if (!cache)return
        let json = JSON.parse(cache)
        json[key] = value
        ManagerCache.newClient(json);

    }

    static deleteNewClient(){
        if (!ManagerCache.newClientExist())return

        localStorage.removeItem("newClient");
    }
    static newRent(data=undefined){       
        let copy = !data?{...NewClientRentData}:data
        localStorage.setItem("newRent", JSON.stringify(copy))
    }
    static newRentExist(){
        const rent = localStorage.getItem("newRent")
        if (!rent)return null
        return JSON.parse(rent)
    }
    static addStepRent(key, value){
        let rent = ManagerCache.newRentExist()
        if (!rent)return
        rent[key] = value
        ManagerCache.newRent(rent);

    }
    static deleteNewRent(){
        if (!ManagerCache.newRentExist())return

        localStorage.removeItem("newRent");
    }

    static setListClients(clients){
        const data = JSON.stringify(clients)
        if (!data || data == undefined){return}
        localStorage.setItem("list_clients", data);
    }
    static getListClients(){
        const clients = localStorage.getItem("list_clients");
        return JSON.parse(clients);
    }
    /* HOME VIEW */
    // recursive
    static getHomeViewData(){
        const cache = localStorage.getItem("homeview")
        if (!cache){
            var data = {}
            for (const [d] of Object.entries(HomeView)){data[d] = null}
            localStorage.setItem("homeview", JSON.stringify(data))
            return this.getHomeViewData()
        }
        return JSON.parse(cache);
    }
    static setHomeViewData(vname, data){
        const cache = localStorage.getItem("homeview")
        const hview_json = JSON.parse(cache);
        hview_json[vname] = data
    }
    static getHViewLive(){
        const c_hview = ManagerCache.getHomeViewData()
        return c_hview[HomeView.LIVE.key]
        
    }
    static getHViewComplete(){
        const c_hview = ManagerCache.getHomeViewData()
        return c_hview[HomeView.COMPLETE.key]
    }
    static getHViewCanceled(){
        const c_hview = ManagerCache.getHomeViewData()
        return c_hview[HomeView.CANCELED.key]
    }
    static getHViewDeleted(){
        const c_hview = ManagerCache.getHomeViewData()
        return c_hview[HomeView.DELETED.key] 
    }
}

function getCurrentClientIndex(){
    const clients = ManagerCache.getListClients()
    if (!clients){popup(1, ErrorCode.cache.msg, ErrorCode.cache.code)}
    const client = clients.find(item => item.cid === CLIENT_INFO_INDEX);
    return client
}


function isValidIsraeliID(id) {
  if (!/^\d{9}$/.test(id)) return false;

  const digits = id.split("").map(Number);

  const sum = digits.reduce((acc, digit, i) => {
    let val = digit * (i % 2 === 0 ? 1 : 2);
    if (val > 9) val -= 9;
    return acc + val;
  }, 0);

  return sum % 10 === 0;
}



function toggleSearch(search_id){
    document.getElementById(search_id).classList.toggle("search-input-closed")

}


function toggleGeneralMenu(id, event, title){
    event.stopPropagation(); 
    document.getElementById('mtitle-'+id).textContent = title;
    const menu = document.getElementById(id);

    const trigger = event.currentTarget;
    const rect = trigger.getBoundingClientRect();
    const menuHeight = menu.offsetHeight;
    console.log(menuHeight)
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Decide whether to show below or above
    if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
        // Show above
        menu.style.top = (window.scrollY + rect.top - menuHeight) + "px";
    } else {
        // Show below
        menu.style.top = (window.scrollY + rect.bottom) + "px";
    }

    menu.style.left = (window.scrollX + rect.left) + "px";
    menu.classList.toggle("menu-visible");
}

document.addEventListener("click", function(event) {
  // Check if the click is on any menu or toggle
    const clickedInsideMenu = event.target.closest('.general-menu');
    const suggestionsBox = document.getElementById('menuequip')
    if (!clickedInsideMenu) {
        // Close all menus with class "menu-visible"
        document.querySelectorAll('.menu-visible').forEach(menu => {
            menu.classList.remove('menu-visible');
        });
    }
    
    if (suggestionsBox){
        suggestionsBox.style.display = 'none'
    }
});


function getListEquipmentNames(){
    on_success = (res) =>{
        if (!res.success){
            console.log(res)
            return
        }
        EQUIPMENTS = res.equipment

    }

    do_api(RouteApi.getEquip, {}, on_success)
}

















ManagerCache.create_cache()




