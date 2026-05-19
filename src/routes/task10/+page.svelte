<!-- src/routes/task4_17/+page.svelte -->
<!--
  Задание 4.17
  Для задаваемых идентичных матриц A и B размерности n x m:
  а) проверить равенство A = k·B, где k — задаваемое число;
  б) найти одинаковые строки;
  в) найти одинаковые столбцы;
  г) найти совпадающие угловые миноры.
-->
<script>
  let rows = $state(3);
  let cols = $state(3);
  let k = $state(2);
  import { base } from '$app/paths';
  // Матрицы храним как массив массивов строк (для удобного ввода)
  let A = $state([
    ['2', '4', '6'],
    ['8', '10', '12'],
    ['14', '16', '18']
  ]);
  let B = $state([
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9']
  ]);

  let result = $state(null);
  let error = $state('');

  // Перестроить матрицы под новую размерность, сохраняя что можно
  function resize() {
    const r = Math.max(1, Math.min(8, parseInt(rows) || 1));
    const c = Math.max(1, Math.min(8, parseInt(cols) || 1));
    rows = r;
    cols = c;

    const rebuild = (M) => {
      const out = [];
      for (let i = 0; i < r; i++) {
        const row = [];
        for (let j = 0; j < c; j++) {
          row.push(M[i] && M[i][j] !== undefined ? M[i][j] : '0');
        }
        out.push(row);
      }
      return out;
    };

    A = rebuild(A);
    B = rebuild(B);
    result = null;
  }

  // Преобразовать матрицу строк в матрицу чисел
  function toNumbers(M) {
    return M.map(row => row.map(v => parseFloat(v) || 0));
  }

  // Определитель квадратной матрицы (разложение / метод Гаусса)
  function determinant(M) {
    const n = M.length;
    // копия в числах
    const m = M.map(r => r.slice());
    let det = 1;
    for (let i = 0; i < n; i++) {
      // поиск ведущего элемента
      let pivot = i;
      for (let r = i + 1; r < n; r++) {
        if (Math.abs(m[r][i]) > Math.abs(m[pivot][i])) pivot = r;
      }
      if (Math.abs(m[pivot][i]) < 1e-12) return 0;
      if (pivot !== i) {
        [m[i], m[pivot]] = [m[pivot], m[i]];
        det = -det;
      }
      det *= m[i][i];
      for (let r = i + 1; r < n; r++) {
        const factor = m[r][i] / m[i][i];
        for (let cc = i; cc < n; cc++) {
          m[r][cc] -= factor * m[i][cc];
        }
      }
    }
    return det;
  }

  function solve() {
    error = '';
    result = null;

    const nA = toNumbers(A);
    const nB = toNumbers(B);
    const n = nA.length;
    const m = nA[0].length;
    const kn = parseFloat(k) || 0;

    // а) проверка A = k·B
    let equalKB = true;
    for (let i = 0; i < n && equalKB; i++) {
      for (let j = 0; j < m; j++) {
        if (Math.abs(nA[i][j] - kn * nB[i][j]) > 1e-9) {
          equalKB = false;
          break;
        }
      }
    }

    // б) одинаковые строки (сравниваем строки A со строками B)
    const equalRows = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (nA[i].every((v, idx) => Math.abs(v - nB[j][idx]) < 1e-9)) {
          equalRows.push({ a: i + 1, b: j + 1 });
        }
      }
    }

    // в) одинаковые столбцы (сравниваем столбцы A со столбцами B)
    const colA = (M, j) => M.map(row => row[j]);
    const equalCols = [];
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < m; j++) {
        const ca = colA(nA, i);
        const cb = colA(nB, j);
        if (ca.every((v, idx) => Math.abs(v - cb[idx]) < 1e-9)) {
          equalCols.push({ a: i + 1, b: j + 1 });
        }
      }
    }

    // г) совпадающие угловые миноры
    // Угловой минор порядка p — определитель верхнего левого блока p x p.
    // Существует только если матрица позволяет (p <= min(n, m)).
    const equalMinors = [];
    const maxP = Math.min(n, m);
    for (let p = 1; p <= maxP; p++) {
      const subA = nA.slice(0, p).map(row => row.slice(0, p));
      const subB = nB.slice(0, p).map(row => row.slice(0, p));
      const dA = determinant(subA);
      const dB = determinant(subB);
      equalMinors.push({
        order: p,
        detA: dA,
        detB: dB,
        equal: Math.abs(dA - dB) < 1e-9
      });
    }

    result = { equalKB, kn, equalRows, equalCols, equalMinors };
  }

  // округление для красивого вывода
  function fmt(x) {
    return Number.isInteger(x) ? x : x.toFixed(4);
  }
</script>

