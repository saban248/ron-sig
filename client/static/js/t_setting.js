const sig_canva = document.getElementById("sig-setting");
const sOwner = new SignaturePad(sig_canva);


function openSettingSignature(){
    const sidebar = document.getElementById('signature');
    if (sidebar.classList.contains("show"))return
    sidebar.classList.add('show');
    document.getElementById('sitem1').classList.add("show")
    


}

function closeSettingSignature(){
    const sidebar = document.getElementById('signature');
    sidebar.classList.remove('show');
}

function toggleSidebarItemSetting(index){
    document.getElementById("sstep"+index).classList.toggle("show");
}



function setSignature(){
    const signature = sOwner.toDataURL()
    on_success = (res) =>{
        if (!res.success){
            
        }else{
           closeSettingSignature() 
        }
        popup(1, res.title, res.notice);
    }
    if (signature.length < 5000){
        popup(1, "שם לב", "החתימה קצרה מדיי")
        sOwner.clear();
        return
    }

    const data = {
        signature:signature,
        action:SettingsApi.update_signature
    }

    do_api(RouteApi.Settings, data, on_success)

}


function updateManagerSetting(manager_id){
    identify = document.getElementById("setting-id").value
    name_he = document.getElementById("setting-name_he").value
    name_en = document.getElementById("setting-name_en").value
    email = document.getElementById("setting-email").value
    phone = document.getElementById("setting-phone").value

    data = {identify:identify,
            fullname:name_en,
            he_name:name_he,
            email:email,
            phone:phone,
            mid:manager_id
    }

    on_success = (res)=>{
        if (res.success){
            popup(1, res.title, res.notice, 1000)
        }
        else{
            popup(1, res.title, res.notice, 10000)
        }
        
    }
    do_api(RouteApi.UpdateManager, data, on_success);


}
