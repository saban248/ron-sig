function loading(mode, timeout){
    if (mode == 1){
        document.getElementById('loader-overlay').style.display = 'flex';
    }
    else{
        document.getElementById('loader-overlay').style.display = 'none';
    }
}


function popup(mode, title, msg){

    if (mode == 1){
        document.getElementById('popup-title').innerText = title;
        document.getElementById('popup-message').innerText = msg;
        document.getElementById('popup').style.display = 'flex';
    }
    else{
        document.getElementById('popup').style.display = 'none';
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
    console.log(_tcid+old_tab_content)
    document.getElementById(_tcid+old_tab_content).hidden = true;
    document.getElementById(_tcid+tab_index).hidden = false;
    
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

ManagerCache.create_cache()




