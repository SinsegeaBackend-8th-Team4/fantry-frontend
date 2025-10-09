/**
 * 카카오(Daum) 주소 검색 API 래퍼
 * @param {Function} callback - 주소 선택 시 실행될 콜백 함수
 * @returns {void}
 */
const openAddressSearch = (callback) => {
  new daum.Postcode({
    oncomplete: function (data) {
      if(typeof callback === 'function'){
        callback(data)
      }
    },
    focusInput: true,
    autoMapping: true,
  }).open({
    popupTitle: '주소검색',
    popupKey: 'fantry_address_search',
  })
}

export default openAddressSearch
