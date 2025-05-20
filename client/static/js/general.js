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



const CacheData = {
    exist:true,
    current_tab: 0

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
}


ManagerCache.create_cache()




