"use strict";

/*
 * 正式串接時只需要修改這個檔案：
 * 1. LIFF_ID：LINE MINI App Channel「Web app settings」中的 LIFF ID。
 *    測試時填 Developing，正式上線時改用 Published 的 LIFF ID。
 * 2. API_BASE_URL：FastAPI 對外網址，不要以 / 結尾。
 * 3. USE_MOCK_API：確認後端完成後改成 false。
 */
window.TEMPLE_CHECKIN_CONFIG = Object.freeze({
  LIFF_ID: "YOUR_LIFF_ID",
  API_BASE_URL: "https://two026-line-temple.onrender.com",
  USE_MOCK_API: true,
  API_ENDPOINTS: Object.freeze({
    login: "/records/login",
    search: "/temples/search",
    records: "/records"
  })
});
