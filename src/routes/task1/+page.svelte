
<script>
  let visible = $state(true);

  function closeTab() {
    window.open('', '_self');
    window.close();
	window.location = "/"
    
  }
</script>

<div class="container">
  {#if visible}
    <h1 class="greeting">Привет!</h1>
  {/if}

  <div class="buttons">
    <button class="btn btn-close" onclick={closeTab}>
      ✕ Закрыть вкладку
    </button>
    <a href="/" class="btn btn-back">← Назад</a>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg,  #A8E4A0,  #A8E4A0,  #A8E4A0);
    font-family: 'Segoe UI', sans-serif;
  }

  .greeting {
    font-size: 5rem;
    color: #fff;
    text-shadow: 0 0 30px  #A8E4A0,
                 0 0 60px  #A8E4A0;
    animation: pulse 2s ease-in-out infinite;
  }


  .buttons {
    display: flex;
    gap: 1rem;
    margin-top: 3rem;
  }

  .btn {
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    color: black;
  }

  .btn-close {
    background: #e53935;
  }

  .btn-close:hover {
    background: #c62828;
    transform: scale(1.05);
  }

  .btn-toggle {
    background: #1E5945;
    color: #000;
  }

  .btn-toggle:hover {
    background: #1E5945;
    transform: scale(1.05);
  }

  .btn-back {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .btn-back:hover {
    background: rgba(255, 255, 255, 0.3);
  }
</style>