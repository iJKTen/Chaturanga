"use strict";

class ChessBoard extends HTMLElement {
  static get observedAttributes() {
    return ["fen"];
  }

  constructor() {
    super();
    this.worker = new Worker("/public/js/worker.js");
    this.setupWorker();
    let template = document.getElementById("board-template");
    let content = template.content;
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(content.cloneNode(true));
    this.board = shadowRoot.querySelector(".board");
  }

  connectedCallback() {
    this.setupWorker();
  }

  disconnectedCallback() {

  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "fen" && oldValue !== newValue) {
      this.updateBoard();
    }
  }

  setupWorker() {
    this.worker.onmessage = (event) => {
      const { type, payload } = event.data;
      switch (type) {
        case "parsedPositions":
          this.renderBoard(payload);
          break;
      }
    }
  }

  updateBoard() {
    const fen = this.getAttribute("fen");
    this.worker.postMessage({ type: "parseFEN", payload: fen });
  }

  renderBoard(positions) {
    for (const { piece, position } of positions) {
      this.addPiece(piece, position);
    }
  }

  addPiece(piece, position) {
    const pieceElem = document.createElement("div");
    pieceElem.classList.add("piece", piece, position);
    this.board.appendChild(pieceElem);
  }
}

customElements.define("chess-board", ChessBoard);
