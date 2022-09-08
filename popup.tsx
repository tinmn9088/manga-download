import "bootstrap/dist/css/bootstrap.min.css"

function IndexPopup() {
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
      <button type="button" className="btn btn-dark mt-3">Generate</button>
    </form>
  )
}

export default IndexPopup
