<script setup>
import { defineProps, onMounted, ref } from 'vue'
import { getMyInquiryDetail } from '@/api/inquiry'

const props = defineProps({
  inquiryId: [String, Number]
});
const emit = defineEmits(['close']);

const detail = ref(null);
const loading = ref(false);

//날짜 포맷 문자열
const formatDate = (dateArray) => {
    if(!dateArray || dateArray.length < 5) return 'N/A';
    const [year, month, day, hour, minute] = dateArray;
    const date = new Date(year, month-1, day, hour, minute);
    const pad = (num) => String(num).padStart(2, '0');
    return `${year}.${pad(month)}.${pad(day)} ${pad(hour)}:${pad(minute)}`;
}

//status 한글화
function statusLabel(status) {
    if (!status) return '기타';
    const s = String(status).toUpperCase();
    switch (s) {
      case 'PENDING': return '답변대기';
      case 'IN_PROGRESS': return '처리중';
      case 'ON_HOLD': return '보류';
      case 'REJECTED': return '거절(스팸)';
      case 'ANSWERED': return '답변완료';
      default: return status;
    }
  }

  //class 변경
  function statusClass(status) {
    const s = (status || '').toString().toUpperCase();
    return {
      'badge-pending': s === 'PENDING',
      'badge-progress': s === 'IN_PROGRESS',
      'badge-hold': s === 'ON_HOLD',
      'badge-rejected': s === 'REJECTED',
      'badge-answered': s === 'ANSWERED'
    };
  }


onMounted(async () => {
    if (!props.inquiryId) return;
    loading.value = true;
    try {
        // 실제 API가 있으면 사용:
        const res = await getMyInquiryDetail(props.inquiryId);
        detail.value = res.data;
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
})

function close() {
    emit('close');
}
</script>

<template>
    <div class="inquiry-detail">
    <div class="detail-header">
        <h3 class="detail-title">문의 상세 내역</h3>
        <button class="close-button" @click="close">
            <i class="fas fa-times"></i>
        </button>
    </div>

    <!--로딩 상태-->
    <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>상세 정보를 불러오는 중입니다...</p>
    </div>

    <!--상세 정보 표시-->
    <div v-else-if="detail" class="detail-content-wrapper">
        <!--문의 기본 정보 카드-->
        <div class="info-card inquiry-info-card">
            <div class="card-header">
                <div class="header-left">
                    <span class="inquiry-number">문의 #{{ detail.inquiryId }}</span>
                    <span class="badge" :class="statusClass(detail.status)">{{ statusLabel(detail.status) }}</span>
                </div>
                <div class="inquiry-date">{{ formatDate(detail.inquiredAt) }}</div>
            </div>
            
            <h4 class="inquiry-title">{{ detail.title }}</h4>
            
            <div class="meta-info">
                <div class="meta-item">
                    <i class="fas fa-user"></i>
                    <span>{{ detail.inquiredByName }}</span>
                </div>
            </div>
                
            <div class="inquiry-content-section">
                <div class="content-box">
                    {{ detail.content }}
                </div>
            </div>
        </div>

        <!-- 첨부 파일 섹션 -->
        <div v-if="detail.attachmentUrls && detail.attachmentUrls.length > 0" class="attachment-section">
            <div class="attachment-header">
                <i class="fas fa-paperclip"></i>
                <span>첨부 파일 {{ detail.attachmentUrls.length }}개</span>
            </div>
            <ul class="attachment-list">
                <li v-for="(url, index) in detail.attachmentUrls" :key="index">
                    <a :href="url" target="_blank" class="attachment-link">
                        <i class="fas fa-file"></i>
                        <span class="file-name">{{ url.substring(url.lastIndexOf('/') + 1) }}</span>
                        <i class="fas fa-solid fa-eye"></i>
                    </a>
                </li>
            </ul>
        </div>

        <!-- 답변 정보 섹션 (답변이 있을 경우만 표시) -->
        <div v-if="detail.answerContent" class="info-card answer-card">
            <div class="answer-header">
                <div class="answer-header-left">
                    <i class="fas fa-check-circle"></i>
                    <h4 class="answer-title">관리자 답변</h4>
                </div>
                <div class="answer-date">{{ formatDate(detail.answeredAt) || '정보 없음' }}</div>
            </div>
            
            <div class="answer-meta">
                <i class="fas fa-user-shield"></i>
                <span>{{ detail.answeredByName || '정보 없음' }}</span>
            </div>
            
            <div class="answer-content-section">
                <div class="content-box answer-content-box">
                    {{ detail.answerContent }}
                </div>
            </div>
        </div>
        
        <div v-else class="pending-message">
            <div class="pending-icon">
                <i class="fas fa-clock"></i>
            </div>
            <p class="pending-text">답변 대기 중입니다</p>
            <p class="pending-subtext">답변이 완료되는 대로 알림을 통해 안내해 드리겠습니다</p>
        </div>    
    </div>
    
    <div v-else-if="!loading && !detail" class="not-found-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>요청하신 문의 정보를 찾을 수 없습니다</p>
    </div>
</div>
</template>

<style scoped>
.inquiry-detail {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
    max-width: 900px;
    margin: 0 auto;
    padding: 24px;
}

/* Header */
.detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
}

