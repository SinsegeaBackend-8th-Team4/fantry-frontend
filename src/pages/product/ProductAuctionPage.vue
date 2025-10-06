<template>
    <div class="container">
        <div class="row g-6">
            <div class="col-md-6">
                <img :src="mainImageSrc" alt="상품 이미지" class="product-image mb-3">
                
                <div class="thumbnail-gallery">
                    <img v-for="image in productImages"
                         :key="image.id"
                         :src="image.src"
                         alt="상품 썸네일"
                         class="thumbnail-item"
                         :class="{ 'active': image.src === mainImageSrc }"
                         @mouseover="changeMainImage(image.src)">
                </div>
            </div>

            <div class="col-md-6 d-flex flex-column bordered-section">
                
                <h2 class="product-title-main mb-5"><strong>[상품명] 아이돌 포토카드 세트</strong></h2>

                <div class="countdown-timer mb-5">
                    <span class="countdown-label">경매 마감까지 남은 시간</span>
                    <span class="countdown-time">{{ timeRemaining }}</span>
                </div>

                <div class="bid-section-main text-center mb-5">
                    <h5 class="mb-3">현재 입찰가</h5>
                    <p id="current-bid-price" :class="['current-bid-price-main', { 'bid-success-effect': isBidSuccess }]">{{ currentBidPrice }}</p>
                </div>
                
                <button class="btn btn-danger btn-lg w-100" @click="openBidModal">경매 참여하기</button>

            </div>
        </div>

        <div class="row mt-5">
            <div class="col-12">
                <div class="details-section">
                    <h3 class="details-title">상품 상세 정보</h3>
                    <div class="details-grid">
                        <div class="detail-item">
                            <span><strong>카테고리</strong></span>
                            <span id="category">굿즈</span>
                        </div>
                        <div class="detail-item">
                            <span><strong>아티스트</strong></span>
                            <span id="artist_name">아이브</span>
                        </div>
                        <div class="detail-item">
                            <span><strong>경매 시작</strong></span>
                            <span id="start-time">2025-09-15 10:00:00</span>
                        </div>
                        <div class="detail-item">
                            <span><strong>경매 마감</strong></span>
                            <span id="end-time">2025-09-30 22:00:00</span>
                        </div>
                        <div class="detail-item">
                            <span><strong>경매 시작가</strong></span>
                            <span id="start_price">10,000원</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div class="row mt-5">
            <div class="col-12">
                <div class="product-description">
                    <h5><strong>상품 설명</strong></h5>
                    <p id="product_description">
                        After LIKE 앨범의 미개봉 포토카드 세트입니다. <br>
                        모든 멤버가 포함되어 있으며, 상태는 최상입니다.
                    </p>
                </div>
            </div>
        </div>

        <div v-if="isBidModalVisible" class="modal-overlay" @click.self="closeBidModal">
            <div class="modal-content">
                <button class="modal-close-btn" @click="closeBidModal">&times;</button>
                <h3>경매 참여</h3>
                <hr class="my-4">

                <div class="bid-history-section">
                    <button class="btn btn-outline-secondary w-100 mb-3" @click="toggleBidHistory">
                        지난 입찰 기록 보기 {{ isBidHistoryVisible ? '▼' : '▶' }}
                    </button>
                    <div v-if="isBidHistoryVisible" class="bid-history-log">
                        <p>16,000원 - 2025.09.24 11:30:15</p>
                        <p>15,000원 - 2025.09.24 10:25:41</p>
                        <p>...</p>
                    </div>
                </div>

                <div class="current-bid-modal mb-3">
                    <small>현재 입찰가</small>
                    <span>{{ currentBidPrice }}</span>
                </div>

                <div class="quick-bid-buttons mb-3">
                    <button class="btn btn-outline-primary btn-sm" @click="quickBid(1000)">+ 1,000원</button>
                    <button class="btn btn-outline-primary btn-sm" @click="quickBid(5000)">+ 5,000원</button>
                    <button class="btn btn-outline-primary btn-sm" @click="quickBid(10000)">+ 10,000원</button>
                </div>
                
                <form @submit.prevent="validateAndConfirmBid()">
                    <div class="input-group">
                        <input type="number" class="form-control form-control-lg" placeholder="입찰 금액" v-model="bidAmount">
                        <button class="btn btn-danger btn-lg" type="submit">입찰하기</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, onUnmounted } from 'vue';
    import { Client } from '@stomp/stompjs';
    import SockJS from 'sockjs-client';

    // --- 데이터 영역 ---
    const currentBidPrice = ref("15,000원"); // 초기값
    const bidAmount = ref('');
    const auctionId = 1; // 예시 ID
    const stompClient = ref(null);
    const isBidSuccess = ref(false); // 입찰 성공 효과를 위한 상태
    const timeRemaining = ref(''); // 경매 마감까지 남은 시간 표시
    let countdownInterval = null;  // setInterval을 저장할 변수
    const startPrice = ref("10,000원"); // 시작가

    //썸네일 이미지 데이터
    const productImages = ref([
        { id: 1, src: '/images/ww.png' },
        { id: 2, src: '/images/654.png' }, 
        { id: 3, src: '/images/hy.png' }, 
        { id: 4, src: '/images/hye.png' },  
        { id: 5, src: '/images/kr.png' },  
        { id: 6, src: '/images/sy.png' },
        { id: 7, src: '/images/wt.png' } 
    ]);
    //메인 썸네일 이미지 경로
    const mainImageSrc = ref(productImages.value[0].src);

    //경매 참여 모달 관련
    const isBidModalVisible = ref(false);
    const isBidHistoryVisible = ref(false);
    const bidHistory = ref([
      { amount: 16000, time: '2025.09.24 11:30:15' },
      { amount: 15000, time: '2025.09.24 10:25:41' }
    ]);

    // --- 함수 영역 ---

    const openBidModal = () => {
        isBidModalVisible.value = true;
    };

    const closeBidModal = () => {
        isBidModalVisible.value = false;
        isBidHistoryVisible.value = false; // 모달 닫을 때 기록도 닫기
    };

    const toggleBidHistory = () => {
        isBidHistoryVisible.value = !isBidHistoryVisible.value;
    };


    const parsePrice = (priceString) => {
        if (!priceString) return 0;
        return parseInt(priceString.replace(/[^\d]/g, ''), 10);
   };

    const quickBid = (amountToAdd) => {
        const currentNumericPrice = parsePrice(currentBidPrice.value);
        bidAmount.value = currentNumericPrice + amountToAdd;
    };

    const validateAndConfirmBid = () => {
        const newBid = parseInt(bidAmount.value, 10);
        const numericCurrentPrice = parsePrice(currentBidPrice.value);
        const numericStartPrice = parsePrice(startPrice.value);

        // 1. 빈 값 확인
        if (isNaN(newBid) || newBid <= 0) {
            alert("입찰 금액을 올바르게 입력해주세요.");
            return;
        }


        // 2. 100원 단위 확인
        if (newBid % 100 !== 0) {
            alert("입찰 금액은 100원 단위로 입력해야 합니다.");
            return;
        }
        
        // 3. 입찰가 비교
        // 입찰 기록이 없을 때 (첫 입찰)
        if (bidHistory.value.length === 0) {
            if (newBid <= numericStartPrice) {
                alert(`입찰 금액은 시작가(${startPrice.value})보다 높아야 합니다.`);
                return;
            }
        } else { // 입찰 기록이 있을 때
            if (newBid < numericCurrentPrice + 1000) {
                alert(`입찰 금액은 현재가(${currentBidPrice.value})보다 1,000원 이상 높아야 합니다.`);
                return;
            }
        }

        // 4. 최종 입찰 확인
        const isConfirmed = confirm(`${newBid.toLocaleString()}원 입찰하시겠습니까?`);
        if (isConfirmed) {
            sendBid();
        }
    };





    //썸네일 이미지 호버 효과
    const changeMainImage = (newSrc) => {
        mainImageSrc.value = newSrc;
    };

    // 경매 마감까지 남은 시간 계산 및 표시
    const startCountdown = () => {
        // 경매 마감 시간 설정 (HTML에 있는 값을 가져오거나 직접 입력)
        const endTimeString = document.getElementById('end-time').innerText;
        const endTime = new Date(endTimeString).getTime();

        countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = endTime - now;

            if (distance < 0) {
                clearInterval(countdownInterval);
                timeRemaining.value = "경매 종료";
                return;
            }

            // 시간 계산
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // 표시할 문자열 생성
            let remainingString = "";
            if (days > 0) remainingString += `${days}일 `;
            remainingString += `${hours}시간 ${minutes}분 ${seconds}초`;

            timeRemaining.value = remainingString;

        }, 1000); // 1초마다 실행
    };

    // WebSocket 연결 및 구독 설정
    const connect = () => {
        stompClient.value = new Client({
            webSocketFactory: () => {
                return new SockJS('http://localhost:8080/ws-auction'); //서버 Endpoint 연결
            },
            
            onConnect: (frame) =>{
                console.log('연결 성공' + frame);

                //특정 경매 상품 토픽 구독
                stompClient.value.subscribe(`/topic/auctions/${auctionId}`, (message) => {
                    const broadcast = JSON.parse(message.body);
                    console.log("새로운 입찰 수신:", broadcast);

                    // 화면의 현재 입찰가 업데이트
                    currentBidPrice.value = broadcast.newPrice.toLocaleString()+'원';

                    // 입찰 성공 효과 트리거
                    isBidSuccess.value = true;
                    setTimeout(() => {
                        isBidSuccess.value = false;
                    }, 500); // 0.5초 후 효과 제거
                });
            },

            //연결 오류 시
            onStompError: (frame) => {
                console.error('STOMP 오류: header ' + frame.headers['message']);
                console.error('STOMP 오류: body ' + frame.body);
            },

            
        });

        //stomep 클라이언트 활성화 (연결 시작)
        stompClient.value.activate();
    }

    // 입찰 금액 전송 함수
    const sendBid = () => {
        if (stompClient.value && stompClient.value.connected && bidAmount.value) {
            const bidData = {
                memberId: 1, // 예시 사용자 ID
                bidAmount: parseInt(bidAmount.value, 10)
            };

            // 서버로 입찰 메시지 전송
            stompClient.value.publish({
                destination: `/app/auctions/${auctionId}/bids`,
                body: JSON.stringify(bidData)
            });

            bidAmount.value = ''; // 입력창 비우기
            closeBidModal();
        }else{
            console.log("WebSocket이 연결되지 않았거나 입찰 금액이 비어 있습니다.");
        }
    };

    // 컴포넌트가 마운트되면 WebSocket 연결 시작
    onMounted(() => {
        connect();
        startCountdown();
    });

    // 컴포넌트가 언마운트되면 WebSocket 및 카운트다운 타이머 연결 해제
    onUnmounted(() => {
        if (stompClient.value) {
            stompClient.value.deactivate();
        }
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
    });
