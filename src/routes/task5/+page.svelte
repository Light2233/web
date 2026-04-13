<!-- src/routes/task5/+page.svelte -->
<script>
  let inputX = $state(12);
  let divisors = $state([2, 3, 5, 7, 10]);
  let selectedDivisors = $state([]);
  let newDivisor = $state('');
  let results = $state([]);

  function toggleDivisor(d) {
    if (selectedDivisors.includes(d)) {
      selectedDivisors = selectedDivisors.filter(v => v !== d);
    } else {
      selectedDivisors = [...selectedDivisors, d];
    }
  }

  function addDivisor() {
    const num = parseInt(newDivisor);
    if (num && num > 0 && !divisors.includes(num)) {
      divisors = [...divisors, num];
      newDivisor = '';
    }
  }

  function removeDivisor(d) {
    divisors = divisors.filter(v => v !== d);
    selectedDivisors = selectedDivisors.filter(v => v !== d);
  }

  function checkDivisibility() {
    const x = parseFloat(inputX);
    if (isNaN(x)) {
      results = [{ divisor: 0, message: 'Введите корректное число X', ok: false }];
      return;
    }

    if (selectedDivisors.length === 0) {
      results = [{ divisor: 0, message: 'Выберите хотя бы одно число кратности', ok: false }];
      return;
    }

    results = selectedDivisors.map(d => {
      const isDivisible = x % d === 0;
      return {
        divisor: d,
        message: isDivisible
          ? `${x} делится на ${d} ✓ (${x} ÷ ${d} = ${x / d})`
          : `${x} НЕ делится на ${d} ✗ (остаток: ${x % d})`,
        ok: isDivisible
      };
    });
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') addDivisor();
  }
</script>

<div class="container">
  <h1>Проверка кратности</h1>

  <div class="card">
    <div class="input-group">
      <label>Число X</label>
      <input type="number" bind:value={inputX} step="any" />
    </div>

    <div class="section">
      <label>Числа кратности (checkbox):</label>
      <div class="checkbox-grid">
        {#each divisors as d}
          <div class="checkbox-item">
            <label class="checkbox-label">
              <input
                type="checkbox"
                checked={selectedDivisors.includes(d)}
                onchange={() => toggleDivisor(d)}
              />
              <span class="checkmark">{d}</span>
            </label>
            <button class="remove-btn" onclick={() => removeDivisor(d)}>✕</button>
          </div>
        {/each}
      </div>
    </div>

    <div class="add-divisor">
      <input
        type="number"
        bind:value={newDivisor}
        placeholder="Новое число..."
        onkeydown={handleKeydown}
      />
      <button class="btn btn-add" onclick={addDivisor}>
        + Добавить
      </button>
    </div>

    <button class="btn btn-check" onclick={checkDivisibility}>
      Проверить кратность
    </button>

    {#if results.length > 0}
      <div class="results">
        {#each results as r}
          <div class="result-item" class:ok={r.ok} class:fail={!r.ok}>
            {r.message}
          </div>
        {/each}
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
    background: linear-gradient(135deg, #1a2a1a, #2e3d2e);
    font-family: 'Segoe UI', sans-serif;
    color: black;
    padding: 2rem;
  }

  h1 { font-size: 2.5rem; margin-bottom: 1.5rem; }

  .card {
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    padding: 2.5rem;
    width: 100%;
    max-width: 550px;
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

  input[type="number"], input[type="text"] {
    padding: 0.8rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.08);
    color: black;
    font-size: 1.1rem;
    outline: none;
  }

  input:focus { border-color: #81c784; }

  .section {
    margin-bottom: 1.5rem;
  }

  .checkbox-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-top: 0.8rem;
  }

  .checkbox-item {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    cursor: pointer;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    transition: all 0.3s;
  }

  .checkbox-label:has(input:checked) {
    background: rgba(129, 199, 132, 0.25);
    border-color: #81c784;
  }

  .checkbox-label input {
    display: none;
  }

  .checkmark {
    font-weight: bold;
    font-size: 1rem;
  }

  .remove-btn {
    background: none;
    border: none;
    color: #e57373;
    cursor: pointer;
    font-size: 0.8rem;
    padding: 0.2rem;
    opacity: 0.5;
    transition: opacity 0.3s;
  }

  .remove-btn:hover { opacity: 1; }

  .add-divisor {
    display: flex;
    gap: 0.8rem;
    margin-bottom: 1.5rem;
  }

  .add-divisor input {
    flex: 1;
    padding: 0.6rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.08);
    color: black;
    font-size: 1rem;
    outline: none;
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