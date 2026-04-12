<!-- src/routes/+page.svelte -->
<script>
  // Svelte 5 - навигация по заданиям
</script>

<div class="nav-container">
  <h1>Лабораторные задания — Svelte 5</h1>
  <nav>
    <a href="/task1">Задание 1 — Привет и закрыть</a>
    <a href="/task2">Задание 2 — Цвет фона</a>
    <a href="/task3">Задание 3 — Размер окна и курсоры</a>
    <a href="/task4">Задание 4 — Вычисления X, Y, Z</a>
    <a href="/task5">Задание 5 — Проверка кратности</a>
    <a href="/task6">Задание 6 — Фигуры и Canvas</a>
    <a href="/task7">Задание 7 — Численное интегрирование</a>
    <a href="/task8">Задание 8 — Модальные окна</a>
  </nav>
</div>

<style>
  .nav-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-family: 'Segoe UI', sans-serif;
    background: linear-gradient(135deg,  #A8E4A0,  #A8E4A0);
    color: black;
    width: 100%;
  }

  h1 {
    margin-bottom: 2rem;
    font-size: 2rem;
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  a {
    padding: 1rem 2rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    color: black;
    text-decoration: none;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    text-align: center;
  }

  a:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateX(10px);
    border-color: #1E5945;
  }
</style>