import "bootstrap/dist/css/bootstrap.min.css";
import { WgetGenerator } from "./generators/wget-generator";
import { SupportedUrl } from "./supported-urls";

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
      warning.classList.remove("d-none");
      warning.classList.remove("alert-danger");
      warning.classList.remove("alert-success");

      // active tab url is not supported
      if (!SupportedUrl.get(currentUrl)) {
        warning.classList.add("alert-danger");
        warning.innerText = "Not supported";
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, "generate", function(response) {
        if (!response || response?.volumes?.length === 0) {
          warning.classList.add("alert-danger");
          warning.innerText = "No volumes found";
          return;
        } else {
          warning.classList.add("alert-success");
          warning.innerText = `Volumes found: ${response.volumes.length}`;
          setTimeout(() => {            
            let result: string[];
            let author: string = (document.getElementById("authorInput") as HTMLInputElement).value || "Author";
            let title: string = (document.getElementById("titleInput") as HTMLInputElement).value || "Title";

            result = WgetGenerator.generate(response.volumes);
            result = SupportedUrl.get(response.url)
              .shellScriptGenerator()
              .generate({title: title, author: author}, result);

            let content: Blob = new Blob([result.join("\n")], {type: "text/plain"});
            saveFile("manga-download.sh", content);
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
