const ids = [
    "eo-3-a-3702",
    "eo-3-a-3714",
    "eo-3-a-3685",
    "eo-3-a-3708",
    "eo-3-a-3710",
    "eo-3-a-3712",
    "eo-3-a-3721",
    "eo-3-a-4150",
    "imgl-0580",
    "imgl-0585",
    "imgl-0587"
];

let len = ids.length;

let thumb_paths = [];
let metadata_paths = [];
let ia_paths = [];
let manifest_paths = [];

const path_prefix = "/test/data/";
const thumb_path_suffix ="/__ia_thumb.jpg";
const metadata_path_suffix ="_meta.xml";

for (let i = 0; i < ids.length; i++) {
    let id = ids[i]
    thumb_paths.push(path_prefix.concat(id, thumb_path_suffix));
    metadata_paths.push(path_prefix.concat(id, "/", id, metadata_path_suffix));
    ia_paths.push("https://archive.org/details/"+id);
    manifest_paths.push(`https://iiif.archive.org/iiif/${id}/manifest.json`);
}

console.log(manifest_paths);

function loadXMLdoc(path, desc_el) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            RDFaWriter(this, desc_el);
        }
    };
    xmlhttp.open("GET", path, true);
    xmlhttp.send()
}

function RDFaWriter(xml, desc_el) {
    const el = ""
    const xmlDoc = xml.responseXML;
    let id = xmlDoc.getElementsByTagName("identifier")[0].childNodes[0].nodeValue;
    let creator = xmlDoc.getElementsByTagName("creator")[0].childNodes[0].nodeValue;
    let date = xmlDoc.getElementsByTagName("date")[0].childNodes[0].nodeValue;
    let title = xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
    let description = xmlDoc.getElementsByTagName("description")[0].childNodes[0].nodeValue;
    let license = xmlDoc.getElementsByTagName("licenseurl")[0].childNodes[0].nodeValue;
    
    let RDFaHTML = `
        <p typeof="title"><b>${title}, <span typeof="dateCreated">${date}</span></b></p>
        <p typeof="creator">by ${creator}</p>   
    `
    desc_el.innerHTML = RDFaHTML;
}

window.onload = function() {
    const gallery = document.getElementById("gallery");
    for (let i=0; i<thumb_paths.length; i++) {
        let thumb_path = thumb_paths[i];
        
        const new_item = document.createElement("div");
        new_item.className = "item";
        new_item.setAttribute("typeof", "CreativeWork")

        const new_thumb = document.createElement("div");
        new_item.appendChild(new_thumb);

        const new_a = document.createElement("a");
        new_a.setAttribute("target", "_blank");
        new_a.setAttribute("href", ia_paths[i]);
        new_thumb.appendChild(new_a);
        
        const new_img = document.createElement("img");
        new_img.src = thumb_path;
        new_img.setAttribute("property", "image");
        new_a.appendChild(new_img);

        const new_desc = document.createElement("div");
        new_desc.className = "desc"
        new_item.appendChild(new_desc);

        loadXMLdoc(metadata_paths[i], new_desc);

        gallery.appendChild(new_item);
    }
}
