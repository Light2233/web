<script>
    import { onDestroy } from 'svelte';
    
    // ========== УПРАВЛЕНИЕ МОДАЛЬНЫМИ/НЕМОДАЛЬНЫМИ ОКНАМИ ==========
    // Модальное окно: требует закрытия перед продолжением работы с основной формой
    let isModalOpen = $state(false);
    let modalMessage = $state('Сначала закрой меня!');
    
    // Немодальное окно: позволяет работать с основной формой параллельно
    let isModelessOpen = $state(false);
    let modelessMessage = $state('Свобода!');
    
    // Счетчик для немодальных окон (демонстрация множественных окон)
    let modelessWindows = $state([]);
    let nextWindowId = $state(1);
    
    // ========== КОМПОНЕНТ MAIN MENU (Аналог MenuStrip) ==========
    let isMenuOpen = $state(-1);
    
    // Структура меню (аналог ToolStripMenuItem в C#)
    const menuItems = [
        {
            name: 'Окно',
            subItems: [
                { name: 'Модальное', action: 'modal' },
                { name: 'Немодальное', action: 'modeless' }
            ]
        },
        {
            name: 'Справка',
            subItems: [
                { name: 'О программе', action: 'about' },
                { name: 'Инструкция', action: 'help' }
            ]
        }
    ];
    
    // ========== ОБРАБОТЧИКИ СОБЫТИЙ (аналог C# Event Handlers) ==========
    
    /**
     * Открытие модального окна
     * Аналог: f2.ShowDialog() в C# Windows Forms
     * Модальное окно блокирует взаимодействие с основной формой
     */
    function openModal() {
        isModalOpen = true;
    }
    
    /**
     * Закрытие модального окна
     * Аналог: this.Close() в C#
     */
    function closeModal() {
        isModalOpen = false;
    }
    
    /**
     * Открытие немодального окна
     * Аналог: f3.Show() в C# Windows Forms
     * Немодальное окно НЕ блокирует основную форму
     */
    function openModeless() {
        const windowId = nextWindowId;
        nextWindowId++;
        modelessWindows = [...modelessWindows, { id: windowId, message: `Немодальное окно #${windowId}` }];
        isModelessOpen = true;
    }
    
    /**
     * Закрытие конкретного немодального окна
     */
    function closeModeless(id) {
        modelessWindows = modelessWindows.filter(w => w.id !== id);
        if (modelessWindows.length === 0) {
            isModelessOpen = false;
        }
    }
    
    /**
     * Закрытие всех немодальных окон
     */
    function closeAllModeless() {
        modelessWindows = [];
        isModelessOpen = false;
    }
    
    /**
     * Обработчик выбора пункта меню
     * Аналог: ToolStripMenuItem_Click в C#
     */
    function handleMenuClick(action) {
        isMenuOpen = false;
        switch(action) {
            case 'modal':
                openModal();
                break;
            case 'modeless':
                openModeless();
                break;
            case 'about':
                alert('Демонстрация работы модальных и немодальных форм\nВыполнено на Svelte');
                break;
            case 'help':
                alert('Использование:\n- Модальное окно: блокирует основное окно\n- Немодальное окно: работает параллельно\n- Меню: аналог MenuStrip из C#');
                break;
        }
    }
    
    /**
     * Закрытие главного окна приложения
     * Аналог: Close() в C# Windows Forms
     */
    function closeMainForm() {
        if (confirm('Вы действительно хотите закрыть приложение?')) {
            // В реальном приложении здесь был бы выход
            alert('Приложение закрыто');
        }
    }
    
    // Демонстрационный таймер для показа асинхронной работы с немодальными окнами
    let demoInterval = null;
    
    function startDemo() {
        if (demoInterval) return;
        demoInterval = setInterval(() => {
            // Немодальные окна могут получать обновления без блокировки основного окна
            if (modelessWindows.length > 0) {
                console.log(`Немодальные окна активны: ${modelessWindows.length}`);
            }
        }, 5000);
    }
    
    startDemo();
    
    // Очистка при уничтожении компонента
    onDestroy(() => {
        if (demoInterval) clearInterval(demoInterval);
    });
</script>

<!-- 
    ОСНОВНАЯ ФОРМА (Главное окно приложения)
    Аналог: Form1 в C# Windows Forms
