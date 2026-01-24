// Teacher Support - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
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
