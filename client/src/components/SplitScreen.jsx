import WhiteboardPanel from './WhiteboardPanel'
import CodeEditorPanel from './CodeEditorPanel'

function SplitScreen() {
  return (
    <main className="split-screen">
      <WhiteboardPanel />
      <CodeEditorPanel />
    </main>
  )
}

export default SplitScreen