.detail-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
}

.close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    background: #f1f5f9;
    color: #64748b;
    transition: all 0.2s ease;
}

.close-button:hover {
    background: #e2e8f0;
    color: #334155;
}

/* Content Wrapper */
.detail-content-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* Info Card Base */
.info-card {
    padding: 24px;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.2s ease;
}

.info-card:hover {
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
}

/* Inquiry Card */
.inquiry-info-card {
    border-left: 4px solid #3b82f6;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 12px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.inquiry-number {
    font-size: 0.875rem;
    font-weight: 600;
    color: #3b82f6;
}

.inquiry-date {
    font-size: 0.875rem;
    color: #64748b;
}

.inquiry-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 16px 0;
    line-height: 1.4;
}

.meta-info {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.875rem;
    color: #475569;
}

.meta-item svg {
    color: #94a3b8;
    font-size: 14px;
}

/* Content Box */
.inquiry-content-section {
    margin-top: 20px;
}

.content-box {
    padding: 20px;
    background: #f8fafc;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    white-space: pre-wrap;
    color: #334155;
    font-size: 0.9375rem;
    line-height: 1.7;
}

/* Status Badge */
.badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.3px;
}

.badge-pending { 
    background: #fef3c7;
    color: #92400e;
}

.badge-progress { 
    background: #dbeafe;
    color: #1e40af;
}

.badge-hold { 
    background: #fed7aa;
    color: #9a3412;
}

.badge-rejected { 
    background: #fee2e2;
    color: #991b1b;
}

.badge-answered { 
    background: #d1fae5;
    color: #065f46;
}

/* Attachment Section */
.attachment-section {
    padding: 20px;
    background: #f8fafc;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
}

.attachment-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
    font-weight: 600;
    color: #475569;
    font-size: 0.9375rem;
}

.attachment-header svg {
    color: #64748b;
    font-size: 16px;
}

.attachment-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.attachment-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    color: #3b82f6;
    text-decoration: none;
    font-size: 0.875rem;
    transition: all 0.2s ease;
}

.attachment-link:hover {
    background: #f1f5f9;
    border-color: #3b82f6;
    transform: translateX(4px);
}

.file-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.download-icon {
    color: #94a3b8;
    flex-shrink: 0;
}

/* Answer Card */
.answer-card {
    border-left: 4px solid #10b981;
}

.answer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 12px;
}

.answer-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
}

.answer-header-left svg {
    color: #10b981;
    font-size: 18px;
}

.answer-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
}

.answer-date {
    font-size: 0.875rem;
    color: #64748b;
}

.answer-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.875rem;
    color: #475569;
    margin-bottom: 16px;
}

.answer-meta svg {
    color: #94a3b8;
    font-size: 13px;
}

.answer-content-section {
    margin-top: 16px;
}

.answer-content-box {
    background: #f0fdf4;
    border-color: #bbf7d0;
}

/* Pending Message */
.pending-message {
    text-align: center;
    padding: 48px 24px;
    background: #f8fafc;
    border: 2px dashed #cbd5e1;
    border-radius: 16px;
}

.pending-icon {
    display: inline-flex;
    margin-bottom: 16px;
    color: #64748b;
    font-size: 48px;
}

.pending-text {
    font-size: 1.125rem;
    font-weight: 600;
    color: #334155;
    margin: 0 0 8px 0;
}

.pending-subtext {
    font-size: 0.9375rem;
    color: #64748b;
    margin: 0;
}

/* Not Found Message */
.not-found-message {
    text-align: center;
    padding: 60px 24px;
    color: #ef4444;
}

.not-found-message i {
    font-size: 48px;
    margin-bottom: 16px;
    display: block;
}

.not-found-message p {
    font-size: 1.125rem;
    font-weight: 500;
    margin: 0;
}

/* Loading State */
.loading-state {
    text-align: center;
    padding: 60px 24px;
}

.loading-state p {
    margin-top: 16px;
    font-size: 1rem;
    color: #64748b;
}

.spinner {
    display: inline-block;
    width: 40px;
    height: 40px;
    border: 4px solid #e2e8f0;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
    .inquiry-detail {
        padding: 16px;
    }
    
    .detail-title {
        font-size: 1.375rem;
    }
    
    .inquiry-title {
        font-size: 1.25rem;
    }
    
    .info-card {
        padding: 20px;
    }
    
    .card-header,
    .answer-header {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>