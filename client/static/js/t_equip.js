

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



function startNewEquipment(){
    const sidebar = document.getElementById('newequip');
    if (sidebar.classList.contains("show"))return
    sidebar.classList.add('show');
    NewEquipShowNextStep(NewEquipmentStep.step1.code-1);

}


function cancelNewEquipment(){
    const sidebar = document.getElementById("newequip");
    sidebar.classList.remove("show")
    for (const [key, value] of Object.entries(NewEquipmentStep)){
        document.getElementById("eqstep"+value.code)?.classList.remove("show");
        document.getElementById("eqitem"+value.code)?.classList.remove("show");
    }
}



function NewEquipShowNextStep(index){
    document.getElementById("eqstep"+index)?.classList.remove("show");
    document.getElementById("eqitem"+(index+1))?.classList.add("show");
    document.getElementById("eqstep"+(index+1))?.classList.add("show");
}

function toggleSidebarItemEquip(index){
    document.getElementById("eqstep"+index).classList.toggle("show");
}


function NewEquipmentCompleteStep(step){
    const icon = document.getElementById("eqiconstep"+step);
    var valid= false;
    key= null;
    v= null
    console.log(step)
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


function __valid_step1(value){return value.length>3}
function __valid_step3(value){return !!parseInt(value)}
