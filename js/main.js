// Store strokes for undo functionality
const signatureStrokes = {};

function setupSignature(canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");

  // Set canvas dimensions
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  let drawing = false;
  let currentStroke = [];

  // Initialize stroke array for this canvas
  signatureStrokes[canvasId] = [];

  // Mouse events
  canvas.addEventListener("mousedown", (e) => startDrawing(e, canvas, ctx));
  canvas.addEventListener("mousemove", (e) => draw(e, canvas, ctx));
  canvas.addEventListener("mouseup", () => stopDrawing(canvasId));
  canvas.addEventListener("mouseout", () => stopDrawing(canvasId));

  // Touch events
  canvas.addEventListener("touchstart", (e) => startDrawing(e, canvas, ctx));
  canvas.addEventListener("touchmove", (e) => draw(e, canvas, ctx));
  canvas.addEventListener("touchend", () => stopDrawing(canvasId));

  function startDrawing(e, canvas, ctx) {
    e.preventDefault();
    drawing = true;
    currentStroke = [];
    ctx.beginPath();
    const { x, y } = getXY(e, canvas);
    ctx.moveTo(x, y);
    currentStroke.push({ x, y });
  }

  function draw(e, canvas, ctx) {
    if (!drawing) return;
    e.preventDefault();
    const { x, y } = getXY(e, canvas);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
    currentStroke.push({ x, y });
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function stopDrawing(canvasId) {
    if (drawing) {
      drawing = false;
      // Save current stroke
      if (currentStroke.length) {
        signatureStrokes[canvasId].push([...currentStroke]);
      }
    }
  }

  function getXY(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    } else {
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
  }
}

// Undo function
function undoSignature(canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");

  // Remove last stroke
  if (signatureStrokes[canvasId].length > 0) {
    signatureStrokes[canvasId].pop();
  }

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Redraw remaining strokes
  signatureStrokes[canvasId].forEach(stroke => {
    ctx.beginPath();
    for (let i = 0; i < stroke.length; i++) {
      const point = stroke[i];
      if (i === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    }
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  });
}

// Initialize signature pads
setupSignature("studentSignature");
setupSignature("parentSignature");
