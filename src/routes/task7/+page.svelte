<!-- src/routes/task7/+page.svelte -->
<script>
  let a = $state(0);
  let b = $state(Math.PI);
  let n = $state(100);
  let selectedFuncIndex = $state(0);
  let result = $state('');
  let steps = $state('');
  let canvas = $state(null);

  // Список функций
  let functions = $state([
    { name: 'sin(x)', fn: (x) => Math.sin(x), tex: 'sin(x)' },
    { name: 'cos(x)', fn: (x) => Math.cos(x), tex: 'cos(x)' },
    { name: 'x²', fn: (x) => x * x, tex: 'x²' },
    { name: 'x³', fn: (x) => x * x * x, tex: 'x³' },
    { name: 'eˣ', fn: (x) => Math.exp(x), tex: 'eˣ' },
    { name: '1/x', fn: (x) => 1 / x, tex: '1/x' },
    { name: '√x', fn: (x) => Math.sqrt(Math.abs(x)), tex: '√|x|' },
    { name: 'ln(x)', fn: (x) => Math.log(Math.abs(x) || 0.0001), tex: 'ln|x|' },
    { name: 'x·sin(x)', fn: (x) => x * Math.sin(x), tex: 'x·sin(x)' },
    { name: '1/(1+x²)', fn: (x) => 1 / (1 + x * x), tex: '1/(1+x²)' },
  ]);

  let newFuncName = $state('');
  let newFuncBody = $state('');

  function addFunction() {
    if (!newFuncName.trim() || !newFuncBody.trim()) return;
    try {
      const fn = new Function('x', `return ${newFuncBody}`);
      // Проверяем что работает
      fn(1);
      functions = [...functions, {
        name: newFuncName,
        fn: fn,
        tex: newFuncName
      }];
      newFuncName = '';
      newFuncBody = '';
    } catch (e) {
      alert(`Ошибка в выражении: ${e.message}`);
    }
  }

  /**
   * Метод средних прямоугольников:
   * ∫[a,b] f(x)dx ≈ h · Σ f(x_{i+1/2})
   * где h = (b-a)/n, x_{i+1/2} = a + (i + 0.5)·h
   */
  function integrate() {
    const aVal = parseFloat(a);
    const bVal = parseFloat(b);
    const nVal = parseInt(n);

    if (isNaN(aVal) || isNaN(bVal) || isNaN(nVal) || nVal <= 0) {
      result = 'Ошибка: проверьте входные данные';
      return;
    }

    const func = functions[selectedFuncIndex];
    const h = (bVal - aVal) / nVal;
    let sum = 0;
    let stepDetails = [];

    stepDetails.push(`f(x) = ${func.name}`);
    stepDetails.push(`[a, b] = [${aVal}, ${bVal}]`);
    stepDetails.push(`n = ${nVal}`);
    stepDetails.push(`h = (b - a) / n = (${bVal} - ${aVal}) / ${nVal} = ${h.toFixed(8)}`);
    stepDetails.push('');
    stepDetails.push('Метод средних прямоугольников:');
    stepDetails.push('∫f(x)dx ≈ h · Σ f(x_{i+1/2})');
    stepDetails.push('где x_{i+1/2} = a + (i + 0.5) · h');
    stepDetails.push('');

    // Показываем первые и последние шаги
    for (let i = 0; i < nVal; i++) {
      const xMid = aVal + (i + 0.5) * h;
      const fVal = func.fn(xMid);
      sum += fVal;

      if (i < 5 || i >= nVal - 3) {
        stepDetails.push(
          `  i=${i}: x_{${i}+1/2} = ${xMid.toFixed(6)}, f(x) = ${fVal.toFixed(6)}`
        );
      } else if (i === 5) {
        stepDetails.push('  ...');
      }
    }

    const integral = h * sum;

    stepDetails.push('');
    stepDetails.push(`Σ f(x_{i+1/2}) = ${sum.toFixed(8)}`);
    stepDetails.push(`Интеграл = h × Σ = ${h.toFixed(8)} × ${sum.toFixed(8)}`);
    stepDetails.push(`= ${integral.toFixed(10)}`);

    result = `∫[${aVal}, ${bVal}] ${func.name} dx = ${integral.toFixed(10)}`;
    steps = stepDetails.join('\n');

    drawIntegral(func.fn, aVal, bVal, nVal);
  }

  function drawIntegral(fn, aVal, bVal, nVal) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h_canvas = canvas.height;
    const padding = 50;

    ctx.clearRect(0, 0, w, h_canvas);

    // Фон
    ctx.fillStyle = 'rgba(15, 12, 41, 0.6)';
    ctx.fillRect(0, 0, w, h_canvas);

    // Вычисляем диапазон Y
    const step = (bVal - aVal) / 500;
    let yMin = Infinity, yMax = -Infinity;
    for (let x = aVal; x <= bVal; x += step) {
      const y = fn(x);
      if (isFinite(y)) {
        yMin = Math.min(yMin, y, 0);
        yMax = Math.max(yMax, y, 0);
      }
    }

    const yRange = yMax - yMin || 1;
    const xRange = bVal - aVal || 1;

    // Масштабирование
    const scaleX = (w - 2 * padding) / xRange;
    const scaleY = (h_canvas - 2 * padding) / yRange;

    function toCanvasX(x) { return padding + (x - aVal) * scaleX; }
    function toCanvasY(y) { return h_canvas - padding - (y - yMin) * scaleY; }

    const yZero = toCanvasY(0);

    // Сетка
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = padding + (w - 2 * padding) * i / 10;
      ctx.beginPath(); ctx.moveTo(x, padding); ctx.lineTo(x, h_canvas - padding); ctx.stroke();
      const y = padding + (h_canvas - 2 * padding) * i / 10;
      ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(w - padding, y); ctx.stroke();
    }

    // Оси
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    // Ось X (y=0)
    if (yZero >= padding && yZero <= h_canvas - padding) {
      ctx.beginPath();
      ctx.moveTo(padding, yZero);
      ctx.lineTo(w - padding, yZero);
      ctx.stroke();
    }

    // Прямоугольники
    const hStep = (bVal - aVal) / Math.min(nVal, 200); // ограничиваем для отрисовки
    const nDraw = Math.min(nVal, 200);
    const hDraw = (bVal - aVal) / nDraw;

    for (let i = 0; i < nDraw; i++) {
      const xMid = aVal + (i + 0.5) * hDraw;
      const fVal = fn(xMid);
      if (!isFinite(fVal)) continue;

      const xLeft = toCanvasX(aVal + i * hDraw);
      const xRight = toCanvasX(aVal + (i + 1) * hDraw);
      const yTop = toCanvasY(fVal);
      const rectW = xRight - xLeft;
      const rectH = yZero - yTop;

      ctx.fillStyle = fVal >= 0
        ? '#A8E4A0'
        : 'rgba(229, 115, 115, 0.2)';
      ctx.fillRect(xLeft, Math.min(yTop, yZero), rectW, Math.abs(rectH));

      ctx.strokeStyle = fVal >= 0
        ? ' #A8E4A0'
        : 'rgba(229, 115, 115, 0.4)';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(xLeft, Math.min(yTop, yZero), rectW, Math.abs(rectH));
    }

    // Кривая функции
    ctx.strokeStyle = '#1E5945';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(79, 195, 247, 0.5)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    let started = false;
    for (let x = aVal; x <= bVal; x += step) {
      const y = fn(x);
      if (!isFinite(y)) { started = false; continue; }
      const cx = toCanvasX(x);
      const cy = toCanvasY(y);
      if (!started) { ctx.moveTo(cx, cy); started = true; }
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Подписи осей
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '12px sans-serif';

    // X-метки
    for (let i = 0; i <= 5; i++) {
      const val = aVal + xRange * i / 5;
      const cx = toCanvasX(val);
      ctx.fillText(val.toFixed(2), cx - 15, h_canvas - padding + 20);
    }

    // Y-метки
    for (let i = 0; i <= 5; i++) {
      const val = yMin + yRange * i / 5;
      const cy = toCanvasY(val);
      ctx.fillText(val.toFixed(2), 5, cy + 4);
    }

    // Заголовок
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`∫ ${functions[selectedFuncIndex].name} dx`, w / 2 - 40, 25);
  }

  function removeFunction(index) {
    if (index < 10) return; // Не удаляем встроенные
    functions = functions.filter((_, i) => i !== index);
    if (selectedFuncIndex >= functions.length) {
      selectedFuncIndex = functions.length - 1;
    }
  }
