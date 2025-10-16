# API Documentation

## Inquiry API (사용자)

### 1. 1:1 문의 등록
- **URL:** `POST /api/cs/inquiry`
- **설명:** 새로운 1:1 문의를 등록합니다. 문의 내용은 요청 본문에 담아 전송해야 합니다.
- **요청 본문:** `InquiryCreateRequest`
    - `csTypeId`: `int` (필수, 문의 유형 ID: 1: 배송, 2: 결제, 3: 기타, 4: 상품, 5: 환불/반품, 6: 판매)
    - `title`: `String` (필수, 최대 100자)
    - `content`: `String` (필수, 최대 2000자)
- **응답:** `InquirySummaryResponse`
    - `inquiryId`: `int`
    - `title`: `String`
    - `content`: `String`
    - `inquiredByName`: `String`
    - `status`: `InquiryStatus` (Enum)
    - `inquiredAt`: `LocalDateTime`
    - `answerContent`: `String`
    - `answeredByName`: `String`
    - `csType`: `String`
- **상태 코드:**
    - `201 Created`: 문의 등록 성공
    - `400 Bad Request`: 잘못된 요청 데이터
    - `401 Unauthorized`: 인증되지 않은 사용자

### 2. 1:1 문의 파일 첨부
- **URL:** `POST /api/cs/inquiry/{inquiryId}/attachments`
- **설명:** 특정 1:1 문의에 파일을 첨부합니다.
- **Path Variable:** `inquiryId` (int) - 파일을 첨부할 문의의 ID
- **요청 파라미터:** `files` (List<MultipartFile>) - 첨부할 파일 목록
- **Content-Type:** `multipart/form-data`
- **응답:** `Void`
- **상태 코드:**
    - `200 OK`: 파일 첨부 성공
    - `401 Unauthorized`: 인증되지 않은 사용자
    - `404 Not Found`: 존재하지 않는 문의

### 3. 나의 1:1 문의 목록 조회
- **URL:** `GET /api/cs/inquiry`
- **설명:** 현재 로그인한 사용자가 작성한 1:1 문의 목록을 페이징하여 조회합니다.
- **요청 파라미터:** `page`, `size`, `sort` (페이징 정보)
- **응답:** `Page<InquirySummaryResponse>`
    - `inquiryId`: `int`
    - `title`: `String`
    - `content`: `String`
    - `inquiredByName`: `String`
    - `status`: `InquiryStatus` (Enum)
    - `inquiredAt`: `LocalDateTime`
    - `answerContent`: `String`
    - `answeredByName`: `String`
    - `csType`: `String`
- **상태 코드:**
    - `200 OK`: 목록 조회 성공
    - `401 Unauthorized`: 인증되지 않은 사용자

### 4. 나의 1:1 문의 상세 조회
- **URL:** `GET /api/cs/inquiry/{inquiryId}`
- **설명:** 나의 특정 1:1 문의 상세 내용을 조회합니다.
- **Path Variable:** `inquiryId` (int) - 조회할 문의의 ID
- **응답:** `InquiryDetailUserResponse`
    - `inquiryId`: `int`
    - `title`: `String`
    - `content`: `String`
    - `inquiredByName`: `String`
    - `status`: `InquiryStatus` (Enum)
    - `inquiredAt`: `LocalDateTime`
    - `answerContent`: `String`
    - `answeredByName`: `String`
    - `answeredAt`: `LocalDateTime`
    - `attachmentUrls`: `List<String>`
- **상태 코드:**
    - `200 OK`: 상세 조회 성공
    - `401 Unauthorized`: 인증되지 않은 사용자
    - `404 Not Found`: 존재하지 않는 문의

## Inquiry API (관리자)

### 1. 1:1 문의 목록 조회 (검색)
- **URL:** `GET /api/admin/cs/inquiry`
- **설명:** 1:1 문의 목록을 검색 조건에 따라 페이징하여 조회합니다.
- **요청 파라미터:** `InquirySearchCondition`
    - `status`: `InquiryStatus` (Enum, 검색할 문의 답변 상태: PENDING, COMPLETED)
    - `csTypeId`: `Integer` (검색할 문의 유형 ID)
    - `memberName`: `String` (검색할 작성자 이름, 부분 일치)
- **응답:** `Page<InquirySummaryResponse>`
    - `inquiryId`: `int`
    - `title`: `String`
    - `content`: `String`
    - `inquiredByName`: `String`
    - `status`: `InquiryStatus` (Enum)
    - `inquiredAt`: `LocalDateTime`
    - `answerContent`: `String`
    - `answeredByName`: `String`
    - `csType`: `String`
- **상태 코드:**
    - `200 OK`: 목록 조회 성공
    - `401 Unauthorized`: 인증되지 않은 사용자 또는 권한 없음

