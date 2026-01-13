// 테마 관리 모듈

(function() {
    // 저장된 테마 불러오기 (기본값: dark)
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // 버튼 아이콘 업데이트
    updateThemeButton();
}

function updateThemeButton() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    const currentTheme = document.documentElement.getAttribute('data-theme');
    btn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    btn.title = currentTheme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환';
}

// DOM 로드 후 버튼 상태 업데이트
document.addEventListener('DOMContentLoaded', updateThemeButton);
