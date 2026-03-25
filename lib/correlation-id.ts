/**
 * @file 요청 상관 ID 생성
 * @description Node·Edge·브라우저 공통으로 `globalThis.crypto` 사용 (node:crypto import 회피)
 * @module ui
 */

/**
 * UUID v4 형식 상관 ID
 * @returns 예: `550e8400-e29b-41d4-a716-446655440000`
 */
export function newCorrelationId(): string {
  return globalThis.crypto.randomUUID()
}