### 2. 1:1 문의 상세 조회 (관리자)
- **URL:** `GET /api/admin/cs/inquiry/{inquiryId}`
- **설명:** 특정 1:1 문의의 상세 내용을 관리자용으로 조회합니다.
- **Path Variable:** `inquiryId` (int) - 조회할 문의의 ID
- **응답:** `InquiryDetailAdminResponse`
    - `inquiryId`: `int`
    - `title`: `String`
    - `content`: `String`
    - `inquiredByName`: `String`
    - `status`: `InquiryStatus` (Enum)
    - `inquiredAt`: `LocalDateTime`
    - `answerContent`: `String`
    - `answeredByName`: `String`
    - `answeredAt`: `LocalDateTime`
    - `attachmentUrls`: `List<String>`
    - `comment`: `String` (관리자용 메모)
    - `csType`: `CsType` (Enum)
- **상태 코드:**
    - `200 OK`: 상세 조회 성공
    - `401 Unauthorized`: 인증되지 않은 사용자 또는 권한 없음
    - `404 Not Found`: 존재하지 않는 문의

### 3. 1:1 문의 답변 등록 및 상태 변경
- **URL:** `PATCH /api/admin/cs/inquiry/{inquiryId}/answer`
- **설명:** 특정 1:1 문의에 답변을 등록하고 처리 상태를 변경합니다.
- **Path Variable:** `inquiryId` (int) - 답변할 문의의 ID
- **요청 본문:** `InquiryAnswerRequest`
    - `answerContent`: `String` (필수, 답변 내용)
    - `reqStatus`: `InquiryStatus` (Enum, 변경할 상태)
    - `comment`: `String` (관리자용 메모)
- **응답:** `InquiryDetailAdminResponse`
    - `inquiryId`: `int`
    - `title`: `String`
    - `content`: `String`
    - `inquiredByName`: `String`
    - `status`: `InquiryStatus` (Enum)
    - `inquiredAt`: `LocalDateTime`
    - `answerContent`: `String`
    - `answeredByName`: `String`
    - `answeredAt`: `LocalDateTime`
    - `attachmentUrls`: `List<String>`
    - `comment`: `String` (관리자용 메모)
    - `csType`: `CsType` (Enum)
- **상태 코드:**
    - `200 OK`: 답변 등록 및 상태 변경 성공
    - `400 Bad Request`: 잘못된 요청 데이터
    - `401 Unauthorized`: 인증되지 않은 사용자 또는 권한 없음
    - `404 Not Found`: 존재하지 않는 문의

### 4. 1:1 문의 통계 조회 (관리자)
- **URL:** `GET /api/admin/cs/inquiry/stats`
- **설명:** 관리자 대시보드에 필요한 문의 통계 정보를 조회합니다. (상태별 개수)
- **응답:** `InquiryStatsAdminResponse`
    - `pending`: `long` (답변 대기 중인 총 문의 건수)
    - `inProgress`: `long` (처리 중인 총 문의 건수)
    - `onHold`: `long` (보류 중인 총 문의 건수)
    - `answered`: `long` (답변 완료된 총 문의 건수)
    - `rejected`: `long` (거절된 총 문의 건수)
    - `total`: `long` (전체 문의 건수)
- **상태 코드:**
    - `200 OK`: 통계 조회 성공
    - `401 Unauthorized`: 인증되지 않은 사용자 또는 권한 없음

## FAQ API (사용자)

### 1. FAQ 목록 조회 (검색)
- **URL:** `GET /api/cs/faq`
- **설명:** 공개된 FAQ 목록을 검색 조건에 따라 페이징하여 조회합니다.
- **요청 파라미터:** `FaqSearchRequest`
    - `csTypeId`: `Integer` (카테고리 ID로 검색)
    - `keyword`: `String` (제목 또는 내용에 포함된 키워드)
    - `status`: `CsStatus` (Enum)
- **응답:** `Page<FaqResponse>`
    - `faqId`: `int`
    - `csType`: `String`
    - `title`: `String`
    - `content`: `String`
    - `status`: `CsStatus` (Enum)
    - `createdBy`: `String`
    - `createdAt`: `LocalDateTime`
    - `modifiedBy`: `String`
    - `updatedAt`: `LocalDateTime`
    - `attachmentUrls`: `List<String>`
- **상태 코드:**
    - `200 OK`: 목록 조회 성공

## FAQ API (관리자)

### 1. 신규 FAQ 등록
- **URL:** `POST /api/admin/cs/faq`
- **설명:** 새로운 FAQ를 시스템에 등록합니다.
- **요청 본문:** `FaqCreateRequest`
    - `csTypeId`: `int`
    - `title`: `String`
    - `content`: `String`
