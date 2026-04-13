<!-- src/routes/task6/+page.svelte -->
<script>
  let shape = $state('triangle');
  let sideA = $state(100);
  let sideB = $state(80);
  let sideC = $state(90);
  let radius = $state(60);
  let area = $state(0);
  let areaText = $state('');
  let canvas = $state(null);

  function calculateAndDraw() {
    switch (shape) {
      case 'triangle':
        calculateTriangle();
        break;
      case 'circle':
        calculateCircle();
        break;
      case 'square':
        calculateSquare();
        break;
    }
    drawShape();
  }

  function calculateTriangle() {
    const a = parseFloat(sideA) || 0;
    const b = parseFloat(sideB) || 0;
    const c = parseFloat(sideC) || 0;
    const s = (a + b + c) / 2;

    if (a + b <= c || a + c <= b || b + c <= a) {
      area = 0;
      areaText = 'Ошибка: треугольник с такими сторонами не существует';
      return;
    }

    area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    areaText = `Площадь треугольника (${a}, ${b}, ${c}) = ${area.toFixed(4)}`;
  }

  function calculateCircle() {
    const r = parseFloat(radius) || 0;
    area = Math.PI * r * r;
    areaText = `Площадь круга (r=${r}) = ${area.toFixed(4)}`;
  }

  function calculateSquare() {
    const a = parseFloat(sideA) || 0;
    area = a * a;
    areaText = `Площадь квадрата (a=${a}) = ${area.toFixed(4)}`;
  }

  function drawShape() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Фон
    ctx.fillStyle = 'rgba(15, 12, 41, 0.5)';
    ctx.fillRect(0, 0, w, h);

    // Сетка
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, h);
      ctx.stroke();
    }
    for (let j = 0; j < h; j += 20) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(w, j);
      ctx.stroke();
    }

    const cx = w / 2;
    const cy = h / 2;

    switch (shape) {
      case 'triangle': {
        const a = Math.min(parseFloat(sideA) || 100, 200);
        const b = Math.min(parseFloat(sideB) || 80, 200);
        const scale = Math.min(w, h) * 0.35 / Math.max(a, b, 1);

        const x1 = cx;
        const y1 = cy - a * scale * 0.5;
        const x2 = cx - b * scale * 0.5;
        const y2 = cy + a * scale * 0.3;
        const x3 = cx + b * scale * 0.5;
        const y3 = cy + a * scale * 0.3;

        // Тень
        ctx.shadowColor = '#1E5945';
        ctx.shadowBlur = 20;

        // Заливка
        const grad = ctx.createLinearGradient(x1, y1, cx, y2);
        grad.addColorStop(0, ' #A8E4A0');
        grad.addColorStop(1, '#1E5945');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        ctx.fill();

        // Контур
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#1E5945';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Вершины
        [
          [x1, y1], [x2, y2], [x3, y3]
        ].forEach(([px, py]) => {
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#fff';
          ctx.fill();
        });
        break;
      }
      case 'circle': {
        const r = Math.min(parseFloat(radius) || 60, 130);

        ctx.shadowColor = 'rgba(102, 187, 106, 0.6)';
        ctx.shadowBlur = 25;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, 'rgba(102, 187, 106, 0.3)');
        grad.addColorStop(1, 'rgba(102, 187, 106, 0.05)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#66bb6a';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Радиус
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + r, cy);
        ctx.stroke();
        ctx.setLineDash([]);

        // Центр
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();

        // Метка R
        ctx.fillStyle = '#fff';
        ctx.font = '14px sans-serif';
        ctx.fillText(`R = ${Math.round(r)}`, cx + r / 2 - 15, cy - 10);
        break;
      }
      case 'square': {
        const a = Math.min(parseFloat(sideA) || 100, 250);
        const half = a / 2;

        ctx.shadowColor = 'rgba(255, 183, 77, 0.6)';
        ctx.shadowBlur = 20;

        const grad = ctx.createLinearGradient(cx - half, cy - half, cx + half, cy + half);
        grad.addColorStop(0, 'rgba(255, 183, 77, 0.35)');
        grad.addColorStop(1, 'rgba(255, 183, 77, 0.08)');
        ctx.fillStyle = grad;
        ctx.fillRect(cx - half, cy - half, a, a);

        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#ffb74d';
        ctx.lineWidth = 3;
        ctx.strokeRect(cx - half, cy - half, a, a);

        // Вершины
        [
          [cx - half, cy - half],
          [cx + half, cy - half],
          [cx + half, cy + half],
          [cx - half, cy + half]
        ].forEach(([px, py]) => {
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#fff';
          ctx.fill();
        });
        break;
      }
    }
  }

  $effect(() => {
    if (canvas) {
      calculateAndDraw();
    }
  });
