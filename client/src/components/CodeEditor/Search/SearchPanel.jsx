import React, { useState } from "react";
import {
  FaSearch,
  FaTimes,
  FaFileAlt,
} from "react-icons/fa";

import "./Search.css";

export default function SearchPanel() {
  const [query, setQuery] = useState("");

  // Dummy search results
  const results = [
    {
      file: "App.jsx",
      line: 12,
      text: "function App() {",
    },
    {
      file: "Navbar.jsx",
      line: 8,
      text: "const Navbar = () => {",
    },
    {
      file: "Home.jsx",
      line: 35,
      text: "<Navbar />",
    },
  ];

  const filtered = results.filter((item) =>
    item.text.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-panel">

      <div className="search-header">
        <span>SEARCH</span>
      </div>

      <div className="search-box">

        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search in files"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {query && (
          <FaTimes
            className="clear-icon"
            onClick={() => setQuery("")}
          />
        )}

      </div>

      <div className="search-results">

        {filtered.length === 0 ? (
          <div className="empty-search">

            No results found

          </div>
        ) : (
          filtered.map((item, index) => (
            <div
              className="search-result"
              key={index}
            >

              <div className="result-file">

                <FaFileAlt />

                <span>{item.file}</span>

              </div>

              <div className="result-line">

                Line {item.line}

              </div>

              <div className="result-text">

                {item.text}

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}