- **응답:** `FaqResponse`
    - `faqId`: `int`
    - `csType`: `String`
    - `title`: `String`
    - `content`: `String`
    - `status`: `CsStatus` (Enum)
    - `createdBy`: `String`
    - `createdAt`: `LocalDateTime`
    - `modifiedBy`: `String`
    - `updatedAt`: `LocalDateTime`
    - `attachmentUrls`: `List<String>`
- **상태 코드:**
    - `201 Created`: FAQ 생성 성공
    - `400 Bad Request`: 잘못된 요청 데이터

### 2. FAQ 파일 첨부
- **URL:** `POST /api/admin/cs/faq/{faqId}/attachments`
- **설명:** 특정 FAQ에 파일을 첨부합니다.
- **Path Variable:** `faqId` (int) - 파일을 첨부할 FAQ의 ID
- **요청 파라미터:** `files` (List<MultipartFile>) - 첨부할 파일 목록
- **Content-Type:** `multipart/form-data`
- **응답:** `Void`
- **상태 코드:**
    - `200 OK`: 파일 첨부 성공
    - `404 Not Found`: FAQ를 찾을 수 없음

### 3. FAQ 내용 수정
- **URL:** `PATCH /api/admin/cs/faq/{faqId}`
- **설명:** 특정 FAQ의 제목, 내용, 상태 등을 수정합니다.
- **Path Variable:** `faqId` (int) - 수정할 FAQ의 ID
- **요청 본문:** `FaqUpdateRequest`
    - `csTypeId`: `int`
    - `title`: `String`
    - `content`: `String`
    - `status`: `CsStatus` (Enum)
- **응답:** `FaqResponse`
    - `faqId`: `int`
    - `csType`: `String`
    - `title`: `String`
    - `content`: `String`
    - `status`: `CsStatus` (Enum)
    - `createdBy`: `String`
    - `createdAt`: `LocalDateTime`
    - `modifiedBy`: `String`
    - `updatedAt`: `LocalDateTime`
    - `attachmentUrls`: `List<String>`
- **상태 코드:**
    - `200 OK`: FAQ 수정 성공
    - `400 Bad Request`: 잘못된 요청 데이터
    - `404 Not Found`: FAQ를 찾을 수 없음

### 4. FAQ 삭제
- **URL:** `DELETE /api/admin/cs/faq/{faqId}`
- **설명:** 특정 FAQ를 시스템에서 삭제합니다.
- **Path Variable:** `faqId` (int) - 삭제할 FAQ의 ID
- **응답:** `Void`
- **상태 코드:**
    - `204 No Content`: FAQ 삭제 성공
    - `404 Not Found`: FAQ를 찾을 수 없음

### 5. FAQ 목록 동적 검색 (관리자)
- **URL:** `GET /api/admin/cs/faq`
- **설명:** 다양한 조건으로 FAQ 목록을 검색합니다.
- **요청 파라미터:** `FaqSearchRequest`
    - `csTypeId`: `Integer` (카테고리 ID로 검색)
    - `keyword`: `String` (제목 또는 내용에 포함된 키워드)
    - `status`: `CsStatus` (Enum)
- **응답:** `Page<FaqResponse>`
    - `faqId`: `int`
    - `csType`: `String`
    - `title`: `String`
    - `content`: `String`
    - `status`: `CsStatus` (Enum)
    - `createdBy`: `String`
    - `createdAt`: `LocalDateTime`
    - `modifiedBy`: `String`
    - `updatedAt`: `LocalDateTime`
    - `attachmentUrls`: `List<String>`
- **상태 코드:**
    - `200 OK`: 목록 조회 성공

### 6. FAQ 상세 정보 조회
- **URL:** `GET /api/admin/cs/faq/{faqId}`
- **설명:** 특정 FAQ의 상세 정보를 조회합니다.
- **Path Variable:** `faqId` (int) - 조회할 FAQ의 ID
- **응답:** `FaqResponse`
    - `faqId`: `int`
    - `csType`: `String`
    - `title`: `String`
    - `content`: `String`
    - `status`: `CsStatus` (Enum)
    - `createdBy`: `String`
    - `createdAt`: `LocalDateTime`
    - `modifiedBy`: `String`
    - `updatedAt`: `LocalDateTime`
    - `attachmentUrls`: `List<String>`
- **상태 코드:**
    - `200 OK`: 조회 성공
    - `404 Not Found`: FAQ를 찾을 수 없음

