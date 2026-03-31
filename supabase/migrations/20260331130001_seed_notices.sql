-- ============================================================
-- Migration: seed_notices
-- Description: 기존 하드코딩 공지 2건 DB 이관
-- ============================================================

INSERT INTO public.notices (category, title_ko, title_en, body_ko, body_en, badge_ko, badge_en, url, is_published, pinned) VALUES
(
  'notice',
  '2026 APTRC 대한민국 선수단 선발 안내',
  '2026 APTRC – Korea National Team Selection Notice',
  '제 1회 울주 APTRC에 이은 두 번째 APTRC(아시아 태평양 트레일 러닝 챔피언십)이 2026년 11월 개최됩니다!

대한민국 선수단은 ITRA PI를 기준으로 선발 예정이며, 선수단 접수 일정이 확정되는 대로 국가 대표 출전 자격이 주어지는 선수에게 이메일이 발송 됩니다.
대한민국 대표 선수들의 많은 관심과 출전을 부탁드립니다.
2026 APTRC와 관련된 업데이트는 공지사항을 통해 전달하겠습니다.

[챔피언십 경기 일정]
11월 26일(목): 롱 트레일 80km (챔피언십 경기)
11월 27일(금): U23 & 숏 트레일 40km (챔피언십 경기)

공식 홈페이지는 현재 업데이트 중 이니 참고 바랍니다.',
  'Following the 1st APTRC in Ulju, the 2nd Asia Pacific Trail Running Championships (APTRC) will be held in November 2026!

The Korea national team will be selected based on ITRA PI scores. Athletes eligible for national team participation will be notified by email once the registration schedule is confirmed.
We encourage all Korean representative athletes to participate.
Updates regarding the 2026 APTRC will be communicated through official announcements.

[Championship Schedule]
Nov 26 (Thu): Long Trail 80 km (Championship race)
Nov 27 (Fri): U23 & Short Trail 40 km (Championship race)

Please note that the official website is currently being updated.',
  '선수단 모집',
  'Team Selection',
  'https://www.aptrc2026.com/ko',
  TRUE,
  TRUE
),
(
  'notice',
  '제2회 APTRC 오픈경기 참가 안내 (마감 4월 10일)',
  '2nd APTRC Open Race Registration – Deadline April 10',
  '제 1회 울주 APTRC에 이은 제 2회 APTRC(아시아 태평양 트레일 러닝 챔피언십)이 2026년 11월 개최됩니다!

제 2회 APTRC는 중국 우이산에서 펼쳐지는 제11회 그랜드 우이산 슈퍼 트레일 레이스와 동시 개최 되며 참가국 대표선수단외에도 아마추어 선수들이 출전할 수 있는 오픈경기가 함께 진행됩니다.

오픈경기는 아래와 같습니다.

[오픈경기]
📅 2026년 11월 27일–29일
🏃 거리: 100 / 60 / 35 / 20 / 10km
📝 참가 신청 마감: 4월 10일까지

[챔피언십/오픈경기 일정]
11월 26일(목): 롱 트레일 80km (챔피언십 경기)
11월 27일(금): U23 & 숏 트레일 40km (챔피언십 경기)
11월 28–29일(토–일): 일반 참가자 레이스(오픈경기)

자세한 정보는 아래 링크를 방문하세요!
➡️ English → Registration → Registration Entry',
  'Following the 1st APTRC in Ulju, the 2nd Asia Pacific Trail Running Championships (APTRC) will be held in November 2026!

The 2nd APTRC will be co-hosted with the 11th Grand Wuyi Super Trail Race in Wuyishan, China. In addition to national team athletes, open categories are available for amateur runners.

[Open Race]
📅 November 27–29, 2026
🏃 Distances: 100 / 60 / 35 / 20 / 10 km
📝 Registration deadline: April 10

[Championship / Open Race Schedule]
Nov 26 (Thu): Long Trail 80 km (Championship race)
Nov 27 (Fri): U23 & Short Trail 40 km (Championship race)
Nov 28–29 (Sat–Sun): Public race categories (Open)

Visit the link below for more information!
➡️ English → Registration → Registration Entry',
  '마감임박',
  'Closing Soon',
  'https://www.wuyitrail.com/',
  TRUE,
  FALSE
);