<div class="container">
  <h1>Задание 4.17 — Матрицы A и B</h1>

  <div class="card">
    <p class="task">
      Для идентичных матриц A и B размерности n × m:
      <b>а)</b> проверить равенство A = k·B; <b>б)</b> найти одинаковые строки;
      <b>в)</b> найти одинаковые столбцы; <b>г)</b> найти совпадающие угловые миноры.
    </p>

    <div class="dims">
      <div class="input-group">
        <label>Строк (n)</label>
        <input type="number" bind:value={rows} min="1" max="8" />
      </div>
      <div class="input-group">
        <label>Столбцов (m)</label>
        <input type="number" bind:value={cols} min="1" max="8" />
      </div>
      <div class="input-group">
        <label>Число k</label>
        <input type="number" bind:value={k} step="any" />
      </div>
      <button class="btn btn-add" onclick={resize}>Применить размер</button>
    </div>

    <div class="matrix-block">
      <label>Матрица A</label>
      <div class="matrix" style="grid-template-columns: repeat({cols}, 1fr);">
        {#each A as row, i}
          {#each row as _, j}
            <input type="number" bind:value={A[i][j]} />
          {/each}
        {/each}
      </div>
    </div>

    <div class="matrix-block">
      <label>Матрица B</label>
      <div class="matrix" style="grid-template-columns: repeat({cols}, 1fr);">
        {#each B as row, i}
          {#each row as _, j}
            <input type="number" bind:value={B[i][j]} />
          {/each}
        {/each}
      </div>
    </div>

    <button class="btn btn-check" onclick={solve}>Решить</button>

    {#if error}
      <div class="result-item fail">{error}</div>
    {/if}

    {#if result}
      <div class="results">
        <div class="result-item" class:ok={result.equalKB} class:fail={!result.equalKB}>
          <b>а)</b> A = {result.kn}·B —
          {result.equalKB ? 'равенство ВЫПОЛНЯЕТСЯ ✓' : 'равенство НЕ выполняется ✗'}
        </div>

        <div class="result-item info">
          <b>б)</b> Одинаковые строки:
          {#if result.equalRows.length > 0}
            {result.equalRows.map(p => `строка A${p.a} = строка B${p.b}`).join('; ')}
          {:else}
            одинаковых строк нет
          {/if}
        </div>

        <div class="result-item info">
          <b>в)</b> Одинаковые столбцы:
          {#if result.equalCols.length > 0}
            {result.equalCols.map(p => `столбец A${p.a} = столбец B${p.b}`).join('; ')}
          {:else}
            одинаковых столбцов нет
          {/if}
        </div>

        <div class="result-item info">
          <b>г)</b> Угловые миноры:
          <div class="minors">
            {#each result.equalMinors as mn}
              <div class="minor-row" class:ok={mn.equal} class:fail={!mn.equal}>
                Порядок {mn.order}: detA = {fmt(mn.detA)}, detB = {fmt(mn.detB)}
                — {mn.equal ? 'совпадают ✓' : 'различаются ✗'}
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </div>

  <a href="{base}/" class="btn-back">← Назад</a>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #1a2a1a, #2e3d2e);
    font-family: 'Segoe UI', sans-serif;
    color: black;
    padding: 2rem;
  }

  h1 { font-size: 2rem; margin-bottom: 1.5rem; text-align: center; }

  .card {
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    padding: 2.5rem;
    width: 100%;
    max-width: 620px;
  }

  .task {
    background: rgba(255, 255, 255, 0.08);
    border-left: 3px solid #81c784;
    border-radius: 8px;
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    line-height: 1.4;
  }

  .dims {
    display: flex;
    gap: 0.8rem;
    align-items: flex-end;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  label {
    font-size: 0.9rem;
    color: #81c784;
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
    width: 90px;
  }

  input:focus { border-color: #81c784; }

  .matrix-block {
    margin-bottom: 1.2rem;
  }

  .matrix {
    display: grid;
    gap: 0.4rem;
    margin-top: 0.5rem;
  }

  .matrix input {
    width: 100%;
    text-align: center;
    padding: 0.5rem;
  }

  .btn {
    padding: 0.7rem 1.3rem;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
  }

  .btn-add {
    background: rgba(129, 199, 132, 0.25);
    color: #81c784;
    border: 1px solid #81c784;
    height: fit-content;
  }

  .btn-check {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, #66bb6a, #388e3c);
    color: black;
    font-size: 1.1rem;
  }

  .btn-check:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(102, 187, 106, 0.4);
  }

  .results {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .result-item {
    padding: 0.8rem 1rem;
    border-radius: 10px;
    font-size: 0.95rem;
    line-height: 1.4;
  }

  .result-item.ok {
    background: rgba(76, 175, 80, 0.15);
    border: 1px solid rgba(76, 175, 80, 0.4);
    color: #a5d6a7;
  }

  .result-item.fail {
    background: rgba(229, 57, 53, 0.15);
    border: 1px solid rgba(229, 57, 53, 0.4);
    color: #ef9a9a;
  }

  .result-item.info {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #c8e6c9;
  }

  .minors {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-top: 0.5rem;
  }

  .minor-row {
    padding: 0.5rem 0.7rem;
    border-radius: 8px;
    font-size: 0.9rem;
  }

  .minor-row.ok {
    background: rgba(76, 175, 80, 0.15);
    color: #a5d6a7;
  }

  .minor-row.fail {
    background: rgba(229, 57, 53, 0.15);
    color: #ef9a9a;
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