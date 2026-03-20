import { useLocale } from "next-intl";

export default function PrivacyPage() {
  const locale = useLocale();
  const isKo = locale === "ko";

  if (!isKo) return <EnPrivacy />;
  return <KoPrivacy />;
}

function KoPrivacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-gray-700">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">개인정보처리방침</h1>
      <div className="w-12 h-1 bg-[#1e3a6e] mb-8"></div>
      <p className="text-sm text-gray-400 mb-10">
        시행일: 2026년 3월 20일 &nbsp;|&nbsp; 대한트레일스포츠협회
      </p>

      <Section title="제1조 (개인정보의 처리 목적)">
        <p>대한트레일스포츠협회(이하 "협회")는 다음의 목적을 위하여 개인정보를 처리합니다. 처리한 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
        <ul className="list-disc pl-5 mt-3 space-y-1">
          <li>회원 가입 및 관리</li>
          <li>준회원·정회원·기업회원 자격 심사 및 관리</li>
          <li>대회 참가 접수 및 운영</li>
          <li>협회 공지사항 및 뉴스레터 발송</li>
          <li>고충 처리 및 민원 응대</li>
        </ul>
      </Section>

      <Section title="제2조 (처리하는 개인정보 항목)">
        <p className="font-medium mb-2">필수 항목</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>성명, 생년월일, 성별</li>
          <li>연락처 (휴대전화번호, 이메일 주소)</li>
          <li>주소</li>
        </ul>
        <p className="font-medium mt-4 mb-2">선택 항목 (회원 등급에 따라)</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>소속 단체·기업명</li>
          <li>UTMB 인덱스 ID 등 대회 식별정보</li>
          <li>긴급 연락처</li>
        </ul>
        <p className="font-medium mt-4 mb-2">자동 수집 항목</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>접속 IP 주소, 접속 일시, 브라우저 종류</li>
        </ul>
      </Section>

      <Section title="제3조 (개인정보의 처리 및 보유 기간)">
        <table className="w-full text-sm border-collapse mt-2">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="text-left p-2 border border-gray-200">구분</th>
              <th className="text-left p-2 border border-gray-200">보유 기간</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["회원 정보", "회원 탈퇴 시까지"],
              ["대회 참가 기록", "참가일로부터 3년"],
              ["결제·환불 기록", "5년 (전자상거래법)"],
              ["불만·민원 처리 기록", "3년 (전자상거래법)"],
            ].map(([a, b]) => (
              <tr key={a} className="hover:bg-gray-50">
                <td className="p-2 border border-gray-200">{a}</td>
                <td className="p-2 border border-gray-200">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="제4조 (개인정보의 제3자 제공)">
        <p>협회는 정보주체의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.</p>
        <ul className="list-disc pl-5 mt-3 space-y-1">
          <li>정보주체가 사전에 동의한 경우</li>
          <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
          <li>대회 안전 운영을 위해 의료기관에 응급 상황 발생 시 최소 정보 제공</li>
        </ul>
      </Section>

      <Section title="제5조 (개인정보 처리의 위탁)">
        <p>협회는 현재 개인정보 처리 업무를 외부에 위탁하지 않습니다. 향후 위탁 계약 체결 시 개인정보 보호법 제26조에 따라 위탁업체 및 위탁 내용을 본 방침에 공개합니다.</p>
      </Section>

      <Section title="제6조 (정보주체의 권리·의무 및 행사 방법)">
        <p>정보주체는 협회에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.</p>
        <ul className="list-disc pl-5 mt-3 space-y-1">
          <li>개인정보 열람 요구</li>
          <li>오류 등이 있을 경우 정정 요구</li>
          <li>삭제 요구</li>
          <li>처리 정지 요구</li>
        </ul>
        <p className="mt-3">권리 행사는 아래 개인정보 보호책임자에게 서면, 전자우편으로 하실 수 있으며, 협회는 이에 대해 지체 없이 조치하겠습니다.</p>
      </Section>

      <Section title="제7조 (개인정보의 안전성 확보 조치)">
        <p>협회는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
        <ul className="list-disc pl-5 mt-3 space-y-1">
          <li>개인정보 취급 직원의 최소화 및 교육</li>
          <li>개인정보에 대한 접근 제한 (권한 관리)</li>
          <li>개인정보를 저장하는 시스템의 HTTPS 암호화 통신</li>
          <li>비밀번호 암호화 저장 (단방향 해시)</li>
          <li>개인정보 무단 유출·변조·훼손 방지를 위한 보안 점검</li>
        </ul>
      </Section>

      <Section title="제8조 (개인정보 보호책임자)">
        <table className="w-full text-sm border-collapse mt-2">
          <tbody>
            {[
              ["성명", "장지윤"],
              ["직위", "대한트레일스포츠협회 회장"],
              ["연락처", "협회 공식 이메일 (준비 중)"],
              ["주소", "서울특별시 용산구 두텁바위로69길 4, 101호 (후암동)"],
            ].map(([k, v]) => (
              <tr key={k} className="hover:bg-gray-50">
                <td className="p-2 border border-gray-200 font-medium w-24 bg-gray-50">{k}</td>
                <td className="p-2 border border-gray-200">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-sm text-gray-500">
          개인정보 침해에 관한 신고나 상담은 아래 기관에 문의하실 수 있습니다.
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-500">
          <li>개인정보 침해신고센터: <a href="https://privacy.kisa.or.kr" target="_blank" className="text-[#1e3a6e] underline">privacy.kisa.or.kr</a> / ☎ 118</li>
          <li>대검찰청 사이버범죄수사단: <a href="https://www.spo.go.kr" target="_blank" className="text-[#1e3a6e] underline">www.spo.go.kr</a> / ☎ 1301</li>
          <li>경찰청 사이버안전국: <a href="https://cyberbureau.police.go.kr" target="_blank" className="text-[#1e3a6e] underline">cyberbureau.police.go.kr</a> / ☎ 182</li>
        </ul>
      </Section>

      <Section title="제9조 (개인정보처리방침의 변경)">
        <p>이 개인정보처리방침은 2026년 3월 20일부터 적용됩니다. 변경이 있을 경우 시행 7일 전에 홈페이지 공지사항을 통하여 고지할 것입니다.</p>
      </Section>
    </div>
  );
}

function EnPrivacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-gray-700">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <div className="w-12 h-1 bg-[#1e3a6e] mb-8"></div>
      <p className="text-sm text-gray-400 mb-10">
        Effective Date: March 20, 2026 &nbsp;|&nbsp; Korea Trail Sports Association (KTSA)
      </p>
      <p className="leading-relaxed">
        KTSA collects personal information solely for membership management, race registration, and association communications. Data is retained only as long as necessary and is never sold to third parties. Members may request access, correction, or deletion of their data at any time by contacting us at the address below.
      </p>
      <p className="mt-6 text-sm text-gray-500">
        Korea Trail Sports Association<br />
        4, Duteopbawi-ro 69-gil, Yongsan-gu, Seoul, Republic of Korea<br />
        (Full Korean-language policy available above)
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">{title}</h2>
      <div className="leading-relaxed space-y-2 text-sm">{children}</div>
    </section>
  );
}
