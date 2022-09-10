import "bootstrap/dist/css/bootstrap.min.css";
import type { BashGenerator } from "./bash-generators/bash-generator";
import { SupportedUrl } from "./supported-url";

function IndexPopup() {

  function saveFile(filename: string, content: Blob) {
    let tempLink: HTMLAnchorElement = document.createElement("a");
    tempLink.setAttribute("href", URL.createObjectURL(content));
    tempLink.setAttribute("download", filename);
    tempLink.click();
  }

  function handleOnClick(event: any) {
    chrome.tabs.query({active: true, currentWindow: true, lastFocusedWindow: true}, function(tabs) {
      let currentUrl: string = tabs[0].url;
      let warning: HTMLElement = document.getElementById("warning");
      warning.classList.remove("alert-danger");
      warning.classList.remove("alert-success");

      // active tab url is not supported
      if (!SupportedUrl.get(currentUrl)) {
        warning.innerText = "Not supported";
        warning.classList.add("alert-danger");
        warning.classList.remove("d-none");
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, "generate", function(response) {
        if (!response || response?.volumes?.length === 0) {
          warning.innerText = "No volumes found";
          warning.classList.add("alert-danger");
          warning.classList.remove("d-none");
          return;
        } else {
          warning.innerText = `Volumes found: ${response.volumes.length}`;
          warning.classList.add("alert-success");
          warning.classList.remove("d-none");
          setTimeout(() => {            
            let author: string = (document.getElementById("authorInput") as HTMLInputElement).value;
            let title: string = (document.getElementById("titleInput") as HTMLInputElement).value;

            let bashGenerator: BashGenerator = SupportedUrl.get(response.url).bashGenerator();
            let result: string[] = []
              .concat(bashGenerator.generateWget(response.volumes))
              .concat(bashGenerator.generateConvert({title: title || "Author", author: author || "Title"}));

            let content: Blob = new Blob([result.join("\n")], {type: "text/plain"});
            saveFile(`${author ? author.replace(/[^\w]/gi, "_").toLocaleLowerCase() + "-" : ""}${title ? title.replace(/[^\w]/gi, "_").toLocaleLowerCase() + "-" : ""}manga-download.sh`, content);
          }, 2000);
        }        
      });
    });
  };

  return (
    <form style={{ width: "max-content" }} className="p-3">
      <div className="form-group row">
        <label>
          Author
          <input type="text" className="form-control" aria-describedby="authorHelp" placeholder="Enter author" id="authorInput"></input>
        </label>
        <small id="authorHelp" className="form-text text-muted">"Author" by default.</small>
      </div>
      <div className="form-group row mb-4">
        <label>
          Title
          <input type="text" className="form-control" aria-describedby="titleHelp" placeholder="Enter title" id="titleInput"></input>
        </label>
        <small id="titleHelp" className="form-text text-muted">"Title" by default.</small>
      </div>
      <div className="alert d-none" role="alert" id="warning">Volumes found: </div>
      <button type="button" className="btn btn-dark" onClick={handleOnClick}>Generate</button>
    </form>
  );
}

export default IndexPopup
