import "bootstrap/dist/css/bootstrap.min.css";
import type { FormEvent } from "react";
import type { Volume } from "./models/volume";
import { ScriptType } from "./script-generators/script-type";
import { SupportedUrl } from "./supported-url";

function IndexPopup() {

  function getSelected(checkboxContainer: HTMLDivElement): ScriptType[] {
    let selected: ScriptType[] = [];
    let checkedCheckboxes: HTMLInputElement[] = [...checkboxContainer.querySelectorAll(":checked")] as HTMLInputElement[];
    console.log(checkedCheckboxes);
    
    checkedCheckboxes.map(option => option.value)
    .forEach(option => selected.push(ScriptType[option]));  

    console.log(selected);
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
      let typeListEl: HTMLDivElement = document.getElementById("typeList") as HTMLDivElement;
      
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

            let types: ScriptType[] = getSelected(typeListEl);
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
    let typeListEl: HTMLElement = document.getElementById("typeList");    

    let supportedScriptTypes: ScriptType[] = supportedUrl?.scriptGenerators
    .map(create => create())
    .map(generator => generator.type)
    || [];

    let firstCheckboxChecked = false;
    for (const type of supportedScriptTypes) {
      let formCheckEl: HTMLDivElement = document.createElement("div");
      let labelEl: HTMLLabelElement = document.createElement("label");
      let checkboxEl: HTMLInputElement = document.createElement("input");
      
      formCheckEl.classList.add("form-check");
      labelEl.classList.add("form-check-label");
      checkboxEl.classList.add("form-check-input");
      checkboxEl.type = "checkbox";
      if (!firstCheckboxChecked) checkboxEl.checked = firstCheckboxChecked = true;
      labelEl.innerText = `${type}`;
      checkboxEl.value = type;
      formCheckEl.appendChild(labelEl);
      labelEl.appendChild(checkboxEl);
      typeListEl.appendChild(formCheckEl);
    }
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
      <label className="container row mt-2 mb-4" id="typeList">
        Scripts
      </label>
      <div className="alert d-none" role="alert" id="warning">Volumes found: </div>
      <button className="btn btn-dark">Generate</button>
    </form>
  );
}

export default IndexPopup
