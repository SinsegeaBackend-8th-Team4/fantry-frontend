const openAddressSearch = (callback) => {
  new daum.Postcode({
    oncomplete: function (data) {
      callback(data)
    },
    focusInput: true,
  }).open({
    popupTitle: '주소검색',
    popupKey: 'fantry_address_search',
  })
}

export default openAddressSearch