### 7. FAQ 통계 조회 (관리자)
- **URL:** `GET /api/admin/cs/faq/stats`
- **설명:** 관리자 대시보드에 필요한 FAQ 통계 정보를 조회합니다. (상태별 개수)
- **응답:** `FaqStatsAdminResponse`
    - `draft`: `long` (임시저장 상태의 FAQ 건수)
    - `active`: `long` (활성 상태의 FAQ 건수)
    - `pinned`: `long` (상단고정 상태의 FAQ 건수)
    - `inactive`: `long` (비활성 상태의 FAQ 건수)
    - `total`: `long` (전체 FAQ 건수)
- **상태 코드:**
    - `200 OK`: 통계 조회 성공
    - `401 Unauthorized`: 인증되지 않은 사용자 또는 권한 없음

## 공지사항 API (사용자)

### 1. 공지사항 목록 조회 (검색)
- **URL:** `GET /api/cs/notices`
- **설명:** 공개된(ACTIVE, PINNED) 공지사항 목록을 검색 조건에 따라 페이징하여 조회합니다.
- **요청 파라미터:** `NoticeSearchRequest`
    - `csTypeId`: `Integer`
    - `keyword`: `String`
    - `status`: `CsStatus` (Enum)
- **응답:** `Page<NoticeSummaryResponse>`
    - `noticeId`: `int`
    - `csType`: `String`
    - `title`: `String`
    - `status`: `CsStatus` (Enum)
    - `createdBy`: `String`
    - `createdAt`: `LocalDateTime`
- **상태 코드:**
    - `200 OK`: 목록 조회 성공

## 공지사항 API (관리자)

### 1. 공지사항 목록 조회 (관리자)
- **URL:** `GET /api/admin/cs/notices`
- **설명:** 모든 공지사항 목록을 검색 조건에 따라 페이징하여 조회합니다.
- **요청 파라미터:** `NoticeSearchRequest`
    - `csTypeId`: `Integer`
    - `keyword`: `String`
    - `status`: `CsStatus` (Enum)
- **응답:** `Page<NoticeSummaryResponse>`
    - `noticeId`: `int`
    - `csType`: `String`
    - `title`: `String`
    - `status`: `CsStatus` (Enum)
    - `createdBy`: `String`
    - `createdAt`: `LocalDateTime`
- **상태 코드:**
    - `200 OK`: 목록 조회 성공

### 2. 신규 공지사항 등록
- **URL:** `POST /api/admin/cs/notices`
- **설명:** 새로운 공지사항을 등록합니다. 'status' 필드를 통해 상태(DRAFT, ACTIVE, PINNED, INACTIVE)를 지정할 수 있으며, 생략 시 기본값은 DRAFT 입니다.
- **요청 본문:** `NoticeCreateRequest`
    - `csTypeId`: `int` (필수)
    - `title`: `String` (필수)
    - `content`: `String` (필수)
    - `status`: `CsStatus` (Enum, 기본값: DRAFT)
- **응답:** `NoticeDetailResponse`
    - `noticeId`: `int`
    - `csType`: `String`
    - `title`: `String`
    - `content`: `String`
    - `status`: `CsStatus` (Enum)
    - `createdBy`: `String`
    - `createdAt`: `LocalDateTime`
    - `updatedBy`: `String`
    - `updatedAt`: `LocalDateTime`
    - `attachmentUrls`: `List<String>`
- **상태 코드:**
    - `201 Created`: 등록 성공
    - `400 Bad Request`: 잘못된 요청 데이터

### 3. 공지사항 수정
- **URL:** `PATCH /api/admin/cs/notices/{noticeId}`
- **설명:** 특정 공지사항의 내용을 수정합니다.
- **Path Variable:** `noticeId` (int) - 수정할 공지사항의 ID
- **요청 본문:** `NoticeUpdateRequest`
    - `csTypeId`: `int` (필수)
    - `title`: `String` (필수)
    - `content`: `String` (필수)
    - `status`: `CsStatus` (Enum)
- **응답:** `NoticeDetailResponse`
    - `noticeId`: `int`
    - `csType`: `String`
    - `title`: `String`
    - `content`: `String`
    - `status`: `CsStatus` (Enum)
    - `createdBy`: `String`
    - `createdAt`: `LocalDateTime`
    - `updatedBy`: `String`
    - `updatedAt`: `LocalDateTime`
    - `attachmentUrls`: `List<String>`
- **상태 코드:**
    - `200 OK`: 수정 성공
    - `400 Bad Request`: 잘못된 요청 데이터
    - `404 Not Found`: 존재하지 않는 공지사항

### 4. 공지사항 삭제
- **URL:** `DELETE /api/admin/cs/notices/{noticeId}`
- **설명:** 특정 공지사항을 삭제합니다.
- **Path Variable:** `noticeId` (int) - 삭제할 공지사항의 ID
- **응답:** `Void`
- **상태 코드:**
    - `204 No Content`: 삭제 성공
    - `404 Not Found`: 존재하지 않는 공지사항

