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
    company_name = document.getElementById("setting-company-name").value


    data = {identify:identify,
            fullname:name_en,
            he_name:name_he,
            email:email,
            phone:phone,
            mid:manager_id,
            company_name:company_name
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




/*
  Replace API_URL with your actual endpoint.
  Example behaviors supported:
    - API returns JSON: { dataUrl: "data:image/png;..." }   (preferred)
    - API returns JSON: { url: "https://..." }            (image URL)
    - API directly returns image blob (Content-Type: image/png)
*/
const API_URL = "/get_signature"; // <-- change to your actual API
const overlay = document.getElementById('overlay');
const openBtn = document.getElementById('openBtn');
const closeBtn = document.getElementById('closeBtn');
const closeFooterBtn = document.getElementById('closeFooterBtn');
const status = document.getElementById('status');
const sigWrap = document.getElementById('sigWrap');
const sigImg = document.getElementById('sigImg');
const editWrap = document.getElementById('editWrap');
const editToggleBtn = document.getElementById('editToggleBtn');
const downloadBtn = document.getElementById('downloadBtn');

const sigCanvas = document.getElementById('sigCanvas');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');

let signaturePad = null;
let currentDataUrl = null;
let editMode = false;

// Utility: show overlay
function openModal() {
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  // fetch signature on open
  loadSignature();
}

// Utility: close overlay
function closeModal() {
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  // clean up edit mode
  if (signaturePad) {
    signaturePad.off(); // remove listeners if any
  }
  editMode = false;
  editWrap.style.display = 'none';
  sigWrap.style.display = 'none';
  status.innerHTML = '';
}

// set loading spinner or error
function setStatusLoading() {
  status.innerHTML = '<div class="spinner" aria-hidden="true"></div>';
}
function setStatusText(text) {
  status.innerHTML = '<div>' + text + '</div>';
}
function clearStatus() {
  status.innerHTML = '';
}

// Fetch signature image from API and display it
async function loadSignature() {
  sigWrap.style.display = 'none';
  editWrap.style.display = 'none';
  setStatusLoading();

  try {
    // Try JSON first
    const res = await fetch(API_URL, { method: 'POST', credentials: 'same-origin' });
    const ct = res.headers.get('content-type') || '';

    if (ct.includes('application/json')) {
      const j = await res.json();
      // Accept several possible properties
      if (j.dataUrl) {
        currentDataUrl = j.dataUrl;
        showImageDataUrl(currentDataUrl);
        return;
      } else if (j.url) {
        // external url
        showImageUrl(j.url);
        return;
      } else if (j.sig) {
        // some APIs might return base64 under image
        currentDataUrl = j.sig.startsWith('data:') ? j.sig : 'data:image/png;base64,' + j.sig;
        showImageDataUrl(currentDataUrl);
        return;
      } else {
        throw new Error('JSON missing image field');
      }
    }

    // If server returns an image blob
    if (ct.startsWith('image/')) {
      const blob = await res.blob();
      const objUrl = URL.createObjectURL(blob);
      showImageUrl(objUrl);
      // free objectURL later (when closing or replacing)
      return;
    }

    // Fallback: try to parse text and see if it's a data URL
    const text = await res.text();
    if (text.startsWith('data:')) {
      currentDataUrl = text;
      showImageDataUrl(currentDataUrl);
      return;
    }

    throw new Error('Unsupported response from API. Content-Type: ' + ct);
  } catch (err) {
    console.error(err);
    setStatusText('Could not load signature: ' + (err.message || err));
  }
}

function showImageUrl(url) {
  clearStatus();
  sigImg.src = url;
  sigImg.onload = () => { sigWrap.style.display = 'flex'; }
  sigImg.onerror = () => { setStatusText('Failed to load image'); }
  currentDataUrl = null; // we don't have a dataURL yet
}

function showImageDataUrl(dataUrl) {
  clearStatus();
  sigImg.src = dataUrl;
  sigImg.onload = () => { sigWrap.style.display = 'flex'; }
  sigImg.onerror = () => { setStatusText('Failed to load signature image'); }
  currentDataUrl = dataUrl;
}

// Toggle edit mode (show canvas to redraw)
function toggleEdit() {
  if (!editMode) {
    enterEditMode();
  } else {
    exitEditMode();
  }
}

function enterEditMode() {
  editMode = true;
  editWrap.style.display = 'block';
  sigWrap.style.display = 'none';
  editToggleBtn.textContent = 'Cancel';
  // initialize canvas size & signaturePad
  fitCanvasToContainer(sigCanvas);
  signaturePad = new SignaturePad(sigCanvas, {
    backgroundColor: 'rgba(255,255,255,0)', // transparent background
    penColor: 'black',
  });
  // If we already have an image, draw it as background (non-editable pixel) OR clear
  if (currentDataUrl) {
    // draw the existing image onto canvas so user can trace it
    const img = new Image();
    img.onload = () => {
      const ctx = sigCanvas.getContext('2d');
      ctx.clearRect(0,0,sigCanvas.width,sigCanvas.height);
      // Draw image centered & contained
      const scale = Math.min(sigCanvas.width / img.width, sigCanvas.height / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (sigCanvas.width - w)/2, (sigCanvas.height - h)/2, w, h);
      // allow drawing over it (signaturePad will overlay)
    };
    img.src = currentDataUrl;
  } else {
    signaturePad.clear();
  }
}

function exitEditMode() {
  editMode = false;
  editWrap.style.display = 'none';
  editToggleBtn.textContent = 'Edit';
  if (signaturePad) {
    signaturePad.off(); // detach listeners
    signaturePad = null;
  }
  // show the preview again
  if (currentDataUrl) {
    sigWrap.style.display = 'flex';
  } else {
    // no image -> show status
    setStatusText('No signature to display');
  }
}

function fitCanvasToContainer(canvas) {
  // Match devicePixelRatio for crisp drawing
  const ratio = Math.max(1, window.devicePixelRatio || 1);
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(rect.height * ratio);
  canvas.getContext('2d').scale(ratio, ratio);
}

// Save canvas -> dataURL and show that as the signature image
async function saveSignature() {
  if (!signaturePad) return;
  if (signaturePad.isEmpty()) {
    alert('Signature is empty.');
    return;
  }
  const dataUrl = signaturePad.toDataURL('image/png');
  // Show saved signature instantly
  currentDataUrl = dataUrl;
  sigImg.src = dataUrl;
  sigImg.onload = () => {
    editWrap.style.display = 'none';
    sigWrap.style.display = 'flex';
    editMode = false;
    editToggleBtn.textContent = 'Edit';
  };

  // OPTIONAL: POST to server to save new signature
  // Uncomment and adapt if your API accepts POST with JSON { dataUrl: "..." }
  /*
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl })
    });
    if (!res.ok) throw new Error('Save failed: ' + res.status);
    // handle server confirmation if needed
  } catch (err) {
    console.error(err);
    alert('Failed to save to server: ' + err.message);
  }
  */
}

// Download currently shown signature
function downloadSignature() {
  const data = currentDataUrl || sigImg.src;
  if (!data) {
    alert('No signature to download');
    return;
  }
  // If src is an objectUrl or remote URL - try fetch blob
  if (data.startsWith('data:')) {
    triggerDownload(data, 'signature.png');
  } else {
    // attempt to fetch and download blob
    fetch(data).then(r => r.blob()).then(blob => {
      const url = URL.createObjectURL(blob);
      triggerDownload(url, 'signature.png');
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }).catch(err => {
      console.error(err);
      alert('Download failed: ' + err.message);
    });
  }
}

function triggerDownload(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
closeFooterBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => {
  // close if clicking on overlay background (not modal)
  if (e.target === overlay) closeModal();
});

clearBtn.addEventListener('click', () => { if (signaturePad) signaturePad.clear(); });
saveBtn.addEventListener('click', saveSignature);
downloadBtn.addEventListener('click', downloadSignature);

// Ensure canvas resizes when window size changes
window.addEventListener('resize', () => {
  if (signaturePad && editMode) {
    fitCanvasToContainer(sigCanvas);
  }
});