-->
<div class="main-container">
    
    <!-- 
        КОМПОНЕНТ MENUSTRIP (Аналог MenuStrip из Windows Forms)
        Обеспечивает навигацию и доступ к функциям приложения
    -->
    <div class="menu-strip">
        <div class="menu-container">
            {#each menuItems as item,index}
                <div class="menu-item" onmouseenter={() => isMenuOpen = index} onmouseleave={() => isMenuOpen = -1}>
                    <span class="menu-title black">{item.name}</span>
                    {#if isMenuOpen == index && item.subItems}
                        <div class="dropdown-menu">
                            {#each item.subItems as subItem}
                                <div class="dropdown-item black" onclick={() => handleMenuClick(subItem.action)}>
                                    {subItem.name}
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
    
    <!-- Основной контент формы -->
    <div class="form-content">
        <h1 class="black">Работа с модальными и немодальными формами</h1>
        
        <div class="info-panel">
            <div class="info-text">
                <h3 class="black">Теоретическая справка:</h3>
                <ul class="black">
                    <li><strong>Модальная форма</strong> — блокирует взаимодействие с основной формой до своего закрытия. 
                    Используется для критических операций (ShowDialog() в C#).</li>
                    <li><strong>Немодальная форма</strong> — позволяет работать с основной формой параллельно. 
                    Используется для не критичных операций (Show() в C#).</li>
                    <li><strong>MenuStrip</strong> — компонент для создания главного меню приложения, обеспечивает навигацию.</li>
                </ul>
            </div>
        </div>
        
        <!-- Кнопки управления (аналог Button из Windows Forms) -->
        <div class="button-panel">
            <button class="btn btn-modal" onclick={openModal}>
                🪟 Вызов модальной формы
            </button>
            <button class="btn btn-modeless" onclick={openModeless}>
                📋 Вызов немодальной формы
            </button>
            <a href="/"  class="btn btn-modal">Назад</a>
        </div>
        
        <!-- Статусная информация -->
        <div class="status-bar">
            <div class="status-item">
                <span class="status-label">Статус основной формы:</span>
                <span class="status-value" class:deactive={!isModalOpen}>{isModalOpen ? "Активна" : "Неактивна"}</span>
            </div>
            <div class="status-item">
                <span class="status-label">Активные немодальные окна:</span>
                <span class="status-value">{modelessWindows.length}</span>
            </div>
        </div>
    </div>
    
    <!-- 
        МОДАЛЬНОЕ ОКНО (Modal Form)
        Аналог: Form2modal в C# с вызовом ShowDialog()
        Особенности: 
        - Затемняет фон основной формы
        - Блокирует кнопки основной формы
        - Требует обязательного закрытия
    -->
    {#if isModalOpen}
        <div class="modal-overlay" onclick={closeModal}>
            <div class="modal-window" onclick={(e) => e.stopPropagation()}>
                <div class="modal-header">
                    <h3 class="black">Модальная форма (Modal Form)</h3>
                    <button class="modal-close black" onclick={closeModal}>×</button>
                </div>
                <div class="modal-body">
                    <div class="modal-message">
                        <span class="message-icon">⚠️</span>
                        <span class="message-text">{modalMessage}</span>
                    </div>
                    <div class="modal-note">
                        <p class="black">📌 Модальное окно блокирует взаимодействие с основной формой!</p>
                        <p class="black">Это аналог ShowDialog() в C# Windows Forms.</p>
                        <p class="black">Вы не можете взаимодействовать с главным окном, пока не закроете это окно.</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-ok" onclick={closeModal}>OK</button>
                </div>
            </div>
        </div>
    {/if}
    
    <!-- 
        НЕМОДАЛЬНЫЕ ОКНА (Modeless Windows)
        Аналог: Form3modeless в C# с вызовом Show()
        Особенности:
        - Не блокируют основную форму
        - Можно открыть несколько окон
        - Работают параллельно
    -->
    {#each modelessWindows as window}
        <div class="modeless-window" style="right: {20 + (window.id % 5) * 20}px; bottom: {20 + (window.id % 5) * 20}px;">
            <div class="modeless-header">
                <h4 class="black">Немодальное окно #{window.id}</h4>
                <button class="modeless-close" onclick={() => closeModeless(window.id)}>×</button>
            </div>
            <div class="modeless-body">
                <div class="modeless-message">
                    <span class="message-icon">🎉</span>
                    <span class="message-text">{modelessMessage}</span>
                </div>
                <p class="modeless-note">
                    Немодальное окно позволяет работать с основной формой!<br>
                    Это аналог Show() в C# Windows Forms.
                </p>
            </div>
            <div class="modeless-footer">
                <button class="btn-modeless-ok" onclick={() => closeModeless(window.id)}>Close</button>
            </div>
        </div>
    {/each}
    
    <!-- Кнопка для закрытия всех немодальных окон (демонстрация) -->
    {#if modelessWindows.length > 0}
        <button class="btn-close-all" onclick={closeAllModeless}>
            Закрыть все немодальные окна ({modelessWindows.length})
        </button>
    {/if}
</div>

<style>

    .black{
        color: black !important;
    }
    /* Зеленая цветовая схема */
    .main-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #A8E4A0 0%, #A8E4A0 100%);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        position: relative;
        overflow-x: hidden;
    }
    
    /* ===== MENUSTRIP СТИЛИ (аналог MenuStrip из C#) ===== */
    .menu-strip {
        background: #A8E4A0;
        border-bottom: 2px solid #2d8f4e;
        box-shadow: 0 2px 10px #A8E4A0;
    }
    
    .menu-container {
        display: flex;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        position: relative;
    }
    
    .menu-item {
        position: relative;
        cursor: pointer;
    }
    
    .menu-title {
        display: block;
        padding: 0.5rem 1rem;
        color: #e8f5e9;
        font-weight: 500;
        border-radius: 6px;
        transition: all 0.2s;
    }
    
    .menu-title:hover {
        background: #2d8f4e;
        color: black;
    }
    
    .dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        background: #A8E4A0;
        border: 1px solid #2d8f4e;
        border-radius: 8px;
        min-width: 180px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 100;
        animation: slideDown 0.2s ease;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .dropdown-item {
        padding: 0.7rem 1rem;
        color: #e8f5e9;
        cursor: pointer;
        transition: all 0.2s;
        border-bottom: 1px solid #2d8f4e;
    }
    
    .dropdown-item:last-child {
        border-bottom: none;
    }
    
    .dropdown-item:hover {
        background: #2d8f4e;
        padding-left: 1.5rem;
    }
    
    /* ===== ОСНОВНОЙ КОНТЕНТ ===== */
    .form-content {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
    }
    
    h1 {
        color: #e8f5e9;
        text-align: center;
        margin-bottom: 1.5rem;
        font-size: 2rem;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    .info-panel {
        background: #A8E4A0;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        border-left: 4px solid #4caf50;
    }
    
    .info-text h3 {
        color: #a5d6a7;
        margin-bottom: 0.8rem;
    }
    
    .info-text ul {
        color: #e8f5e9;
        line-height: 1.6;
        padding-left: 1.5rem;
    }
    
    .info-text li {
        margin-bottom: 0.5rem;
    }
    
    /* ===== КНОПКИ ===== */
    .button-panel {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
    }
    
    .btn {
        padding: 0.8rem 1.5rem;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    
    .btn-modal {
        background: linear-gradient(135deg, #ff9800, #f57c00);
        color: black;
    }
    
    .btn-modal:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(255,152,0,0.4);
    }
    
    .btn-modeless {
        background: linear-gradient(135deg, #2196f3, #1976d2);
        color: black;
    }
    
    .btn-modeless:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(33,150,243,0.4);
    }
    
    .btn-close {
        background: linear-gradient(135deg, #f44336, #d32f2f);
        color: black;
    }
    
    .btn-close:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(244,67,54,0.4);
    }
    
    /* ===== СТАТУС БАР ===== */
    .status-bar {
        background: rgba(0,0,0,0.3);
        border-radius: 8px;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1rem;
    }
    
    .status-item {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }
    
    .status-label {
        color: #a5d6a7;
        font-weight: 500;
    }
    
    .status-value {
        color: #A8E4A0;
        font-weight: bold;
        font-size: 1.1rem;
    }
    
    .status-value.active {
        color: #A8E4A0;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
    }
    
    /* ===== МОДАЛЬНОЕ ОКНО (Modal) ===== */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        backdrop-filter: blur(3px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .modal-window {
        background: linear-gradient(135deg, #A8E4A0, #A8E4A0);
        border-radius: 16px;
        min-width: 350px;
        max-width: 500px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        border: 1px solid #4caf50;
        animation: slideUp 0.3s ease;
    }
    
    @keyframes slideUp {
        from {
            transform: translateY(50px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #A8E4A0;
        background: #A8E4A0;
        border-radius: 16px 16px 0 0;
    }
    
    .modal-header h3 {
        color: #a5d6a7;
        margin: 0;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #e8f5e9;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s;
    }
    
    .modal-close:hover {
        background: rgba(244,67,54,0.3);
        color: #f44336;
    }
    
    .modal-body {
        padding: 1.5rem;
    }
    
    .modal-message {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        margin-bottom: 1rem;
        padding: 1rem;
        background: rgba(76,175,80,0.1);
        border-radius: 8px;
    }
    
    .message-icon {
        font-size: 2rem;
    }
    
    .message-text {
        font-size: 1.2rem;
        font-weight: bold;
        color: #ff9800;
    }
    
    .modal-note {
        color: #c8e6c9;
        font-size: 0.9rem;
        line-height: 1.5;
        padding: 0.8rem;
        background: rgba(0,0,0,0.2);
        border-radius: 8px;
    }
    
    .modal-footer {
        padding: 1rem 1.5rem;
        border-top: 1px solid #A8E4A0;
        display: flex;
        justify-content: flex-end;
    }
    
    .btn-ok {
        padding: 0.5rem 1.5rem;
        background: #4caf50;
        border: none;
        border-radius: 6px;
        color: black;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .btn-ok:hover {
        background: #45a049;
        transform: scale(1.05);
    }
    
    /* ===== НЕМОДАЛЬНЫЕ ОКНА (Modeless) ===== */
    .modeless-window {
        position: fixed;
        background: linear-gradient(135deg, #1565c0, #0d47a1);
        border-radius: 12px;
        min-width: 280px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        border: 1px solid #42a5f5;
        z-index: 500;
        animation: slideInRight 0.3s ease;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .modeless-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.7rem 1rem;
        background: rgba(0,0,0,0.2);
        border-radius: 12px 12px 0 0;
        cursor: move;
    }
    
    .modeless-header h4 {
        color: black;
        margin: 0;
        font-size: 0.9rem;
    }
    
    .modeless-close {
        background: none;
        border: none;
        color: black;
        cursor: pointer;
        font-size: 1.2rem;
        padding: 0;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        transition: all 0.2s;
    }
    
    .modeless-close:hover {
        background: rgba(244,67,54,0.5);
    }
    
    .modeless-body {
        padding: 1rem;
    }
    
    .modeless-message {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.8rem;
    }
    
    .modeless-note {
        color: #e3f2fd;
        font-size: 0.8rem;
        margin: 0;
    }
    
    .modeless-footer {
        padding: 0.7rem 1rem;
        border-top: 1px solid rgba(255,255,255,0.2);
        display: flex;
        justify-content: flex-end;
    }
    
    .btn-modeless-ok {
        padding: 0.3rem 1rem;
        background: #42a5f5;
        border: none;
        border-radius: 4px;
        color: black;
        cursor: pointer;
        font-size: 0.8rem;
        transition: all 0.2s;
    }
    
    .btn-modeless-ok:hover {
        background: #1e88e5;
    }
    
    /* Кнопка закрытия всех немодальных окон */
    .btn-close-all {
        position: fixed;
        bottom: 20px;
        left: 20px;
        padding: 0.6rem 1rem;
        background: #ff5722;
        border: none;
        border-radius: 8px;
        color: black;
        font-weight: bold;
        cursor: pointer;
        z-index: 600;
        transition: all 0.2s;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    
    .btn-close-all:hover {
        background: #e64a19;
        transform: scale(1.05);
    }
    .deactive{
        color: red !important;
    }
    
    /* Адаптивность */
    @media (max-width: 768px) {
        .form-content {
            padding: 1rem;
        }
        
        .button-panel {
            flex-direction: column;
        }
        
        .btn {
            width: 100%;
        }
        
        .modal-window {
            margin: 1rem;
            min-width: auto;
        }
        
        .modeless-window {
            right: 10px !important;
            bottom: 10px !important;
        }
    }
</style>