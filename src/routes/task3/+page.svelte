<!-- src/routes/task3/+page.svelte -->
<script>
  let cursorType = $state('default');
  let windowWidth = $state(0);
  let windowHeight = $state(0);
  let popupWindow = $state(null);
  let popupStatus = $state('Popup не открыт');

  $effect(() => {
    const update = () => {
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  });

  // Следим за popup
  $effect(() => {
    const interval = setInterval(() => {
      if (popupWindow && !popupWindow.closed) {
        try {
          popupStatus = `Открыт: ${popupWindow.outerWidth} × ${popupWindow.outerHeight}`;
        } catch {
          popupStatus = 'Нет доступа';
        }
      } else if (popupWindow) {
        popupWindow = null;
        popupStatus = 'Popup закрыт';
      }
    }, 300);
    return () => clearInterval(interval);
  });

  const resolutions = [
    { label: '640 × 480', w: 640, h: 480 },
    { label: '800 × 600', w: 800, h: 600 },
    { label: '1024 × 768', w: 1024, h: 768 },
    { label: '1280 × 720 (HD)', w: 1280, h: 720 },
    { label: '1366 × 768', w: 1366, h: 768 },
    { label: '1920 × 1080 (Full HD)', w: 1920, h: 1080 },
  ];

  function openAndResize(w, h) {
    if (!popupWindow || popupWindow.closed) {
      const left = (screen.width - w) / 2;
      const top = (screen.height - h) / 2;

      popupWindow = window.open(
        '',
        'ManagedWindow',
        `width=${w},height=${h},left=${left},top=${top},resizable=yes`
      );

      if (!popupWindow) {
        popupStatus = 'Разрешите всплывающие окна!';
        return;
      }

      popupWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head><title>Окно ${w}×${h}</title>
        <style>
          *{margin:0;padding:0;box-sizing:border-box}
          body{display:flex;align-items:center;justify-content:center;
               min-height:100vh;background:linear-gradient(135deg,#A8E4A0,#A8E4A0);
               color:#fff;font-family:'Segoe UI',sans-serif;flex-direction:column;gap:1rem}
          h1{font-size:2rem;color:#1E5945}
          .size{font-size:1.5rem;padding:1rem 2rem;background:#1E5945;
                border:1px solid #1E5945;border-radius:12px}
        </style>
        </head>
        <body>
          <h1>🪟 Управляемое окно</h1>
          <div class="size" id="s">...</div>
          <script>setInterval(()=>{document.getElementById('s').textContent=
            window.outerWidth+' × '+window.outerHeight},200)<\/script>
        </body></html>
      `);
      popupWindow.document.close();
    } else {
      popupWindow.resizeTo(w, h);
      // Центрируем
      const left = (screen.width - w) / 2;
      const top = (screen.height - h) / 2;
      popupWindow.moveTo(left, top);
      popupWindow.focus();
    }

    popupStatus = `Установлено: ${w} × ${h}`;
  }

  function closePopup() {
    if (popupWindow && !popupWindow.closed) {
      popupWindow.close();
      popupWindow = null;
      popupStatus = 'Popup закрыт';
    }
  }
</script>

<div class="container" style="cursor: {cursorType}">
  <h1>Размер окна и курсоры</h1>

  <div class="info-panel">
    📐 Текущая вкладка: <strong>{windowWidth} × {windowHeight}</strong>
  </div>

  <!-- Разрешения -->
  <section class="section">
    <h2>🪟 Выбор разрешения окна</h2>
    <p class="note">Нажмите — откроется popup с выбранным размером</p>

    <div class="status-bar" class:active={popupWindow && !popupWindow?.closed}>
      {popupStatus}
    </div>

    <div class="resolutions-grid">
      {#each resolutions as r}
        <button class="btn btn-res" onclick={() => openAndResize(r.w, r.h)}>
          {r.label}
        </button>
      {/each}
    </div>

    {#if popupWindow && !popupWindow?.closed}
      <button class="btn btn-close-popup" onclick={closePopup}>
        ✕ Закрыть popup
      </button>
    {/if}
  </section>

  <!-- Курсоры -->
  <section class="section">
    <h2>🖱 Курсоры</h2>
    <div class="btn-row">
      <button
        class="btn cursor-btn"
        class:selected={cursorType === 'help'}
        style="cursor: help"
        onclick={() => cursorType = 'help'}
      >
        ❓ Help
      </button>
      <button
        class="btn cursor-btn"
        class:selected={cursorType === 'col-resize'}
        style="cursor: col-resize"
        onclick={() => cursorType = 'col-resize'}
      >
        ↔ Split
      </button>
      <button
        class="btn cursor-btn"
        class:selected={cursorType === 'crosshair'}
        style="cursor: crosshair"
        onclick={() => cursorType = 'crosshair'}
      >
        ✛ Crosshair
      </button>
    </div>
    <p class="cursor-info">Текущий: <code>{cursorType}</code></p>
  </section>

  <a href="/" class="btn-back">← Назад</a>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #A8E4A0, #A8E4A0);
    font-family: 'Segoe UI', sans-serif;
    color: black;
    padding: 2rem;
  }

  h1 { font-size: 2.5rem; margin-bottom: 1rem; }

  .info-panel {
    background: #A8E4A0;
    border: 1px solid  #A8E4A0;
    padding: 0.8rem 1.5rem;
    border-radius: 10px;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }

  .section {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 1.5rem;
    width: 100%;
    max-width: 650px;
    text-align: center;
  }

  h2 { margin-bottom: 0.6rem; color: #1E5945; }

  .note {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 1rem;
  }

  .status-bar {
    padding: 0.6rem 1rem;
    border-radius: 8px;
    margin-bottom: 1.2rem;
    font-weight: 600;
    font-size: 0.95rem;
    background: rgba(229, 57, 53, 0.15);
    border: 1px solid rgba(229, 57, 53, 0.3);
    color: #ef9a9a;
    transition: all 0.3s;
  }

  .status-bar.active {
    background: rgba(76, 175, 80, 0.15);
    border-color: rgba(76, 175, 80, 0.4);
    color: #a5d6a7;
  }

  .resolutions-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.8rem;
    margin-bottom: 1.2rem;
  }

  .btn {
    padding: 0.7rem 1.2rem;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.08);
    color: black;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  .btn-res {
    padding: 1rem;
    background: #1E5945;
    border-color: #A8E4A0;
    font-weight: 600;
  }

  .btn-res:hover {
    background: #1E5945;
    border-color: #1E5945;
    box-shadow: 0 4px 15px #A8E4A0;
  }

  .btn-close-popup {
    background: rgba(229, 57, 53, 0.2);
    border-color: #e57373;
    color: #ef9a9a;
    margin-top: 0.5rem;
  }

  .btn-close-popup:hover {
    background: rgba(229, 57, 53, 0.35);
  }

  .btn-row {
    display: flex;
    gap: 0.8rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .cursor-btn {
    min-width: 130px;
    padding: 1rem;
    font-size: 1.05rem;
    background: #1E5945;
  }

  .selected {
    background: #1E5945;
    border-color: #1E5945;
    box-shadow: 0 0 15px #A8E4A0;
  }

  .cursor-info {
    margin-top: 1rem;
    font-size: 1rem;
  }

  code {
    background: #1E5945;
    padding: 0.15rem 0.5rem;
    border-radius: 5px;
  }

  .btn-back {
    padding: 0.8rem 1.5rem;
    background: #1E5945;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    color: black;
    text-decoration: none;
    transition: all 0.3s;
  }

  .btn-back:hover { background: #1E5945; }
</style>