</script>

<div class="container">
  <h1>Фигуры и Canvas</h1>

  <div class="layout">
    <div class="card controls">
      <div class="radio-group">
        <label class="radio-label">
          <input type="radio" bind:group={shape} value="triangle" />
          <span>🔺 Треугольник</span>
        </label>
        <label class="radio-label">
          <input type="radio" bind:group={shape} value="circle" />
          <span>⭕ Круг</span>
        </label>
        <label class="radio-label">
          <input type="radio" bind:group={shape} value="square" />
          <span>⬜ Квадрат</span>
        </label>
      </div>

      {#if shape === 'triangle'}
        <div class="inputs">
          <div class="input-group">
            <label>Сторона a</label>
            <input type="number" bind:value={sideA} min="1" />
          </div>
          <div class="input-group">
            <label>Сторона b</label>
            <input type="number" bind:value={sideB} min="1" />
          </div>
          <div class="input-group">
            <label>Сторона c</label>
            <input type="number" bind:value={sideC} min="1" />
          </div>
        </div>
      {:else if shape === 'circle'}
        <div class="inputs">
          <div class="input-group">
            <label>Радиус r</label>
            <input type="number" bind:value={radius} min="1" />
          </div>
        </div>
      {:else}
        <div class="inputs">
          <div class="input-group">
            <label>Сторона a</label>
            <input type="number" bind:value={sideA} min="1" />
          </div>
        </div>
      {/if}

      <button class="btn btn-calc" onclick={calculateAndDraw}>
        📐 Вычислить площадь
      </button>

      {#if areaText}
        <div class="result-box">
          {areaText}
        </div>
      {/if}
    </div>

    <div class="card canvas-wrap">
      <canvas
        bind:this={canvas}
        width={400}
        height={400}
      ></canvas>
    </div>
  </div>

  <a href="/" class="btn-back">← Назад</a>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg,  #A8E4A0,  #A8E4A0);
    font-family: 'Segoe UI', sans-serif;
    color: black;
    padding: 2rem;
  }

  h1 { font-size: 2.5rem; margin-bottom: 1.5rem; }

  .layout {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .card {
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    padding: 2rem;
  }

  .controls {
    min-width: 320px;
    max-width: 380px;
  }

  .radio-group {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin-bottom: 1.5rem;
  }

  .radio-label {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.8rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 1.05rem;
  }

  .radio-label:has(input:checked) {
    background: #A8E4A0;
    border-color: #1E5945;
  }

  .radio-label input { display: none; }

  .inputs {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin-bottom: 1.5rem;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .input-group label {
    font-size: 0.8rem;
    color: #1E5945;
    font-weight: 600;
  }

  input[type="number"] {
    padding: 0.6rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.08);
    color: black;
    font-size: 1rem;
    outline: none;
  }

  input[type="number"]:focus { border-color: #1E5945; }

  .btn-calc {
    width: 100%;
    padding: 0.9rem;
    background: linear-gradient(135deg, #1E5945, #1E5945);
    border: none;
    border-radius: 10px;
    color: black;
    font-size: 1.05rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
  }

  .btn-calc:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px  #A8E4A0;
  }

  .result-box {
    margin-top: 1rem;
    padding: 1rem;
    background: rgba(76, 175, 80, 0.15);
    border: 1px solid rgba(76, 175, 80, 0.4);
    border-radius: 10px;
    font-size: 0.95rem;
  }

  .canvas-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  canvas {
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .btn-back {
    margin-top: 1.5rem;
    padding: 0.8rem 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    color: black;
    text-decoration: none;
    transition: all 0.3s;
  }

  .btn-back:hover { background: rgba(255, 255, 255, 0.25); }
</style>