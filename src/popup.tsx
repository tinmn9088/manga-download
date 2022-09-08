import "bootstrap/dist/css/bootstrap.min.css";
import { Generator } from "~src/generator";

function IndexPopup() {

  function handleOnClick(event: any) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, "generate", function(response) {
        let result: string[] = Generator.generate(response);
        let blob: Blob = new Blob([result.join("\n")], {type: "text/plain"});
        let tempLink: HTMLAnchorElement = document.createElement("a");
        tempLink.setAttribute("href", URL.createObjectURL(blob));
        tempLink.setAttribute("download", "manga-download.sh");
        tempLink.click();
      });
    });
  };

  return (
    <form style={{ width: "max-content" }} className="p-3">
      <div className="form-group row">
        <label>
          Author
          <input type="text" className="form-control" aria-describedby="authorHelp" placeholder="Enter author"></input>
        </label>
        <small id="authorHelp" className="form-text text-muted">Used to generate file names.</small>
      </div>
      <div className="form-group row">
        <label>
          Title
          <input type="text" className="form-control" aria-describedby="titleHelp" placeholder="Enter title"></input>
        </label>
        <small id="titleHelp" className="form-text text-muted">Used to generate file names.</small>
      </div>
      <button type="button" className="btn btn-dark mt-3" onClick={handleOnClick}>Generate</button>
    </form>
  );
}

export default IndexPopup
