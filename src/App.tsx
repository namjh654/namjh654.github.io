import React from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>봉봉이의 블로그</h1>
        <p>namjh654 님의 블로그 입니다</p>
        <a href="/">Read More</a>
      </header>
      <main className="App-content">
        <article className="Post">
          <h2>히스토리 테이킹</h2>
          <p>장</p>
          <button className="App-link">Read More</button>
        </article>
      </main>
    </div>
  );
}

export default App;
