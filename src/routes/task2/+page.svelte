<script>
  let bgColor = $state(' #A8E4A0');

  const colors = [
    { name: 'Тёмно-синий', value: ' #A8E4A0' },
    { name: 'Красный', value: '#b71c1c' },
    { name: 'Зелёный', value: '#1b5e20' },
    { name: 'Фиолетовый', value: '#4a148c' },
    { name: 'Оранжевый', value: '#e65100' },
    { name: 'Бирюзовый', value: '#006064' },
    { name: 'Розовый', value: '#880e4f' },
    { name: 'Серый', value: '#37474f' },
  ];

</script>

<div class="container" style="background-color: {bgColor}">
  <h1>Смена цвета фона</h1>
  <p class="current">Текущий: <code>{bgColor}</code></p>

  <div class="color-grid">
    {#each colors as color}
      <button
        class="color-btn"
        style="background-color: {color.value}"
        onclick={() => bgColor = color.value}
      >
        {color.name}
      </button>
    {/each}
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
    font-family: 'Segoe UI', sans-serif;
    color: black;
    transition: background-color 0.5s ease;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .current {
    margin-bottom: 2rem;
    font-size: 1.2rem;
  }

  code {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.2rem 0.6rem;
    border-radius: 6px;
  }

  .color-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.8rem;
    margin-bottom: 1.5rem;
  }

  .color-btn {
    padding: 0.8rem 1.2rem;
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    color: black;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: bold;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  }

  .color-btn:hover {
    transform: scale(1.1);
    border-color: black;
  }

  .random-btn {
    padding: 1rem 2rem;
    background: linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
    background-size: 300% 300%;
    animation: gradient-shift 3s ease infinite;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    color: #000;
    margin-bottom: 1.5rem;
  }

  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .random-btn:hover {
    transform: scale(1.08);
  }

  .color-picker-wrap {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .color-picker-wrap input {
    width: 60px;
    height: 40px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }

  .btn-back {
    padding: 0.8rem 1.5rem;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    color: black;
    text-decoration: none;
    transition: all 0.3s;
  }

  .btn-back:hover {
    background: rgba(255, 255, 255, 0.3);
  }
</style>