// Teacher Support - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // ===== 검색 기능 =====
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    // 모든 카드 정보 수집
    function collectAllCards() {
        const cards = [];
        const sections = document.querySelectorAll('.section');

        sections.forEach(section => {
            const sectionTitle = section.querySelector('.section-title')?.textContent.trim() || '';

            // 일반 카드
            section.querySelectorAll('.card:not(.card-folder):not(.card-sub)').forEach(card => {
                const title = card.querySelector('h3')?.textContent.trim() || '';
                const desc = card.querySelector('p')?.textContent.trim() || '';
                const icon = card.querySelector('.card-icon')?.textContent.trim() || '';
                const href = card.getAttribute('href') || '';

                if (title && href) {
                    cards.push({ title, desc, icon, href, section: sectionTitle });
                }
            });

            // 폴더 내부 카드
            section.querySelectorAll('.card-sub').forEach(card => {
                const title = card.querySelector('h3')?.textContent.trim() || '';
                const desc = card.querySelector('p')?.textContent.trim() || '';
                const icon = card.querySelector('.card-icon')?.textContent.trim() || '';
                const href = card.getAttribute('href') || '';
                const folder = card.closest('.folder-contents')?.previousElementSibling?.querySelector('h3')?.textContent.trim() || '';

                if (title && href) {
                    cards.push({ title, desc, icon, href, section: folder || sectionTitle });
                }
            });
        });

        return cards;
    }

    const allCards = collectAllCards();

    // 검색 실행
    function performSearch(query) {
        if (!query.trim()) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = allCards.filter(card =>
            card.title.toLowerCase().includes(lowerQuery) ||
            card.desc.toLowerCase().includes(lowerQuery)
        );

        if (filtered.length === 0) {
            searchResults.innerHTML = '<div class="no-results">검색 결과가 없습니다</div>';
        } else {
            searchResults.innerHTML = filtered.map(card => `
                <a href="${card.href}" class="search-result-item" target="${card.href.startsWith('/') ? '_self' : '_blank'}">
                    <span class="result-icon">${card.icon}</span>
                    <div class="result-content">
                        <h4>${card.title}</h4>
                        <p>${card.desc}</p>
                    </div>
                    <span class="result-section">${card.section}</span>
                </a>
            `).join('');
        }

        searchResults.classList.add('active');
    }

    // 검색 이벤트
    searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
    });

    // 검색창 외부 클릭 시 결과 닫기
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            searchResults.classList.remove('active');
        }
    });

    // 검색창 포커스 시 결과 다시 표시
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim()) {
            performSearch(searchInput.value);
        }
    });

    // 카드 클릭 효과 (폴더 카드 제외)
    const cards = document.querySelectorAll('.card:not(.card-folder):not(.card-sub)');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // 폴더 카드 토글 기능
    const folderCards = document.querySelectorAll('.card-folder');

    folderCards.forEach(folder => {
        folder.addEventListener('click', function(e) {
            e.preventDefault();

            const folderId = this.id;
            const contents = document.getElementById(folderId + '-contents');

            // 토글 상태
            this.classList.toggle('active');
            contents.classList.toggle('open');

            // 다른 폴더 닫기
            folderCards.forEach(otherFolder => {
                if (otherFolder !== this) {
                    otherFolder.classList.remove('active');
                    const otherContents = document.getElementById(otherFolder.id + '-contents');
                    if (otherContents) {
                        otherContents.classList.remove('open');
                    }
                }
            });
        });
    });

    // 스크롤 시 헤더 효과 (선택사항)
    let lastScroll = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
});