</script>

<div class="container">
  <h1>Численное интегрирование</h1>
  <p class="subtitle">Метод средних прямоугольников</p>

  <div class="layout">
    <div class="card controls">
      <div class="section">
        <h3>Отрезок интегрирования</h3>
        <div class="row">
          <div class="input-group">
            <label>a (от)</label>
            <input type="number" bind:value={a} step="any" />
          </div>
          <div class="input-group">
            <label>b (до)</label>
            <input type="number" bind:value={b} step="any" />
          </div>
          <div class="input-group">
            <label>n (разбиений)</label>
            <input type="number" bind:value={n} min="1" max="100000" />
          </div>
        </div>
      </div>

      <div class="section">
        <h3>Функция f(x)</h3>
        <div class="func-list">
          {#each functions as func, i}
            <label class="func-label">
              <input
                type="radio"
                bind:group={selectedFuncIndex}
                value={i}
              />
              <span>{func.name}</span>
              {#if i >= 10}
                <button class="remove-fn" onclick={() => removeFunction(i)}>✕</button>
              {/if}
            </label>
          {/each}
        </div>
      </div>

      <div class="section add-func">
        <h3>Добавить свою функцию</h3>
        <div class="input-group">
          <label>Название</label>
          <input type="text" bind:value={newFuncName} placeholder="sin(x)+cos(x)" />
        </div>
        <div class="input-group">
          <label>Выражение JS (переменная x)</label>
          <input
            type="text"
            bind:value={newFuncBody}
            placeholder="Math.sin(x)+Math.cos(x)"
          />
        </div>
        <button class="btn btn-add" onclick={addFunction}>
          + Добавить функцию
        </button>
      </div>

      <button class="btn btn-calc" onclick={integrate}>
        🧮 Вычислить интеграл
      </button>

      {#if result}
        <div class="result-box main-result">
          {result}
        </div>
      {/if}
    </div>

    <div class="right-panel">
      <div class="card canvas-wrap">
        <canvas
          bind:this={canvas}
          width={550}
          height={400}
        ></canvas>
      </div>

      {#if steps}
        <div class="card steps-box">
          <h3>Шаги вычисления</h3>
          <pre>{steps}</pre>
        </div>
      {/if}
    </div>
  </div>

  <div class="formula-box">
    <h3>Формула метода средних прямоугольников:</h3>
    <div class="formula">
      ∫<sub>a</sub><sup>b</sup> f(x)dx ≈ h · Σ<sub>i=0</sub><sup>n-1</sup> f(x<sub>i+½</sub>)
    </div>
    <div class="formula-detail">
      где h = (b − a) / n, &nbsp;&nbsp; x<sub>i+½</sub> = a + (i + 0.5) · h
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
    background: linear-gradient(135deg,  #A8E4A0, #1a1a3e);
    font-family: 'Segoe UI', sans-serif;
    color: black;
    padding: 2rem;
  }

  h1 { font-size: 2.5rem; margin-bottom: 0.3rem; }

  .subtitle {
    color: #1E5945;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }

  .layout {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    max-width: 1100px;
  }

  .card {
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    padding: 1.5rem;
  }

  .controls {
    min-width: 340px;
    max-width: 420px;
    flex: 1;
  }

  .right-panel {
    flex: 1;
    min-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .section {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  h3 {
    color: #1E5945;
    margin-bottom: 0.8rem;
    font-size: 1rem;
  }

  .row {
    display: flex;
    gap: 0.8rem;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    flex: 1;
    margin-bottom: 0.5rem;
  }

  .input-group label {
    font-size: 0.75rem;
    color: #1E5945;
    font-weight: 600;
    text-transform: uppercase;
  }

  input[type="number"],
  input[type="text"] {
    padding: 0.6rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.08);
    color: black;
    font-size: 0.95rem;
    outline: none;
    width: 100%;
    box-sizing: border-box;
  }

  input:focus { border-color: #1E5945; }

  .func-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    max-height: 250px;
    overflow-y: auto;
    padding-right: 0.5rem;
  }

  .func-list::-webkit-scrollbar {
    width: 4px;
  }

  .func-list::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }

  .func-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.8rem;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.95rem;
  }

  .func-label:has(input:checked) {
    background: #A8E4A0;
    border-color: #1E5945;
  }

  .func-label input { display: none; }

  .remove-fn {
    margin-left: auto;
    background: none;
    border: none;
    color: #e57373;
    cursor: pointer;
    font-size: 0.8rem;
    opacity: 0.5;
  }

  .remove-fn:hover { opacity: 1; }

  .add-func .input-group {
    margin-bottom: 0.8rem;
  }

  .btn {
    padding: 0.7rem 1.2rem;
    border: none;
    border-radius: 10px;
    font-size: 0.95rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
  }

  .btn-add {
    background: #A8E4A0;
    color: #1E5945;
    border: 1px solid  #A8E4A0;
    width: 100%;
    padding: 0.6rem;
  }

  .btn-calc {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, #1E5945, #1E5945);
    color: black;
    font-size: 1.1rem;
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
    font-family: 'Consolas', monospace;
  }

  .main-result {
    font-size: 1.05rem;
    font-weight: bold;
    text-align: center;
  }

  .canvas-wrap {
    display: flex;
    justify-content: center;
  }

  canvas {
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    width: 100%;
    height: auto;
  }

  .steps-box {
    max-height: 300px;
    overflow-y: auto;
  }

  .steps-box pre {
    margin: 0;
    white-space: pre-wrap;
    font-family: 'Consolas', monospace;
    font-size: 0.85rem;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.8);
  }

  .formula-box {
    margin-top: 1.5rem;
    padding: 1.5rem 2rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    text-align: center;
    max-width: 600px;
  }

  .formula {
    font-size: 1.4rem;
    font-family: 'Times New Roman', serif;
    margin: 0.8rem 0;
    color: #1E5945;
  }

  .formula-detail {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.6);
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