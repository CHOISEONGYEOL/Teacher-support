// 보호할 링크들과 비밀번호 설정
const PROTECTED_LINKS = [
    'https://mapro-tool.web.app/',
    'https://mapro-tool.web.app/dir.html'
];
const PASSWORD = '3.141592'; // 원하는 비밀번호로 변경

document.addEventListener('DOMContentLoaded', function() {
    // 보호된 링크 클릭 시 가로채기
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (PROTECTED_LINKS.includes(href)) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const input = prompt('비밀번호를 입력하세요:');
                if (input === PASSWORD) {
                    window.open(href, '_blank');
                } else if (input !== null) {
                    alert('비밀번호가 틀렸습니다.');
                }
            });
        }
    });
});
