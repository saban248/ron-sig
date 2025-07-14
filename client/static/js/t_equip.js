

function createEquipmentBox(data) {
    const { image, title, crowd, count, company } = data;

    const box = document.createElement("div");
    box.className = "box-equipment";
    box.style.backgroundImage = `url("/static/images/${image}")`;

    box.innerHTML = `
        <div class="box-equip-header">
            <div class="equip-img"></div>
        </div>
        <div class="box-equip-body">
            <div class="box-eq-title">${title}</div>
            <div class="body-equip-info">
                <div class="box-eq-info">
                    <div class="equip-info">
                        <i class="fa-solid fa-people-group"></i>
                        <span>${crowd}</span>
                    </div>
                    <div class="equip-info">
                        <i class="fa-solid fa-box"></i>
                        <span>${count}</span>
                    </div>
                    <div class="equip-info">
                        <i class="fa-solid fa-crown"></i>
                        <span>${company}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    return box;
}



function startNewEquipment(data=undefined){
    const sidebar = document.getElementById('newequip');
    if (sidebar.classList.contains("show"))return
    sidebar.classList.add('show');
    if (data){
        document.getElementById("eqname").value = data.name;
        document.getElementById("eqtype").value = data.etype;
        document.getElementById("eqcount").value = data.count;
        document.getElementById("eqcrowd").value = data.count_people;
        document.getElementById("eqcompany").value = data.company;
        document.getElementById('eqimg').src = "/static/images/"+data.img_name;
        const checkAll = () =>{
            for (const [key, value] of Object.entries(NewEquipmentStep)){
                value.code != NewEquipmentStep.done.code?NewEquipmentCompleteStep(value.code):null
            }
        }
        setTimeout(checkAll, 500)
    }
    NewEquipShowNextStep(NewEquipmentStep.step1.code-1);

}


function cancelNewEquipment(){
    const sidebar = document.getElementById("newequip");
    sidebar.classList.remove("show")
    for (const [key, value] of Object.entries(NewEquipmentStep)){
        document.getElementById("eqstep"+value.code)?.classList.remove("show");
        document.getElementById("eqitem"+value.code)?.classList.remove("show");
    }
    document.getElementById("addequip").classList.remove("show")
    document.getElementById("updateequip").classList.remove("show")
    EQUIPMENT_INFO_INDEX = ''
}



function NewEquipShowNextStep(index){
    document.getElementById("eqstep"+index)?.classList.remove("show");
    document.getElementById("eqitem"+(index+1))?.classList.add("show");
    document.getElementById("eqstep"+(index+1))?.classList.add("show");
    if (index == NewEquipmentStep.step6.code){
        FinishNewEquipment();
        return
    }
}

function toggleSidebarItemEquip(index){
    document.getElementById("eqstep"+index).classList.toggle("show");
}


function NewEquipmentCompleteStep(step){
    const icon = document.getElementById("eqiconstep"+step);
    var valid= false;
    key= null;
    v= null
    if (NewEquipmentStep.step1.code == step){
        key = "name"
        v = document.getElementById("eq"+key).value;
        valid = __valid_step1(v)
    }
    else if (NewEquipmentStep.step2.code == step){
        key = 'type'
        v = document.getElementById('eq'+key).value;
        valid = __valid_step1(v)
    }
    else if (NewEquipmentStep.step3.code == step){
        key = 'count'
        v = document.getElementById('eq'+key).value;
        valid = __valid_step3(v)
    }
    else if (NewEquipmentStep.step4.code == step){
        key = "crowd"
        v = document.getElementById('eq'+key).value;
        valid = __valid_step3(v)
    }
    else if (NewEquipmentStep.step5.code == step){
        key = 'company'
        v = document.getElementById('eq'+key).value;
        valid = __valid_step1(v)
    }else if (NewEquipmentStep.step6.code == step){
        key = 'img'
        v = document.getElementById('eq'+key)
        valid = __valid_step6(v)
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
}


function FinishNewEquipment(){
    if (EQUIPMENT_INFO_INDEX.length == 32){
        document.getElementById('updateequip').classList.add("show")
        
    }else{
        document.getElementById("addequip").classList.add("show")
    }
}

function __valid_step1(value){return value.length>3}
function __valid_step3(value){return !!parseInt(value)}
function __valid_step6(v){return Boolean(v.files[0])}


function addNewEquipment(mdata=undefined){
    loading(1)
    on_success = (res) =>{
        if (!res.success){
            
        }
        else{
            cancelNewEquipment()
            setTimeout(()=>{location.reload()}, 1000)
        }
        loading(0)
        popup(1, res.title, res.notice)
    }
    const data_equip = {
        name:document.getElementById("eqname").value,
        equip_type:document.getElementById("eqtype").value,
        count:document.getElementById("eqcount").value,
        crowd:document.getElementById("eqcrowd").value,
        company:document.getElementById("eqcompany").value
    }
    if (mdata){
        Object.assign(data_equip, mdata) 
    }
    const fileinp = document.getElementById("eqimg")
    const file = fileinp.files[0];
    const data = new FormData();
    
    data.append("file", file);
    data.append("params", JSON.stringify(data_equip))
    $.ajax({
    url: RouteApi.addEquip,
    type: 'POST',
    data: data,
    contentType: false,
    processData: false,
    success: on_success,
    error: function (res){
        loading(0)
    }
    });
}

function updateEquipment(){
    addNewEquipment({eid:EQUIPMENT_INFO_INDEX})
}



function toggleEquipmentMenu(id, event, title, equip_id){
    toggleGeneralMenu(id, event, title)
    document.getElementById('editequipmenu').onclick = function(){
        EditEquipment(equip_id)
    }
}

function EditEquipment(eid){
    on_success = (res)=>{
        if (!res.success || !res.equipment){
            return
        }
        startNewEquipment(res.equipment[0])

        
    }
    const data = {eid:eid}
    EQUIPMENT_INFO_INDEX = eid
    do_api(RouteApi.getEquip, data, on_success)
}


function DeleteEquipment(){
    const eid = EQUIPMENT_INFO_INDEX

    on_success =(res) =>{
        if (!res.success){

        }else{
            document.getElementById(eid).remove();
        }
        popup(1, res.title, res.notice)
        setTimeout(()=>{location.reload()}, 1000)
        
    }
    const data = {
        eid:eid
    }
    do_api(RouteApi.deleteEquip, data, on_success)
}





getListEquipmentNames()