### 5. 공지사항 상세 조회 (관리자)
- **URL:** `GET /api/admin/cs/notices/{noticeId}`
- **설명:** 특정 공지사항의 상세 정보를 조회합니다. 사용자용 API와 동일한 기능을 수행합니다.
- **Path Variable:** `noticeId` (int) - 조회할 공지사항의 ID
- **응답:** `NoticeDetailResponse`
    - `noticeId`: `int`
    - `csType`: `String`
    - `title`: `String`
    - `content`: `String`
    - `status`: `CsStatus` (Enum)
    - `createdBy`: `String`
    - `createdAt`: `LocalDateTime`
    - `updatedBy`: `String`
    - `updatedAt`: `LocalDateTime`
    - `attachmentUrls`: `List<String>`
- **상태 코드:**
    - `200 OK`: 상세 조회 성공
    - `404 Not Found`: 존재하지 않는 공지사항

### 6. 공지사항 파일 첨부
- **URL:** `POST /api/admin/cs/notices/{noticeId}/attachments`
- **설명:** 특정 공지사항에 파일을 첨부합니다.
- **Path Variable:** `noticeId` (int) - 파일을 첨부할 공지사항의 ID
- **요청 파라미터:** `files` (List<MultipartFile>) - 첨부할 파일 목록
- **Content-Type:** `multipart/form-data`
- **응답:** `Void`
- **상태 코드:**
    - `200 OK`: 파일 첨부 성공
    - `404 Not Found`: 존재하지 않는 공지사항

### 7. 공지사항 통계 조회 (관리자)
- **URL:** `GET /api/admin/cs/notices/stats`
- **설명:** 관리자 대시보드에 필요한 공지사항 통계 정보를 조회합니다. (상태별 개수)
- **응답:** `NoticeStatsAdminResponse`
    - `draft`: `long` (임시저장 상태의 공지사항 건수)
    - `active`: `long` (활성 상태의 공지사항 건수)
    - `pinned`: `long` (상단고정 상태의 공지사항 건수)
    - `inactive`: `long` (비활성 상태의 공지사항 건수)
    - `total`: `long` (전체 공지사항 건수)
- **상태 코드:**
    - `200 OK`: 통계 조회 성공
    - `401 Unauthorized`: 인증되지 않은 사용자 또는 권한 없음

## 환불/반품 API (사용자)

### 1. 새로운 환불/반품 요청
- **URL:** `POST /api/returns`
- **설명:** 새로운 환불/반품을 요청합니다. 요청 본문에 주문 ID, 환불 사유 등을 담아 전송해야 합니다.
- **요청 본문:** `ReturnCreateRequest`
    - `orderId`: `String` (필수)
    - `reason`: `ReturnReason` (Enum, 필수)
    - `detailReason`: `String` (최대 2000자)
- **응답:** `ReturnDetailResponse`
    - `returnRequestId`: `int`
    - `orderId`: `int`
    - `reason`: `ReturnReason` (Enum)
    - `detailReason`: `String`
    - `status`: `ReturnStatus` (Enum)
    - `finalRefundAmount`: `BigDecimal`
    - `requestedAt`: `LocalDateTime`
    - `completedAt`: `LocalDateTime`
    - `attachmentUrls`: `List<String>`
    - `statusHistories`: `List<ReturnHistoryResponse>`
        - `previousStatus`: `ReturnStatus` (Enum)
        - `newStatus`: `ReturnStatus` (Enum)
        - `updatedBy`: `String`
        - `updatedAt`: `LocalDateTime`
        - `memo`: `String`
- **상태 코드:**
    - `201 Created`: 요청 성공

### 2. 환불/반품 요청에 증빙 자료 첨부
- **URL:** `POST /api/returns/{returnRequestId}/attachments`
- **설명:** 특정 환불/반품 요청에 증빙 자료(파일)를 첨부합니다.
- **Path Variable:** `returnRequestId` (int) - 파일을 첨부할 환불/반품 요청의 ID
- **요청 파라미터:** `files` (List<MultipartFile>) - 첨부할 파일 목록
- **Content-Type:** `multipart/form-data`
- **응답:** `Void`
- **상태 코드:**
    - `200 OK`: 파일 첨부 성공

### 3. 나의 환불/반품 요청 목록 조회
- **URL:** `GET /api/returns`
- **설명:** 현재 로그인한 사용자의 환불/반품 요청 목록을 페이징하여 조회합니다.
- **요청 파라미터:** `page`, `size`, `sort` (페이징 정보)
- **응답:** `Page<ReturnSummaryResponse>`
    - `returnRequestId`: `int`
    - `orderId`: `int`
    - `buyerName`: `String`
    - `status`: `ReturnStatus` (Enum)
    - `requestedAt`: `LocalDateTime`
