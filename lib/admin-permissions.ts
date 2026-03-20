/**
 * 관리자 권한 정의
 * 메뉴 접근 권한 (menu.*) + 데이터 조작 권한 (resource.ACTION)
 */

export type Permission = string;

// ─── 메뉴 권한 ────────────────────────────────
export const MENU_PERMISSIONS = {
  DASHBOARD:      "menu.dashboard",
  MEMBERS:        "menu.members",
  PAYMENTS:       "menu.payments",
  INSURANCE:      "menu.insurance",
  CERTIFICATIONS: "menu.certifications",
  POSTS:          "menu.posts",
  RACES:          "menu.races",
  LOGS:           "menu.logs",
  SETTINGS:       "menu.settings",
} as const;

// ─── 데이터 권한 ──────────────────────────────
export const DATA_PERMISSIONS = {
  // 회원
  MEMBERS_READ:           "members.READ",
  MEMBERS_UPDATE:         "members.UPDATE",
  MEMBERS_DELETE:         "members.DELETE",
  MEMBERS_EXPORT:         "members.EXPORT",
  // 회원 자격
  MEMBERSHIPS_READ:       "memberships.READ",
  MEMBERSHIPS_CREATE:     "memberships.CREATE",
  MEMBERSHIPS_UPDATE:     "memberships.UPDATE",
  MEMBERSHIPS_DELETE:     "memberships.DELETE",
  // 결제
  PAYMENTS_READ:          "payments.READ",
  PAYMENTS_EXPORT:        "payments.EXPORT",
  // 환불
  REFUNDS_READ:           "refunds.READ",
  REFUNDS_CREATE:         "refunds.CREATE",
  // 보험
  INSURANCE_READ:         "insurance.READ",
  INSURANCE_CREATE:       "insurance.CREATE",
  INSURANCE_UPDATE:       "insurance.UPDATE",
  INSURANCE_DELETE:       "insurance.DELETE",
  // 자격 인증
  QUALIFICATIONS_READ:    "qualifications.READ",
  QUALIFICATIONS_UPDATE:  "qualifications.UPDATE",
  CERTIFICATIONS_READ:    "certifications.READ",
  CERTIFICATIONS_CREATE:  "certifications.CREATE",
  CERTIFICATIONS_DELETE:  "certifications.DELETE",
  // 콘텐츠
  POSTS_READ:             "posts.READ",
  POSTS_CREATE:           "posts.CREATE",
  POSTS_UPDATE:           "posts.UPDATE",
  POSTS_DELETE:           "posts.DELETE",
  // 대회
  RACES_READ:             "races.READ",
  RACES_CREATE:           "races.CREATE",
  RACES_UPDATE:           "races.UPDATE",
  RACES_DELETE:           "races.DELETE",
  // 로그
  LOGS_MEMBER:            "logs_member.READ",
  LOGS_PAYMENT:           "logs_payment.READ",
  LOGS_CERT:              "logs_cert.READ",
  LOGS_ADMIN:             "logs_admin.READ",
} as const;

// ─── 사전 정의 그룹 (목업) ────────────────────
export const PRESET_GROUPS: Record<string, { label: string; permissions: Permission[] }> = {
  재무: {
    label: "재무",
    permissions: [
      MENU_PERMISSIONS.DASHBOARD, MENU_PERMISSIONS.PAYMENTS,
      MENU_PERMISSIONS.INSURANCE, MENU_PERMISSIONS.LOGS,
      DATA_PERMISSIONS.PAYMENTS_READ, DATA_PERMISSIONS.PAYMENTS_EXPORT,
      DATA_PERMISSIONS.REFUNDS_READ, DATA_PERMISSIONS.REFUNDS_CREATE,
      DATA_PERMISSIONS.INSURANCE_READ, DATA_PERMISSIONS.INSURANCE_CREATE,
      DATA_PERMISSIONS.INSURANCE_UPDATE, DATA_PERMISSIONS.INSURANCE_DELETE,
      DATA_PERMISSIONS.LOGS_PAYMENT,
    ],
  },
  감사: {
    label: "감사",
    permissions: [
      MENU_PERMISSIONS.DASHBOARD, MENU_PERMISSIONS.MEMBERS,
      MENU_PERMISSIONS.PAYMENTS, MENU_PERMISSIONS.LOGS,
      DATA_PERMISSIONS.MEMBERS_READ, DATA_PERMISSIONS.MEMBERSHIPS_READ,
      DATA_PERMISSIONS.PAYMENTS_READ, DATA_PERMISSIONS.REFUNDS_READ,
      DATA_PERMISSIONS.LOGS_MEMBER, DATA_PERMISSIONS.LOGS_PAYMENT, DATA_PERMISSIONS.LOGS_ADMIN,
    ],
  },
  자격인증: {
    label: "자격인증",
    permissions: [
      MENU_PERMISSIONS.DASHBOARD, MENU_PERMISSIONS.CERTIFICATIONS, MENU_PERMISSIONS.LOGS,
      DATA_PERMISSIONS.QUALIFICATIONS_READ, DATA_PERMISSIONS.QUALIFICATIONS_UPDATE,
      DATA_PERMISSIONS.CERTIFICATIONS_READ, DATA_PERMISSIONS.CERTIFICATIONS_CREATE,
      DATA_PERMISSIONS.CERTIFICATIONS_DELETE, DATA_PERMISSIONS.LOGS_CERT,
    ],
  },
  콘텐츠: {
    label: "콘텐츠",
    permissions: [
      MENU_PERMISSIONS.DASHBOARD, MENU_PERMISSIONS.POSTS, MENU_PERMISSIONS.RACES,
      DATA_PERMISSIONS.POSTS_READ, DATA_PERMISSIONS.POSTS_CREATE,
      DATA_PERMISSIONS.POSTS_UPDATE, DATA_PERMISSIONS.POSTS_DELETE,
      DATA_PERMISSIONS.RACES_READ, DATA_PERMISSIONS.RACES_CREATE,
      DATA_PERMISSIONS.RACES_UPDATE, DATA_PERMISSIONS.RACES_DELETE,
    ],
  },
  회원관리: {
    label: "회원관리",
    permissions: [
      MENU_PERMISSIONS.DASHBOARD, MENU_PERMISSIONS.MEMBERS, MENU_PERMISSIONS.LOGS,
      DATA_PERMISSIONS.MEMBERS_READ, DATA_PERMISSIONS.MEMBERS_UPDATE,
      DATA_PERMISSIONS.MEMBERSHIPS_READ, DATA_PERMISSIONS.MEMBERSHIPS_CREATE,
      DATA_PERMISSIONS.MEMBERSHIPS_UPDATE, DATA_PERMISSIONS.LOGS_MEMBER,
    ],
  },
};

/** 권한 보유 여부 확인 */
export function hasPermission(userPermissions: Permission[], required: Permission): boolean {
  return userPermissions.includes(required);
}
