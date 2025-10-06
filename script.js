const gameContainer = document.getElementById('game-container');
// ペアにするカードの数値（ここでは1〜8を2枚ずつ計16枚）
const cardValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

let flippedCards = []; // 現在めくられているカードを格納
let lockBoard = false; // 2枚めくっている間は他のカードをめくれないようにするフラグ
let matchedPairs = 0; // 揃ったペアの数

// 配列をシャッフルする関数（Fisher-Yatesシャッフル）
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// カードを作成し、ゲームボードに配置する関数
function createBoard() {
    shuffle(cardValues); // カードの値をシャッフル

    cardValues.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value; // カードの値（ペア判定用）をデータ属性に保存

        // カードの表面（値が表示される側）
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-face', 'card-front');
        cardFront.textContent = value;

        // カードの裏面（カバーされている側）
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-face', 'card-back');
        cardBack.textContent = '?'; // 裏面の文字

        card.appendChild(cardFront);
        card.appendChild(cardBack);

        card.addEventListener('click', flipCard); // クリックイベントを設定
        gameContainer.appendChild(card);
    });
}

// カードをクリックした時の処理
function flipCard() {
    // ボードがロックされている、またはすでにめくられている場合は何もしない
    if (lockBoard || this.classList.contains('flipped')) return;

    this.classList.add('flipped'); // カードをめくる

    flippedCards.push(this); // めくったカードを配列に追加

    if (flippedCards.length === 2) {
        // 2枚目のカードがめくられた
        lockBoard = true; // ボードをロック
        checkForMatch(); // ペアかどうかチェック
    }
}

// ペアかどうかチェックする関数
function checkForMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.value === card2.dataset.value;

    if (isMatch) {
        // ペアの場合
        disableCards(card1, card2); // カードを無効化
    } else {
        // ペアではない場合
        unflipCards(); // カードを裏返す
    }
}

// ペアが揃った時の処理（カードを無効化）
function disableCards(card1, card2) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    
    matchedPairs++; // 揃ったペア数をインクリメント

    // すべてのペアが揃ったかチェック
    if (matchedPairs === cardValues.length / 2) {
        setTimeout(() => alert('ゲームクリア！'), 500);
    }

    resetBoard();
}

// ペアが揃わなかった時の処理（カードを裏返す）
function unflipCards() {
    // しばらく待ってから裏返す（ユーザーが見えるように）
    setTimeout(() => {
        flippedCards.forEach(card => card.classList.remove('flipped'));
        resetBoard();
    }, 1000); // 1秒待機
}

// 処理完了後、状態をリセットする関数
function resetBoard() {
    [flippedCards, lockBoard] = [[], false];
}

// ゲーム開始
createBoard();
