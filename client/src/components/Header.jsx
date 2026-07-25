function Header() {
  return (
    <header className="header">
      <div className="brand">
        <h1>SyncSpace</h1>
      </div>

      <div className="header-info">
        <div className="room-details">
          <span className="room-id">
            Room: DEMO-123
          </span>

          <span className="users-count">
            2 users connected
          </span>
        </div>

        <button className="room-button" type="button">
          Leave Room
        </button>
      </div>
    </header>
  )
}

export default Header