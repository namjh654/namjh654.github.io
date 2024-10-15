import React from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>봉봉이의 블로그</h1>
        <p>This is the first post on my blog. Stay tuned for more updates!</p>
        <a className="App-link" href="#" onClick={(e) => e.preventDefault()}>
          Read More
        </a>
      </header>
      <main className="App-content">
        <article className="Post">
          <h2>Blog Post Title</h2>
          <p>
            This is a short introduction to the blog post. Click below to read
            more!
          </p>
          <button className="Post-button">Read Full Post</button>
        </article>
      </main>
    </div>
  );
}

export default App;