</script>

<style lang="scss" scoped>

    /* =============================================
    1. 기본 레이아웃 및 공통 스타일
    ============================================= */

    .container {
        max-width: 960px;
        margin-top: 30px;
    }

    .bordered-section {
        border: 2px solid #e9ecef; 
        border-radius: 12px;       
        padding: 25px;            
    }


    /* =============================================
    2. 좌측 - 상품 이미지 영역
    ============================================= */

    .product-image {
        max-width: 100%;
        height: 400px;
        border-radius: 8px;
        object-fit: contain; /* 이미지 비율 유지하며 컨테이너에 맞춤 */
    }

    .thumbnail-gallery {
        display: flex;
        gap: 10px; /* 썸네일 사이의 간격 */
        flex-wrap: wrap; /* 썸네일이 많아지면 다음 줄로 넘김 */
        min-height: 90px; 
        align-items: center;
    }

    .thumbnail-item {
        width: 80px;
        height: 80px;
        object-fit: cover; /* 이미지가 찌그러지지 않도록 비율 유지하며 채움 */
        border-radius: 4px;
        cursor: pointer;
        border: 2px solid transparent; /* 평소엔 투명한 테두리를 두어 active 시 레이아웃이 밀리는 현상 방지 */
        transition: all 0.2s ease-in-out;

        /* 마우스를 올렸을 때 스타일 */
        &:hover {
            transform: scale(1.05); /* 살짝 확대되는 효과 */
            border-color: #dc3545; /* 입찰 버튼과 동일한 색상으로 테두리 강조 */
        }

        /* 현재 활성화된(메인 이미지와 동일한) 썸네일 스타일 */
        &.active {
            border-color: #dc3545;
            box-shadow: 0 0 8px rgba(220, 53, 69, 0.5); /* 그림자 효과 */
        }
    }


    /* =============================================
    3. 우측 - 입찰 정보 영역
    ============================================= */

    .product-title-main {
        font-size: 1.75rem; 
    }

    .countdown-timer {
        text-align: center;
        padding: 15px;
        background-color: #f8f9fa; 
        border-radius: 8px;
        border: 2px solid #e9ecef;
    }

    .countdown-label {
        display: block;
        font-size: 1.1rem;
        color: #6c757d; 
        margin-bottom: 5px;
    }

    .countdown-time {
        font-size: 1.75rem;
        font-weight: 600;
        color: #343a40;
        letter-spacing: 1px; 
    }

    .bid-section-main {
        background-color: #f8f9fa;
        padding: 30px 20px;
        border-radius: 12px;
        border: 2px solid #e9ecef;
    }

    .current-bid-price-main {
        font-size: 3rem; 
        font-weight: bold;
        color: #dc3545;
        transition: color 0.3s, transform 0.3s;
    }

    /* 입찰 폼 관련 스타일 */
    .form-control-lg {
        padding: 0.8rem 1.2rem; 
        font-size: 1.1rem;   
    }

    .btn-lg {
        padding: 0.6rem 1.5rem;
        font-size: 1.1rem;
        margin-left: 8px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap; /* 글씨가 두 줄로 바뀌는 것을 방지 */
    }

    .input-group .form-control {
        border-top-right-radius: 0.375rem;
        border-bottom-right-radius: 0.375rem;
    }


    /* =============================================
    4. 하단 - 상세 정보 및 상품 설명
    ============================================= */

    /* 상세 정보 섹션 */
    .details-section {
        background-color: #fff;
        border: 2px solid #e9ecef;
        border-radius: 12px;
        padding: 25px 30px;
    }

    .details-title {
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid #e9ecef;
        font-size: 1.5rem;
        font-weight: 600;
    }

    .details-grid {
        display: grid;
        // 화면 너비에 따라 1~3개의 컬럼으로 자동 조절
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 15px 25px; // 세로, 가로 간격
    }

    .detail-item {
        display: flex;
        justify-content: space-between; // 이름과 값을 양쪽 끝으로
        align-items: center;
        padding: 10px 0;
        font-size: 1.1rem;
        color: #495057;

        // 값(value) 부분의 스타일
        span:last-child {
            color: #212529;
            font-weight: 500;
        }
    }

    /* 상품 설명 섹션 */
    .product-description {
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
    
        h5 {
            margin-bottom: 10px;
            font-size: 1.6rem;
        }

        p {
            font-size: 1.2rem;
            color: #495057;
            line-height: 1.6;
            margin-bottom: 0;
        }
    }

    /* =============================================
    5. 기타 - 입찰 애니메이션 효과
    ============================================= */

    .bid-success-effect {
        animation: flash-and-pulse 0.5s ease-out;
    }

    @keyframes flash-and-pulse {
        0% {
            transform: scale(1);
            color: #dc3545; /* 원래 색상 */
        }
        50% {
            transform: scale(1.5); /* 1.5배 커짐 */
            color: #ffc107; /* 성공 색상 (노란색) */
        }
        100% {
            transform: scale(1);
            color: #dc3545; /* 원래 색상으로 복귀 */
        }
    }

    /* =============================================
     6. 경매 참여 모달 창 스타일
     ============================================= */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background-color: white;
        padding: 30px 40px;
        border-radius: 12px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        width: 100%;
        max-width: 500px;
        position: relative;
        animation: slide-down 0.3s ease-out;
    }

    @keyframes slide-down {
        from {
            transform: translateY(-30px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .modal-close-btn {
        position: absolute;
        top: 15px;
        right: 20px;
        background: none;
        border: none;
        font-size: 2rem;
        color: #aaa;
        cursor: pointer;
        line-height: 1;
        &:hover {
            color: #333;
        }
    }
    
    .current-bid-modal {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        background-color: #f8f9fa;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 1.2rem;
        
        small {
            color: #6c757d;
        }
        span {
            font-weight: bold;
            font-size: 1.5rem;
            color: #dc3545;
        }
    }

    .bid-history-section {
        .btn-outline-secondary {
            text-align: left;
            padding: 10px 15px;
        }
    }

    .bid-history-log {
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 15px;
        max-height: 150px;
        overflow-y: auto;
        font-size: 0.95rem;
        color: #495057;

        p {
            margin-bottom: 8px;
            &:last-child {
                margin-bottom: 0;
            }
        }
    }

    .quick-bid-buttons {
        display: flex;
        gap: 10px; /* 버튼 사이 간격 */
        justify-content: flex-end; /* 버튼을 오른쪽으로 정렬 */
    }

</style>