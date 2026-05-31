// ============================================================
//  CONFIG.JS — แก้ไขไฟล์นี้ไฟล์เดียวก็พอ
//  ทั้ง index.html, feather.html และ Quecardlist.html จะอ่านค่าจากที่นี่
// ============================================================

const APP_CONFIG = {

  // ── ข้อมูลกิลด์ ──────────────────────────────────────────
  guildName: 'หมูเห็ด',                // ชื่อกิลด์ (แสดงใน header)
  appTitle:  'Guild Manager',       // ชื่อแอป index.html

  // ── Google Sheets ─────────────────────────────────────────
  // วิธีหา Spreadsheet ID:
  //   เปิด Google Sheets → URL จะเป็น
  //   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
  //   คัดลอก [SPREADSHEET_ID] มาใส่
  spreadsheetId: '1jlxwooeYMh_4t_H5TE2hJ6K6prVryTGzTvs7JbRiCs8',

  // วิธีหา API Key:
  //   1. ไปที่ https://console.cloud.google.com
  //   2. สร้าง Project → Enable "Google Sheets API"
  //   3. Credentials → Create API Key
  //   4. แนะนำ Restrict key ให้ใช้ได้แค่ Sheets API และ domain ของตัวเอง
  sheetsApiKey: 'AIzaSyDFV20rZ1Dl9ZBswj1e9wK-G7XJHItBqG8',

  // ── Sheet Names (ชื่อ Tab ใน Spreadsheet) ─────────────────
  memberListSheet:      'Member List',       // Tab รายชื่อสมาชิก (ใช้ใน index.html)
  auctionListSheet:     'AuctionList',       // Tab ขนนก (ใช้ใน feather.html)
  auctionListCardSheet: 'AuctionListCard',   // Tab การ์ด (ใช้ใน Quecardlist.html)

  // ── Sheet GID (ตัวเลขท้าย URL เมื่อคลิก Tab) ─────────────
  // วิธีหา GID:
  //   คลิกที่ Tab ที่ต้องการ → URL เปลี่ยนเป็น ...edit#gid=[GID]
  //   คัดลอก [GID] มาใส่ (ต้องเป็น string ใส่ '' ด้วย)
  auctionListGid:     '943811353',     // GID ของ Tab AuctionList
  auctionListCardGid: '1998389234',    // GID ของ Tab AuctionListCard

  // ── ค่า Default สำหรับ feather.html ─────────────────────
  defaultLimitWhite:  12,    // ขาว limit ต่อคนต่อรอบ (default)
  defaultLimitRed:    16,    // แดง limit ต่อคนต่อรอบ (default)
  defaultTotalWhite:  140,   // ขนขาวรวมที่ได้จากกิจกรรม (default)
  defaultTotalRed:    160,   // ขนแดงรวมที่ได้จากกิจกรรม (default)

  // ── ค่า Default สำหรับ Quecardlist.html ──────────────────
  defaultLimitCard:   10,    // การ์ด limit ต่อคนต่อรอบ (default)
  defaultTotalCard:   140,   // การ์ดรวมที่ได้จากกิจกรรม (default)

  // ── Discord Username Whitelist ────────────────────────────────
  // แก้ไขผ่าน .env แล้วรัน: node sync.js
  // หรือแก้ตรงนี้ก็ได้ (ตัวพิมพ์เล็ก-ใหญ่ ไม่สำคัญ)
  allowedDiscordUsernames: [
    'peamz4',
    'repursalz_drink',
    'imdoubleoo_126',
    'abso8820_90257',
    'dearxzibitz',
  ],

};