- **상태 코드:**
    - `200 OK`: 목록 조회 성공

### 4. 나의 환불/반품 요청 상세 조회
- **URL:** `GET /api/returns/{returnRequestId}`
- **설명:** 나의 특정 환불/반품 요청 상세 정보를 조회합니다.
- **Path Variable:** `returnRequestId` (int) - 조회할 환불/반품 요청의 ID
- **응답:** `ReturnDetailResponse`
    - `returnRequestId`: `int`
    - `orderId`: `int`
    - `reason`: `ReturnReason` (Enum)
    - `detailReason`: `String`
    - `status`: `ReturnStatus` (Enum)
    - `finalRefundAmount`: `BigDecimal`
    - `requestedAt`: `LocalDateTime`
    - `completedAt`: `LocalDateTime`
    - `attachmentUrls`: `List<String>`
    - `statusHistories`: `List<ReturnHistoryResponse>`
        - `previousStatus`: `ReturnStatus` (Enum)
        - `newStatus`: `ReturnStatus` (Enum)
        - `updatedBy`: `String`
        - `updatedAt`: `LocalDateTime`
        - `memo`: `String`
- **상태 코드:**
    - `200 OK`: 상세 조회 성공

### 5. 환불/반품 요청 철회
- **URL:** `PATCH /api/returns/{returnRequestId}/cancel`
- **설명:** 사용자가 직접 자신의 환불/반품 요청을 철회합니다. 요청이 처리 중(IN_PROGRESS) 상태가 되기 전에만 철회할 수 있습니다.
- **Path Variable:** `returnRequestId` (int) - 철회할 환불/반품 요청의 ID
- **응답:** `Void`
- **상태 코드:**
    - `204 No Content`: 철회 성공

## 환불/반품 API (관리자)

### 1. 관리자가 환불/반품 요청 생성
- **URL:** `POST /api/admin/returns`
- **설명:** 관리자가 사용자를 대신하여 환불/반품 요청을 생성합니다. 고객센터를 통해 접수된 건 등을 관리자가 직접 시스템에 등록할 때 사용됩니다.
- **요청 본문:** `ReturnAdminCreateRequest`
    - `orderId`: `String` (필수)
    - `memberId`: `int` (필수)
    - `reason`: `ReturnReason` (Enum, 필수)
    - `detailReason`: `String`
- **응답:** `ReturnAdminResponse`
    - `returnRequestId`: `int`
    - `orderId`: `int`
    - `buyerName`: `String`
    - `createdBy`: `String`
    - `updatedBy`: `String`
    - `reason`: `ReturnReason` (Enum)
    - `detailReason`: `String`
    - `status`: `ReturnStatus` (Enum)
    - `originalPaymentAmount`: `BigDecimal`
    - `deductedShippingFee`: `BigDecimal`
    - `finalRefundAmount`: `BigDecimal`
    - `rejectReason`: `String`
    - `comment`: `String`
    - `requestedAt`: `LocalDateTime`
    - `completedAt`: `LocalDateTime`
    - `attachmentUrls`: `List<String>`
    - `statusHistories`: `List<ReturnHistoryResponse>`
        - `previousStatus`: `ReturnStatus` (Enum)
        - `newStatus`: `ReturnStatus` (Enum)
        - `updatedBy`: `String`
        - `updatedAt`: `LocalDateTime`
        - `memo`: `String`
- **상태 코드:**
    - `201 Created`: 요청 성공

### 2. 환불/반품 요청 목록 검색
- **URL:** `GET /api/admin/returns`
- **설명:** 환불/반품 요청 목록을 검색 조건에 따라 페이징하여 조회합니다.
- **요청 파라미터:** `ReturnSearchRequest`
    - `status`: `ReturnStatus` (Enum)
    - `buyerName`: `String`
- **응답:** `Page<ReturnSummaryResponse>`
    - `returnRequestId`: `int`
    - `orderId`: `int`
    - `buyerName`: `String`
    - `status`: `ReturnStatus` (Enum)
    - `requestedAt`: `LocalDateTime`
- **상태 코드:**
    - `200 OK`: 목록 조회 성공

