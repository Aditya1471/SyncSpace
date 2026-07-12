function SplitScreen() {
  return (
    <div className="split-screen">
      <section className="panel whiteboard-panel">
        <div className="panel-header">
          Whiteboard
        </div>

        <div className="panel-content">
          Collaborative Drawing Area
        </div>
      </section>

      <section className="panel editor-panel">
        <div className="panel-header">
          Code Editor
        </div>

        <div className="panel-content">
          Collaborative Code Editing Area
        </div>
      </section>    
    </div>
  )
}

export default SplitScreen