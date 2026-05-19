<script>
  let text = $state('00 1011 010 11111 1 0000 101 110011');
  let result = $state(null);
  let error = $state('');

  function solve() {
    error = '';
    result = null;

    // Разбиваем строку на группы по одному или нескольким пробелам
    const groups = text.trim().split(/\s+/).filter(g => g.length > 0);

    if (groups.length === 0) {
      error = 'Строка пустая — введите группы нулей и единиц';
      return;
    }

    // Проверка: каждая группа должна состоять только из 0 и 1
    const bad = groups.find(g => !/^[01]+$/.test(g));
    if (bad) {
      error = `Группа "${bad}" содержит недопустимые символы (разрешены только 0 и 1)`;
      return;
    }

    // в) количество символов в самой длинной группе
    const maxLen = Math.max(...groups.map(g => g.length));

    // г) группы с чётным количеством символов
    const evenGroups = groups.filter(g => g.length % 2 === 0);

    // д) количество единиц в группах с нечётным количеством символов
    let onesInOdd = 0;
    for (const g of groups) {
      if (g.length % 2 !== 0) {
        onesInOdd += [...g].filter(ch => ch === '1').length;
      }
    }

    result = {
      groups,
      maxLen,
      longest: groups.filter(g => g.length === maxLen),
      evenGroups,
      onesInOdd
    };
  }

  function clearAll() {
    text = '';
    result = null;
    error = '';
  }
</script>

<div class="container">
  <h1>Задание 5.1 — Группы нулей и единиц</h1>

  <div class="card">
    <p class="task">
      Текст состоит из групп нулей и единиц, отделённых пробелами.
      В строке найти: <b>в)</b> количество символов в самой длинной группе;
      <b>г)</b> группы с чётным количеством символов;
      <b>д)</b> количество единиц в группах с нечётным количеством символов.
    </p>

    <div class="input-group">
      <label>Исходная строка</label>
      <input type="text" bind:value={text} placeholder="например: 00 1011 010 11111" />
    </div>

    <div class="btn-row">
      <button class="btn btn-check" onclick={solve}>Решить</button>
      <button class="btn btn-clear" onclick={clearAll}>🗑 Очистить</button>
    </div>

    {#if error}
      <div class="result-item fail">{error}</div>
    {/if}

    {#if result}
      <div class="results">
        <div class="result-item info">
          Найдено групп: {result.groups.length} — [ {result.groups.join(', ')} ]
        </div>

        <div class="result-item ok">
          <b>в)</b> Самая длинная группа: {result.maxLen} симв.
          (это группа{result.longest.length > 1 ? 'ы' : ''}: {result.longest.join(', ')})
        </div>

        <div class="result-item ok">
          <b>г)</b> Группы с чётным количеством символов:
          {result.evenGroups.length > 0 ? result.evenGroups.join(', ') : 'нет таких групп'}
        </div>

        <div class="result-item ok">
          <b>д)</b> Количество единиц в группах с нечётной длиной: {result.onesInOdd}
        </div>
      </div>
    {/if}
  </div>

  <a href="/" class="btn-back">← Назад</a>
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
    max-width: 600px;
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

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 1.5rem;
  }

  label {
    font-size: 0.9rem;
    color: #81c784;
    font-weight: 600;
  }

  input[type="text"] {
    padding: 0.8rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.08);
    color: black;
    font-size: 1.1rem;
    outline: none;
  }

  input:focus { border-color: #81c784; }

  .btn-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  .btn {
    flex: 1;
    padding: 0.9rem;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
  }

  .btn-check {
    background: linear-gradient(135deg, #66bb6a, #388e3c);
    color: black;
  }

  .btn-check:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(102, 187, 106, 0.4);
  }

  .btn-clear {
    background: rgba(255, 255, 255, 0.1);
    color: black;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .btn-clear:hover { background: rgba(229, 57, 53, 0.3); }

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
    margin-top: 1rem;
  }

  .result-item.info {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #c8e6c9;
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