### 3. 특정 환불/반품 요청 상세 조회
- **URL:** `GET /api/admin/returns/{returnRequestId}`
- **설명:** 특정 환불/반품 요청의 상세 정보를 조회합니다.
- **Path Variable:** `returnRequestId` (int) - 조회할 환불/반품 요청의 ID
- **응답:** `ReturnAdminResponse`
    - `returnRequestId`: `int`
    - `orderId`: `int`
    - `buyerName`: `String`
    - `createdBy`: `String`
    - `updatedBy`: `String`
    - `reason`: `ReturnReason` (Enum)
    - `detailReason`: `String`
    - `status`: `ReturnStatus` (Enum)
    - `originalPaymentAmount`: `BigDecimal`
    - `deductedShippingFee`: `BigDecimal`
    - `finalRefundAmount`: `BigDecimal`
    - `rejectReason`: `String`
    - `comment`: `String`
    - `requestedAt`: `LocalDateTime`
    - `completedAt`: `LocalDateTime`
    - `attachmentUrls`: `List<String>`
    - `statusHistories`: `List<ReturnHistoryResponse>`
        - `previousStatus`: `ReturnStatus` (Enum)
        - `newStatus`: `ReturnStatus` (Enum)
        - `updatedBy`: `String`
        - `updatedAt`: `LocalDateTime`
        - `memo`: `String`
- **상태 코드:**
    - `200 OK`: 상세 조회 성공

### 4. 환불/반품 요청 상태 변경 및 업데이트
- **URL:** `PATCH /api/admin/returns/{returnRequestId}`
- **설명:** 특정 환불/반품 요청의 상태를 변경하고 관련 정보를 업데이트합니다. 환불 승인, 거절, 검수 등의 처리를 이 API를 통해 수행합니다.
- **Path Variable:** `returnRequestId` (int) - 처리할 환불/반품 요청의 ID
- **요청 본문:** `ReturnAdminUpdateRequest`
    - `status`: `ReturnStatus` (Enum, 필수)
    - `deductedShippingFee`: `BigDecimal`
    - `rejectReason`: `String`
    - `memo`: `String`
- **응답:** `ReturnAdminResponse`
    - `returnRequestId`: `int`
    - `orderId`: `int`
    - `buyerName`: `String`
    - `createdBy`: `String`
    - `updatedBy`: `String`
    - `reason`: `ReturnReason` (Enum)
    - `detailReason`: `String`
    - `status`: `ReturnStatus` (Enum)
    - `originalPaymentAmount`: `BigDecimal`
    - `deductedShippingFee`: `BigDecimal`
    - `finalRefundAmount`: `BigDecimal`
    - `rejectReason`: `String`
    - `comment`: `String`
    - `requestedAt`: `LocalDateTime`
    - `completedAt`: `LocalDateTime`
    - `attachmentUrls`: `List<String>`
    - `statusHistories`: `List<ReturnHistoryResponse>`
        - `previousStatus`: `ReturnStatus` (Enum)
        - `newStatus`: `ReturnStatus` (Enum)
        - `updatedBy`: `String`
        - `updatedAt`: `LocalDateTime`
        - `memo`: `String`
- **상태 코드:**
    - `200 OK`: 상태 변경 및 업데이트 성공

### 5. 환불/반품 요청 논리적 삭제
- **URL:** `DELETE /api/admin/returns/{returnRequestId}`
- **설명:** 관리자가 환불/반품 요청을 논리적으로 삭제합니다. 시스템에서 해당 요청을 숨김 처리하며, 물리적으로 데이터가 삭제되지는 않습니다.
- **Path Variable:** `returnRequestId` (int) - 삭제할 환불/반품 요청의 ID
- **응답:** `Void`
- **상태 코드:**
    - `204 No Content`: 삭제 성공

## 정산 API (관리자)

### 1. 정산 대시보드 요약 조회
- **URL:** `GET /api/admin/settlement/dashboard`
- **설명:** 대시보드용 정산 KPI 데이터를 조회합니다.
- **응답:** `SettlementDashboardResponse`
    - `monthlyScheduledAmount`: `BigDecimal` (당월 정산 예정액)
    - `yesterdaySettledAmount`: `BigDecimal` (어제 정산된 금액)
    - `pendingOrFailedCount`: `long` (정산 보류/실패 건수)
    - `cumulativeSettlementAmount`: `BigDecimal` (누적 정산액)
- **상태 코드:**
    - `200 OK`: 조회 성공

### 2. 정산 내역 목록 조회
- **URL:** `GET /api/admin/settlement`
- **설명:** 정산 내역 목록을 검색하고 페이징하여 조회합니다.
- **요청 파라미터:** `SettlementSearchCondition`
    - `sellerName`: `String`
    - `status`: `SettlementStatus` (Enum)
    - `startDate`: `LocalDate` (ISO 형식 날짜)
    - `endDate`: `LocalDate` (ISO 형식 날짜)
- **응답:** `Page<SettlementSummaryResponse>`
    - `settlementId`: `int`
    - `sellerName`: `String`
    - `settlementAmount`: `BigDecimal`
    - `status`: `SettlementStatus` (Enum)
    - `requestedAt`: `LocalDateTime`
    - `completedAt`: `LocalDateTime`
- **상태 코드:**
    - `200 OK`: 목록 조회 성공

