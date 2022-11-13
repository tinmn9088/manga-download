import "bootstrap/dist/css/bootstrap.min.css";
import type { FormEvent } from "react";
import type { Volume } from "./models/volume";
import { ScriptType } from "./script-generators/script-type";
import { SupportedUrl } from "./supported-url";

function IndexPopup() {

  function getSelected(selectEl: HTMLSelectElement): ScriptType[] {
    let selected: ScriptType[] = [];
    let options: HTMLOptionElement[] = [...selectEl.querySelectorAll("option")];
    options = options.filter(option => option.selected);
    options.map(option => option.value)
    .forEach(option => selected.push(ScriptType[option]));  
    return selected;
  }

  function saveFile(filename: string, content: Blob) {
    let tempLinkEl: HTMLAnchorElement = document.createElement("a");
    tempLinkEl.setAttribute("href", URL.createObjectURL(content));
    tempLinkEl.setAttribute("download", filename);
    tempLinkEl.click();
  }

  function generateScript(event: FormEvent) {
    chrome.tabs.query({active: true, currentWindow: true, lastFocusedWindow: true}).then(tabs => {
      let supportedUrl: SupportedUrl = SupportedUrl.get(tabs[0].url);
      let warningEl: HTMLElement = document.getElementById("warning");
      let typeSelectEl: HTMLSelectElement = document.getElementById("typeSelect") as HTMLSelectElement;
      
      warningEl.classList.remove("alert-danger");
      warningEl.classList.remove("alert-success");

      // active tab url is not supported
      if (!supportedUrl) {
        warningEl.innerText = "Not supported";
        warningEl.classList.add("alert-danger");
        warningEl.classList.remove("d-none");
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, "generate", (volumes: Volume[]) => {
        if (!volumes || volumes?.length === 0) {
          warningEl.innerText = "No volumes found";
          warningEl.classList.add("alert-danger");
          warningEl.classList.remove("d-none");
          return;
        } else {
          warningEl.innerText = `Volumes found: ${volumes.length}`;
          warningEl.classList.add("alert-success");
          warningEl.classList.remove("d-none");
          setTimeout(() => {            
            let author: string = (document.getElementById("authorInput") as HTMLInputElement).value;
            let title: string = (document.getElementById("titleInput") as HTMLInputElement).value;

            let types: ScriptType[] = getSelected(typeSelectEl);
            supportedUrl.scriptGenerators
            .map(create => create())
            .filter(generator => types.includes(generator.type))
            .forEach(generator => {
              let result: string[] = []
              .concat(generator.generateBeginning())
              .concat(generator.generateDownload(volumes))
              .concat(generator.generateConvert({title: title || "Author", author: author || "Title"}));

              let content: Blob = new Blob([result.join("\n")], {type: "text/plain"});
              saveFile(`${author ? author.replace(/[^\w]/gi, "_").toLocaleLowerCase() + "-" : ""}${title ? title.replace(/[^\w]/gi, "_").toLocaleLowerCase() + "-" : ""}manga-download.${generator.fileExtension}`, content);
            });
          }, 2000);
        }        
      });
    });
    event.preventDefault();
    event.stopPropagation();
  };

  chrome.tabs.query({active: true, currentWindow: true, lastFocusedWindow: true}).then(tabs => {
    let supportedUrl: SupportedUrl = SupportedUrl.get(tabs[0].url);
    let typeSelectEl: HTMLElement = document.getElementById("typeSelect");    

    let supportedScriptTypes: ScriptType[] = supportedUrl?.scriptGenerators
    .map(create => create())
    .map(generator => generator.type)
    || [];

    for (const type of supportedScriptTypes) {
      let optionEl: HTMLOptionElement = document.createElement("option");
      optionEl.value = type;
      optionEl.innerHTML = type;
      typeSelectEl.appendChild(optionEl);
    }
    if (supportedScriptTypes.length > 0) (typeSelectEl.firstChild as HTMLOptionElement).selected = true;
  });

  return (
    <form style={{ width: "max-content" }} className="p-3" onSubmit={generateScript}>
      <div className="form-group row">
        <label>
          Author
          <input autoFocus type="text" className="form-control" placeholder="Enter author" id="authorInput"></input>
        </label>
        <small id="authorHelp" className="form-text text-muted">"Author" by default.</small>
      </div>
      <div className="form-group row">
        <label>
          Title
          <input type="text" className="form-control" placeholder="Enter title" id="titleInput"></input>
        </label>
        <small id="titleHelp" className="form-text text-muted">"Title" by default.</small>
      </div>
      <div className="form-group row mb-4">
        <label>
          Type
          <select className="form-select mt-1" multiple size={1} id="typeSelect">
          </select>
        </label>
      </div>
      <div className="alert d-none" role="alert" id="warning">Volumes found: </div>
      <button className="btn btn-dark">Generate</button>
    </form>
  );
}

export default IndexPopup
