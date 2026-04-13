<script>
  let x = $state(0);
  let y = $state(0);
  let z = $state(0);
  let result = $state('');
  let fio = $state('Микитчук Даниил');
  let group = $state('42/2');
  let operation = $state('sum');

  const operations = [
    { id: 'sum', name: 'Сумма (x + y + z)' },
    { id: 'product', name: 'Произведение (x × y × z)' },
    { id: 'avg', name: 'Среднее ((x+y+z)/3)' },
    { id: 'hypotenuse', name: 'Гипотенуза √(x²+y²+z²)' },
    { id: 'formula', name: 'Формула: x² + 2·y - z/3' },
    { id: 'max', name: 'Максимум' },
    { id: 'min', name: 'Минимум' },
  ];

  function calculate() {
    const xn = parseFloat(x) || 0;
    const yn = parseFloat(y) || 0;
    const zn = parseFloat(z) || 0;

    let res;
    switch (operation) {
      case 'sum':
        res = xn + yn + zn;
        break;
      case 'product':
        res = xn * yn * zn;
        break;
      case 'avg':
        res = (xn + yn + zn) / 3;
        break;
      case 'hypotenuse':
        res = Math.sqrt(xn ** 2 + yn ** 2 + zn ** 2);
        break;
      case 'formula':
        res = xn ** 2 + 2 * yn - zn / 3;
        break;
      case 'max':
        res = Math.max(xn, yn, zn);
        break;
      case 'min':
        res = Math.min(xn, yn, zn);
        break;
    }

    const studentInfo = fio || group
      ? `\nСтудент: ${fio || '—'}, Группа: ${group || '—'}`
      : '';

    result = `Результат: ${res.toFixed(6)}${studentInfo}`;
  }

  function clearAll() {
    x = 0; y = 0; z = 0;
    result = '';
    fio = 'Микитчук Даниил';
    group = '42/2';
  }
</script>

<div class="container">
  <h1>Вычисления X, Y, Z</h1>

  <div class="card">
    <div class="student-info">
      <div class="input-group">
        <label>ФИО</label>
        <input type="text" bind:value={fio} placeholder="Иванов Иван Иванович" readonly/>
      </div>
      <div class="input-group">
        <label>Группа</label>
        <input type="text" bind:value={group} placeholder="ИСП-221" readonly/>
      </div>
    </div>

    <div class="variables">
      <div class="input-group">
        <label>X</label>
        <input type="number" bind:value={x} step="any" />
      </div>
      <div class="input-group">
        <label>Y</label>
        <input type="number" bind:value={y} step="any" />
      </div>
      <div class="input-group">
        <label>Z</label>
        <input type="number" bind:value={z} step="any" />
      </div>
    </div>

    <div class="input-group">
      <label>Операция</label>
      <select bind:value={operation}>
        {#each operations as op}
          <option value={op.id}>{op.name}</option>
        {/each}
      </select>
    </div>

    <div class="btn-row">
      <button class="btn btn-calc" onclick={calculate}>
        🧮 Вычислить
      </button>
      <button class="btn btn-clear" onclick={clearAll}>
        🗑 Очистить
      </button>
    </div>

    {#if result}
      <div class="result-box">
        <pre>{result}</pre>
      </div>
    {/if}
  </div>

  <a href="/web" class="btn-back">← Назад</a>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg,  #A8E4A0,  #A8E4A0);
    font-family: 'Segoe UI', sans-serif;
    color: black;
    padding: 2rem;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
  }

  .card {
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    padding: 2.5rem;
    width: 100%;
    max-width: fit-content;
  }

  .student-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .variables {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 0.5rem;
  }

  label {
    font-size: 0.85rem;
    color: #1E5945;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  input, select {
    padding: 0.7rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.08);
    color: black;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.3s;
  }

  input:focus, select:focus {
    border-color: #1E5945;
  }

  select option {
    background:  #A8E4A0;
    color: black;
  }

  .btn-row {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  .btn {
    flex: 1;
    padding: 0.8rem;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
  }

  .btn-calc {
    background: linear-gradient(135deg, #1E5945, #1E5945);
    color: black;
  }

  .btn-calc:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px  #A8E4A0;
  }

  .btn-clear {
    background: rgba(255, 255, 255, 0.1);
    color: black;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .btn-clear:hover {
    background: rgba(229, 57, 53, 0.3);
  }

  .result-box {
    margin-top: 1.5rem;
    padding: 1.2rem;
    background: rgba(76, 175, 80, 0.15);
    border: 1px solid rgba(76, 175, 80, 0.4);
    border-radius: 12px;
  }

  pre {
    margin: 0;
    white-space: pre-wrap;
    font-family: 'Consolas', monospace;
    font-size: 1rem;
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

  .btn-back:hover {
    background: rgba(255, 255, 255, 0.25);
  }
</style>