### 3. 특정 정산 건 상세 조회
- **URL:** `GET /api/admin/settlement/{settlementId}`
- **설명:** 특정 정산 건의 상세 내역을 조회합니다.
- **Path Variable:** `settlementId` (int) - 정산 ID
- **응답:** `SettlementDetailResponse`
    - `settlementId`: `int`
    - `sellerName`: `String`
    - `totalAmount`: `BigDecimal`
    - `commissionAmount`: `BigDecimal`
    - `settlementAmount`: `BigDecimal`
    - `status`: `SettlementStatus` (Enum)
    - `requestedAt`: `LocalDateTime`
    - `completedAt`: `LocalDateTime`
    - `failureReason`: `String`
    - `bankName`: `String`
    - `accountNumber`: `String`
    - `items`: `List<SettlementItemDto>`
        - `orderId`: `int`
        - `productName`: `String`
        - `itemSaleAmount`: `BigDecimal`
        - `commissionRate`: `BigDecimal`
        - `commissionAmount`: `BigDecimal`
        - `totalAmount`: `BigDecimal`
        - `isReturned`: `boolean`
- **상태 코드:**
    - `200 OK`: 상세 조회 성공

### 4. 정산 설정 조회
- **URL:** `GET /api/admin/settlement/settings`
- **설명:** 현재 정산 설정을 조회합니다.
- **응답:** `SettlementSettingResponse`
    - `settlementSettingId`: `int`
    - `commissionRate`: `BigDecimal` (0.0 이상 100.0 이하)
    - `settlementCycleType`: `SettlementCycleType` (Enum)
    - `settlementDay`: `Integer`
    - `createdAt`: `LocalDateTime`
    - `createdBy`: `String`
    - `updatedAt`: `LocalDateTime`
    - `updatedBy`: `String`
- **상태 코드:**
    - `200 OK`: 조회 성공

### 5. 정산 설정 생성 또는 수정
- **URL:** `POST /api/admin/settlement/settings`
- **설명:** 정산 설정을 생성하거나 수정합니다.
- **요청 본문:** `SettlementSettingRequest`
    - `commissionRate`: `BigDecimal` (필수, 0.0 이상 100.0 이하)
    - `settlementCycleType`: `SettlementCycleType` (Enum, 필수)
    - `settlementDay`: `Integer`
- **응답:** `SettlementSettingResponse`
    - `settlementSettingId`: `int`
    - `commissionRate`: `BigDecimal` (0.0 이상 100.0 이하)
    - `settlementCycleType`: `SettlementCycleType` (Enum)
    - `settlementDay`: `Integer`
    - `createdAt`: `LocalDateTime`
    - `createdBy`: `String`
    - `updatedAt`: `LocalDateTime`
    - `updatedBy`: `String`
- **상태 코드:**
    - `200 OK`: 생성 또는 수정 성공

## 정산 API (판매자)

### 1. 나의 정산 내역 목록 조회
- **URL:** `GET /api/my/settlements`
- **설명:** 현재 로그인한 판매자의 정산 내역 목록을 페이징하여 조회합니다.
- **요청 파라미터:** `Pageable` (페이징 정보)
- **응답:** `Page<SettlementSummaryResponse>`
    - `settlementId`: `int`
    - `sellerName`: `String`
    - `settlementAmount`: `BigDecimal`
    - `status`: `SettlementStatus` (Enum)
    - `requestedAt`: `LocalDateTime`
    - `completedAt`: `LocalDateTime`
- **상태 코드:**
    - `200 OK`: 조회 성공

### 2. 나의 특정 정산 건 상세 조회
- **URL:** `GET /api/my/settlements/{settlementId}`
- **설명:** 현재 로그인한 판매자의 특정 정산 건 상세 내역을 조회합니다.
- **Path Variable:** `settlementId` (int) - 정산 ID
- **응답:** `SettlementDetailResponse`
    - `settlementId`: `int`
    - `sellerName`: `String`
    - `totalAmount`: `BigDecimal`
    - `commissionAmount`: `BigDecimal`
    - `settlementAmount`: `BigDecimal`
    - `status`: `SettlementStatus` (Enum)
    - `requestedAt`: `LocalDateTime`
    - `completedAt`: `LocalDateTime`
    - `failureReason`: `String`
    - `bankName`: `String`
    - `accountNumber`: `String`
    - `items`: `List<SettlementItemDto>`
        - `orderId`: `int`
        - `productName`: `String`
        - `itemSaleAmount`: `BigDecimal`
        - `commissionRate`: `BigDecimal`
        - `commissionAmount`: `BigDecimal`
        - `totalAmount`: `BigDecimal`
        - `isReturned`: `boolean`
- **상태 코드:**
    - `200 OK`: 조회 성공