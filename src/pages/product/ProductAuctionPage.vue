<template>
    <!-- 1. 데이터 로딩 상태 표시 -->
    <div v-if="isLoading" class="loading-container">
        <h2>경매 정보를 불러오는 중...</h2>
    </div>

    <!-- 2. 에러 발생 시 에러 메시지 표시 -->
    <div v-else-if="error" class="error-container">
        <h2>오류가 발생했습니다.</h2>
        <p>{{ error }}</p>
    </div>

    <!-- 3. 데이터 로드 완료 후 전체 화면 렌더링 -->
    <div v-else-if="auction" class="container">
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
                
                <h2 class="product-title-main mb-5"><strong>{{ auction.itemName }}</strong></h2>

                <!-- saleType에 따른 조건부 렌더링 -->
                <!-- Case 1: 경매 상품일 경우 ('AUCTION') -->
                <template v-if="isAuction">
                    <div class="countdown-timer mb-5">
                        <span class="countdown-label">경매 마감까지 남은 시간</span>
                        <span class="countdown-time">{{ timeRemaining }}</span>
                    </div>

                    <!-- 경매 진행 중일 때 UI -->
                    <template v-if="!isAuctionEnded">
                        <div class="bid-section-main text-center mb-5">
                            <h5 class="mb-3">현재 입찰가</h5>
                            <p v-if="hasBids" id="current-bid-price" :class="['current-bid-price-main', { 'bid-success-effect': isBidSuccess }]">
                                {{ formattedCurrentPrice }}
                            </p>
                            <div v-else class="no-bids-info">
                                <p class="no-bids-text">현재 입찰자가 없습니다.</p>
                                <p class="start-price-info">(시작가: {{ formattedStartPrice }})</p>
                            </div>
                        </div>
                        <button class="btn btn-danger btn-lg w-100" @click="openBidModal" :disabled="!userStore.isLoggedIn"
                            :title="!userStore.isLoggedIn ? '로그인이 필요합니다.' : '입찰에 참여하세요'">
                            {{ userStore.isLoggedIn ? '경매 참여하기' : '로그인 후 참여 가능' }}
                        </button>
                    </template>

                    <!-- 경매 종료 후 UI -->
                    <template v-else>
                        <!-- Case 1-2: 낙찰자이며, 결제 대기 중 (PENDING_PAYMENT) -->
                        <div v-if="userAuctionState === '결제 대기중'" class="text-center">
                            <div class="bid-section-main text-center mb-5">
                                <h5 class="mb-3" style="font-size: 1.5rem; color: #28a745;">🎉 축하드립니다! 🎉</h5>
                                <p class="current-bid-price-main" style="font-size: 1.8rem;">회원님이 낙찰하셨습니다.</p>
                            </div>
                            <button class="btn btn-primary btn-lg w-100" @click="goToPayment">
                                결제하기
                            </button>
                        </div>

                        <!-- Case 1-2: 미로그인 또는 미낙찰자 (USER) -->
                        <div v-else-if ="userAuctionState === 'USER'" class="text-center">
                             <div class="bid-section-main text-center mb-5">
                                <h5 class="mb-3">경매 종료</h5>
                                <p class="current-bid-price-main" style="font-size: 2rem;">낙찰에 실패하셨습니다.</p>
                            </div>
                            <button class="btn btn-secondary btn-lg w-100" disabled>
                                경매에 참여할 수 없습니다
                            </button>
                        </div>

                        
                        <!-- Case 1-3: 낙찰자이며, 결제 완료 이후  -->
                        <div v-else class="text-center">
                            <div class="bid-section-main text-center mb-5">
                                <h5 class="mb-3" style="font-size: 1.5rem; color: #28a745;">🎉 축하드립니다! 🎉</h5>
                                <p class="current-bid-price-main" style="font-size: 1.8rem;">회원님이 낙찰하셨습니다.</p>
                            </div>
                            <button class="btn btn-success btn-lg w-100" disabled>
                                {{userAuctionState}}
                            </button>
                        </div>

                    </template>
                </template>

                <!-- Case 2: 즉시 구매 상품일 경우 ('INSTANT_BUY') -->
                <template v-else-if="isInstantBuy">
                    <div class="countdown-timer mb-5">
                        <span class="countdown-label">판매 마감까지 남은 시간</span>
                        <span class="countdown-time">{{ timeRemaining }}</span>
                    </div>
                    <div class="bid-section-main text-center mb-5">
                        <h5 class="mb-3">즉시 구매가</h5>
                        <!-- 판매가 데이터 바인딩 -->
                        <p class="current-bid-price-main">{{ formattedStartPrice }}</p>
                    </div>
                    <!-- 로그인 상태에 따라 버튼 활성화/비활성화 -->
                    <button class="btn btn-primary btn-lg w-100" @click="purchaseNow" :disabled="!userStore.isLoggedIn"
                        :title="!userStore.isLoggedIn ? '로그인이 필요합니다.' : '즉시 구매하세요'">
                        {{ userStore.isLoggedIn ? '즉시 구매하기' : '로그인 후 구매 가능' }}
                    </button>
                </template>
            </div>
        </div>

        <div class="row mt-5">
            <div class="col-12">
                <div class="details-section">
                    <h3 class="details-title">상품 상세 정보</h3>
                    <div class="details-grid">
                        <div class="detail-item"><span><strong>카테고리</strong></span><span>{{ auction.categoryName }}</span></div>
                        <div class="detail-item"><span><strong>아티스트</strong></span><span>{{ auction.artistName }}</span></div>
                        <!-- albumTitle이 null이 아닐 경우에만 렌더링 -->
                        <div class="detail-item" v-if="auction.albumTitle"><span><strong>앨범</strong></span><span>{{ auction.albumTitle }}</span></div>
                        <div class="detail-item">
                            <span><strong>{{ isAuction ? '경매 시작' : '판매 시작' }}</strong></span><span>{{ formattedStartTime }}</span>
                        </div>
                        <div class="detail-item">
                            <span><strong>{{ isAuction ? '경매 마감' : '판매 마감' }}</strong></span><span>{{ formattedEndTime }}</span>
                        </div>
                        <div class="detail-item">
                            <span><strong>{{ isAuction ? '경매 시작가' : '판매가' }}</strong></span><span>{{ formattedStartPrice }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div class="row mt-5">
            <div class="col-12">
                <div class="product-description">
                    <h5><strong>상품 설명</strong></h5>
                    <p>{{ auction.itemDescription }}</p>
                </div>
            </div>
        </div>

        <div v-if="isAuction && isBidModalVisible" class="modal-overlay" @click.self="closeBidModal">
            <div class="modal-content">
                <button class="modal-close-btn" @click="closeBidModal">&times;</button>
                <h3>경매 참여</h3>
                <hr class="my-4">

                <div class="bid-history-section">
                    <button class="btn btn-outline-secondary w-100 mb-3" @click="toggleBidHistory">
                        지난 입찰 기록 보기 {{ isBidHistoryVisible ? '▼' : '▶' }}
                    </button>
                    <div v-if="isBidHistoryVisible" class="bid-history-log">
                        <!-- 데이터가 없을 때 메시지 표시 -->
                        <p v-if="!bidHistory || bidHistory.length === 0" class="text-muted text-center my-3">
                            입찰 기록이 없습니다.
                        </p>
                        <!-- bidHistory 배열을 순회하며 입찰 기록 표시 -->
                        <div v-else>
                            <p v-for="(bid, index) in bidHistory" :key="index">
                                {{ formatPrice(bid.bidAmount) }} - {{ formatDate(bid.bidAt) }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="current-bid-modal mb-3">
                    <small>현재 입찰가</small>
                    <span>{{ formattedCurrentPrice }}</span>
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
/* =============================================
 * 1. 임포트 (Import) & 초기 설정
 * ============================================= */
    import { ref, onMounted, onUnmounted, computed , watch} from 'vue';
    import { useRoute } from 'vue-router';
    import { getAuctionDetails, getAuctionWinnerStatus} from '@/api/auction';  //경매 관련 API 함수
    import { getBidsByAuctionId } from '@/api/bid';  //입찰 관련 API 함수
    import { useUserStore } from '@/stores/userStore';
    import { subscribe, unsubscribe, publish, disconnect, connect } from '@/services/websocketService';
    const route = useRoute();
    const userStore = useUserStore();
    const auctionId = route.params.id;

/* =============================================
* 2. 상태 (State)
* - API 데이터, 실시간 데이터, UI 제어용 데이터를 명확히 분리
* ============================================= */
    // --- API 데이터 상태 ---
    const auction = ref(null);
    const isLoading = ref(true);
    const error = ref(null);
    const bidHistory = ref([]);

    // --- 실시간 데이터 상태 ---
    const currentBidPrice = ref(0);
    const timeRemaining = ref('');
    let countdownInterval = null;

    // --- UI 제어 상태 ---
    const isBidModalVisible = ref(false);
    const bidAmount = ref('');
    const isBidSuccess = ref(false);
    const isBidHistoryVisible = ref(false);
    const userAuctionState = ref('USER'); // 경매 종료 후 유저 상태: PENDING_PAYMENT, PAID, USER
    const isAuctionEnded = ref(false); // 경매 종료 여부

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

/* =============================================
* 3. 계산된 속성 (Computed)
* - 상태를 기반으로 동적인 값을 계산
* ============================================= */
    const isAuction = computed(() => auction.value?.saleType === 'AUCTION');
    const isInstantBuy = computed(() => auction.value?.saleType === 'INSTANT_BUY');

    const hasBids = computed(()=> {
        if (!auction.value) return false;
        // 현재 입찰가와 시작가가 다르면 입찰이 진행된 것으로 간주
        return currentBidPrice.value !== auction.value.startPrice;
    })
    const formatPrice = (price) => price != null ? price.toLocaleString() + '원' : '가격 정보 없음';
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleString('ko-KR') : '';

    const endTimeMs = computed(() => {
        if (!auction.value?.endTime) return null;
        const dateObj = parseJavaLocalDateTime(auction.value.endTime);
        return dateObj ? dateObj.getTime() : null;
    });

    const formattedCurrentPrice = computed(() => {
        if (!auction.value) {
            return '';
        }

        // 1. 현재 입찰가(currentBidPrice)와 시작가(startPrice)가 같은지 비교.
        //    (백엔드에서 입찰이 없으면 currentPrice를 startPrice로 보내줌)
        if (currentBidPrice.value === auction.value.startPrice) {
            // 2. 같다면, 아직 입찰자가 없는 것이므로 안내 문구 반환.
            return `현재 입찰자가 없습니다. (시작가: ${formatPrice(auction.value.startPrice)})`;
        } else {
            // 3. 다르다면, 입찰이 진행된 것이므로 현재 입찰가를 포맷팅하여 반환합니다.
            return formatPrice(currentBidPrice.value);
        }
    });
    const formattedStartPrice = computed(() => formatPrice(auction.value?.startPrice));
    const formattedStartTime = computed(() => formatDate(parseJavaLocalDateTime(auction.value?.startTime)));
    const formattedEndTime = computed(() => formatDate(parseJavaLocalDateTime(auction.value?.endTime)));

/* =============================================
* 4. 메서드 (Methods) 영역
* ============================================= */

    /**
     *  API를 호출하여 경매/판매 상세 정보를 가져오고, 후속 작업을 시작
     */
    const fetchAuctionData = async () => {
        try {
            isLoading.value = true;
            const response = await getAuctionDetails(auctionId);
            auction.value = response.data;
            console.log(response.data);

            // 경매 종료 여부 초기 확인
            const endTime = parseJavaLocalDateTime(auction.value.endTime);
            if (endTime && new Date() > endTime) {
                isAuctionEnded.value = true;
            }

            if (isAuctionEnded.value) {
                // 경매가 종료된 경우, 유저의 낙찰 상태를 확인합니다.
                if (userStore.isLoggedIn && isAuction.value) {
                    try {
                        const statusResponse = await getAuctionWinnerStatus(auctionId, userStore.currentUser.memberId);
                        userAuctionState.value = getKoreanAuctionStatus(statusResponse.data); // 'PENDING_PAYMENT', 'PAID', 'USER'
                    } catch (e) {
                        console.error("낙찰자 상태 조회에 실패했습니다:", e);
                        userAuctionState.value = 'USER'; // 실패 시 기본값
                    }
                } else {
                    userAuctionState.value = 'USER'; // 비로그인 또는 경매 상품이 아님
                }
            } else {
                // 경매가 진행 중인 경우에만 WebSocket 구독 및 관련 데이터 로드
                if (isAuction.value) {
                    currentBidPrice.value = auction.value.currentPrice;
                    setupWebSocketSubscription();
                    fetchBidHistory(auctionId);
                }
            }
            
            startCountdown(); // 카운트다운은 항상 시작
        } catch (err) {
            error.value = "상품 정보를 불러오는 데 실패했습니다. 페이지를 새로고침해주세요.";
            console.error("Fetch auction data failed:", err);
        } finally {
            isLoading.value = false;
            console.log("fetchAuctionData 완료");
        }
    };

    function getKoreanAuctionStatus(status) {
        switch (status) {
            case 'PENDING_PAYMENT':
            return '결제 대기중';
            case 'PAID':
            return '결제 완료';
            case 'PREPARING_SHIPMENT':
            return '배송 준비중'; // '배송 대기중' 대신 더 명확한 표현을 사용했습니다.
            case 'SHIPPED':
            return '배송 중';
            case 'DELIVERED':
            return '배송 완료';
            case 'CONFIRMED':
            return '구매 확정';
            case 'CANCEL_REQUESTED':
            return '취소 요청';
            case 'CANCELLED':
            return '취소 완료';
            case 'REFUND_REQUESTED':
            return '환불 요청';
            case 'REFUNDED':
            return '환불 완료';
            case 'USER':
            return 'USER';
            default: 'USER';
            // 정의되지 않은 상태값이 들어올 경우를 대비해 기본값을 설정합니다.
            return status;
        }
    }

    // WebSocket을 통해 현재 경매의 실시간 입찰 토픽을 구독
    const setupWebSocketSubscription = () => {
        subscribe(`/topic/auctions/${auctionId}`, (message) => {
            const broadcast = JSON.parse(message.body);
            currentBidPrice.value = broadcast.newPrice;
            //새로운 입찰이 생기면 입찰 기록 갱신
        const newHistoryEntry = {
            bidAmount: broadcast.newPrice,
            bidAt: new Date()
        };
        bidHistory.value.unshift(newHistoryEntry);

            isBidSuccess.value = true;
            setTimeout(() => { isBidSuccess.value = false; }, 500);
        });
    };

    //watch 로 로그인 여부 감지
    // userStore의 'authToken' 상태를 감시(watch).
    // 로그인/로그아웃으로 인해 이 값이 변경될 때마다, 이 로직이 자동으로 실행.
    watch(
    () => userStore.authToken,
    (newToken) => {
        // [디버깅 로그] 토큰 변경 감지 시 로그를 출력하여 흐름 파악. 필요시 매개변수 newToken 옆에 oldToken 추가한다음 주석 해제
        //console.log(`Authentication token changed. Re-establishing WebSocket connection. Old token exists: ${!!oldToken}, New token exists: ${!!newToken}`);

        // 1. 기존 연결이 있다면 우선 안전하게 연결 종료.
        disconnect();

        // 2. 새로운 토큰 상태로 재연결.
        //    - 로그인 성공 시: newToken에 JWT가 담겨 '인증된' 연결.
        //    - 로그아웃 시: newToken은 null이 되어 '익명' 연결.
        connect(newToken);
    },
    {
        // immediate: true 옵션은 watch를 설정하는 즉시,
        // (컴포넌트가 로드될 때) 현재 값으로 한번 실행
        // 이를 통해 사용자가 페이지를 새로고침했을 때, localStorage에 남아있는
        // 토큰으로 초기 WebSocket 연결을 맺을 수 있습니다.
        immediate: true
    }
    );

    /**
     * 현재 경매의 지난 입찰 기록을 API로 조회
     */
    const fetchBidHistory = async (auctionId) => {
        try {
            const response = await getBidsByAuctionId(auctionId);
            bidHistory.value = response.data.map(bid => ({
                bidAmount: bid.bidAmount,
                bidAt: parseJavaLocalDateTime(bid.bidAt)
            }));
        } catch (err) {
            console.error("Failed to fetch bid history:", err);
        }
    };

    // 입찰 금액 서버로 전송 (로그인 상태 확인 포함)
    const sendBid = () => {
        if (!userStore.isLoggedIn) {
            alert("로그인이 필요한 기능입니다.");
            return;
        }

        const bidData = {
            memberId: userStore.currentUser.memberId,
            bidAmount: parseInt(bidAmount.value, 10),
        };

        // 중앙 websocketService의 발행 함수를 사용.
        publish({
            destination: `/app/auctions/${auctionId}/bids`,
            body: JSON.stringify(bidData)
        });

        bidAmount.value = '';
        closeBidModal();
    };

    /**
     *  즉시 구매 버튼 클릭 시 동작할 메서드
     */
    const purchaseNow = () => {
        if (!userStore.isLoggedIn) {
            alert("로그인이 필요한 기능입니다.");
            return;
        }
        // TODO: 즉시 구매 로직 구현 (결제 페이지로 이동)
        console.log("즉시 구매 시도");
    };

    /**
     * 낙찰 후 결제하기 버튼 클릭 시 동작
     */
    const goToPayment = () => {
        alert('Todo : 결제 페이지 이동');
    };

    const validateAndConfirmBid = () => {
        const newBid = parseInt(bidAmount.value, 10);
        const numericCurrentPrice = currentBidPrice.value;
        const numericStartPrice = auction.value.price;

        // 1. 빈 값 및 100원단위 확인
        if (isNaN(newBid) || newBid <= 0 || newBid % 100 !== 0) {
            alert("입찰 금액을 100원 단위의 올바른 숫자로 입력해주세요.");
            return;
        }

        // 2. 입찰가 비교
        // 입찰 기록이 없을 때 (첫 입찰)
        if (numericCurrentPrice === numericStartPrice) {
            if (newBid <= numericStartPrice) {
                alert(`입찰 금액은 시작가(${formattedStartPrice.value})보다 높아야 합니다.`);
                return;
            }
        } else { // 입찰 기록이 있을 때
            if (newBid < numericCurrentPrice + 1000) {
                alert(`입찰 금액은 현재가(${formattedCurrentPrice.value})보다 1,000원 이상 높아야 합니다.`);
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

    //Java LocalDateTime 배열을 JS Date 객체로 변환
    const parseJavaLocalDateTime = (dt) => {
        if (!Array.isArray(dt) || dt.length < 5) {
            return null; // 잘못된 형식의 데이터일 경우 null 반환
        }
        // [핵심] JavaScript의 Date 생성자는 월(month)을 0부터 시작하므로(0=1월), -1을 해줘야 함
        const [year, month, day, hour, minute, second = 0] = dt;
        return new Date(year, month - 1, day, hour, minute, second);
    };

    // 경매 마감까지 남은 시간 계산 및 표시
    const startCountdown = () => {
        if (!endTimeMs.value) return;

        countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = endTimeMs.value - now;

            if (distance < 0) {
                clearInterval(countdownInterval);
                timeRemaining.value = isAuction.value ? "경매 종료" : "판매 종료";
                isAuctionEnded.value = true; // 실시간으로 경매 종료 상태 업데이트
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            let remainingString = "";
            if (days > 0) remainingString += `${days}일 `;
            remainingString += `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            timeRemaining.value = remainingString;
        }, 1000);
    };

    //모달 ui 영역
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

    const quickBid = (amountToAdd) => {
 		 	bidAmount.value = currentBidPrice.value + amountToAdd;
 	  };

/* =============================================
* 5. 라이프사이클 훅 (Lifecycle Hooks)
* ============================================= */
    onMounted(() => {
        fetchAuctionData();
        console.log("페이지 마운트 됨");
    });

    // 컴포넌트가 언마운트되면 WebSocket 및 카운트다운 타이머 연결 해제
    onUnmounted(() => {
        // 컴포넌트를 떠날 때, 해당 페이지의 구독만 안전하게 취소합니다.
        // 경매가 진행 중인 상태에서만 구독을 취소합니다.
        if (isAuction.value && !isAuctionEnded.value) {
            unsubscribe(`/topic/auctions/${auctionId}`);
        }
        // 메모리 누수를 방지하기 위해 인터벌 정리
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        disconnect(); // 컴포넌트 언마운트 시 WebSocket 연결 종료
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

    .no-bids-info {
        padding: 1.2rem 0; 
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .no-bids-text {
        font-size: 1.3rem; 
        color: #6c757d;     
        font-weight: 500;
        margin-bottom: 0.25rem; 
    }

    .start-price-info {
        font-size: 1.4rem;
        color: #dc3545; 
        margin-bottom: 0;
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