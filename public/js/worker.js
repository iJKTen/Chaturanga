'use strict';

self.onmessage = function(event) {
  const { type, payload } = event.data;
  switch(type) {
    case 'parseFEN':
      const positions = fenToPositions(payload);
      self.postMessage({ type: "parsedPositions", payload: positions });
      break;
  }
}

function fenToPositions(fen) {
  const ranks = fen.split(" ")[0].split("/")
  const pieceSymbols = new Set(["r", "n", "b", "q", "k", "p", "P", "R", "N", "B", "Q", "K"]);
  const positions = [];

  for (let row = 8; row >= 1; row--) {
    const pieces = ranks[8 - row];
    let col = 1;
    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i];
      if (pieceSymbols.has(piece)) {
        const pieceWithColor = getPieceWithColor(piece);
        positions.push({ position: `square${col}${row}`,  piece: pieceWithColor });
        col++;
      } else {
        col += parseInt(piece, 10);
      }
    }
  }

  return positions;
}

function getPieceWithColor(piece) {
  const color = piece >= "A" && piece <= "Z" ? "w" : "b";
  return `${color}${piece}`.toLowerCase();
}
