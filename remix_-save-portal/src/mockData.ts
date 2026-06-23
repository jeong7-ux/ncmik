import { ArchiveDocument, AuditLogEntry } from './types';

export const INITIAL_DOCUMENTS: ArchiveDocument[] = [
  {
    id: "ARCH-2024-DRU-098",
    title: "비상 물류 프로토콜: 생물학적 위험 대응",
    description: "4단계 재난 선포에 따른 긴급 물류 전개 및 실시간 수송 프로토콜입니다. 자재 배분, 생물안전 기준 보장 및 개인보호장비 관리 세부 조항이 명문화되어 있습니다.",
    currentVersion: "v2.4.1",
    category: "Ebola-WAF",
    type: "의료 보고서",
    status: 'active',
    stability: 100,
    lastUpdated: "2024-03-14 11:22 UTC",
    authors: ["Dr. Aris Thorne", "Admin_User_01"],
    relationships: [
      {
        type: 'revision',
        targetId: 'BASE-ARCH-001',
        targetTitle: '마스터 프로토콜 (v1.0.0)',
        note: '기초 재난대응 마스터 표준에서 개정'
      },
      {
        type: 'reference',
        targetId: 'OSHA-1910-120',
        targetTitle: 'OSHA 지침 Ref: 1910.120',
        note: '유해 물질 현장 규정 표준 준수 적용'
      },
      {
        type: 'derivation',
        targetId: 'LOC-SPEC-082',
        targetTitle: '현장 특정 B (v0.8.2-beta)',
        note: '2구역 격리 전용 지역 분기 문서'
      }
    ],
    versions: [
      {
        id: "v2.4.1",
        label: "v2.4.1 (현재)",
        title: "중요 개인보호장구 업데이트",
        date: "2024년 3월 14일",
        summary: "고독성 환경에 대한 안전 장비 표준을 상향 조정하고 출입 시간의 생체 인식 인증을 수동 기록 대신 통합하였습니다. 최고 의료 책임자에 의해 실전 검증되었습니다.",
        signer: "Dr. Aris Thorne",
        signerAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPlNIYjkfkdzGb-Rfa18U2oM2iwTgw6ytuRA8KG1_8jishH78W_yIEiOkgDrp70l9TaP0-Ry3CZ2BQpfLCb9JDXVJVTg3-vVn2mB6869Npnx65CYSzv-lCCMr_eWhePWJj6RJiZOb9DKB-j-lMSBZ3itOorK0LVyeTG3RL1Y4MXiLoaWCmWfqKBlQNfvv-C5N6kufZHF56hTVpl7yo4k2lSyL4fLM4FaQPvXTWvAV9SJEpIvD2T2tXM-A8FqGSEfqvGXuG_mCyZt8",
        diff: {
          addedCount: 12,
          removedCount: 4,
          lines: [
            { type: 'normal', text: '섹션 4.2.1: 개인보호장구 (PPE)' },
            { type: 'remove', text: '— 모든 현장 요원은 표준 B등급 유해 물질 슈트를 사용해야 합니다.' },
            { type: 'add', text: '+ 모든 현장 요원은 1구역 진입 시 A등급 가압 화학 슈트 사용이 필수입니다.' },
            { type: 'add', text: '+ 실시간 산소 텔레메트리 모니터링이 의무화되었습니다.' },
            { type: 'normal', text: '  표준 오염 제거 절차는 사이트 경계 B에서 시작되어야 합니다.' },
            { type: 'remove', text: '— 체크포인트에서 출입 시간의 수동 기록이 필요합니다.' },
            { type: 'add', text: '+ 출입 시간의 생체 인증 로그가 포털 4를 통해 캡처됩니다.' }
          ]
        }
      },
      {
        id: "v2.4.0",
        label: "v2.4.0",
        title: "실시간 모니터링 시스템 구축",
        date: "2024년 2월 2일",
        summary: "원격지 모니터링 및 텔레메트리 연동 시스템 규약의 개정본입니다. 통신 음영 지역에 대한 단독 위생 안전 인프라가 포함되었습니다.",
        signer: "Admin_User_01",
        diff: {
          addedCount: 8,
          removedCount: 1,
          lines: [
            { type: 'normal', text: '섹션 3.4: 모니터링 백본 시스템' },
            { type: 'remove', text: '— 수작업 주기적 데이터 백업' },
            { type: 'add', text: '+ 위성 브릿지를 활용한 무중단 실시간 소켓 스트리밍 연결 수립' },
            { type: 'add', text: '+ 국소 오염 수치 계측기 오차 보정 계수 자동 보정' }
          ]
        }
      },
      {
        id: "v2.3.9",
        label: "v2.3.9 (아카이브)",
        title: "외부 감사 준수 보급",
        date: "2024년 1월 15일",
        summary: "세계보건기구(WHO) 및 지역 재난안전대책본부 권고사항 및 외부 감사에 대비한 감사 규칙의 표준 부합화.",
        signer: "Auditor Team Alpha",
        diff: {
          addedCount: 4,
          removedCount: 2,
          lines: [
            { type: 'normal', text: '섹션 2.1: 준수 감사 지표' },
            { type: 'remove', text: '— 분기별 1회 자체 규정 검토 시행' },
            { type: 'add', text: '+ ISO 22301 비즈니스 연속성 관리체계 기반 매월 강제성 통합 검증' }
          ]
        }
      },
      {
        id: "v2.3.0",
        label: "v2.3.0 (과거 이력)",
        title: "기존 민감 정보 정화",
        date: "2023년 12월 20일",
        summary: "보안 가이드에 위반하는 기밀 개인정보(PII) 기록물의 안전 격리 및 보존 해시 검증.",
        signer: "Security Officer-S",
        diff: {
          addedCount: 2,
          removedCount: 15,
          lines: [
            { type: 'normal', text: '섹션 1.0: 기록 소독 보고서' },
            { type: 'remove', text: '— 실명, 생년월일, 소속 등 상세 개인 식별자 직접 나열' },
            { type: 'add', text: '+ 식별자는 익명 고유 토큰(GUID) 및 해시화된 서명 키로 안전 대체' }
          ]
        }
      }
    ]
  },
  {
    id: "ARCH-2023-882",
    title: "WHO-COVID19-TRANS-ARCHIVE-2022",
    description: "오미크론 변이 급증 기간 동안의 전파 벡터를 상세히 설명하는 종합 데이터셋... 42개 대도시의 접촉 추적 그래프 및 폐수 감시 상관관계 지표가 포함되어 있습니다.",
    currentVersion: "v4.2.1",
    category: "COVID-19",
    type: "PDF, JSON, CSV",
    status: 'active',
    stability: 100,
    lastUpdated: "2023-11-12 14:22 UTC",
    authors: ["Admin_User_01", "Global_Health_Reporter"],
    relationships: [],
    versions: [
      {
        id: "v4.2.1",
        label: "v4.2.1 (현재)",
        title: "오미크론 하위 격변종 대응 패치",
        date: "2023년 11월 12일",
        summary: "오미크론 변이 계보에 대한 최종 결합 파라미터 보강 및 RAG 검색을 위한 정형 인덱스 테이블 추가.",
        signer: "System Auto-Process",
        diff: {
          addedCount: 5,
          removedCount: 0,
          lines: [
            { type: 'normal', text: '섹션 5: 면역 회피 프로필' },
            { type: 'add', text: '+ 신종 BQ.1 및 XBB 계열 스파이크 단백질 상동구조 계산식 적용' }
          ]
        }
      }
    ]
  },
  {
    id: "MED-REF-419",
    title: "CDC-SARS-GENOME-V2-MAPPING",
    description: "SARS-CoV-1 및 SARS-CoV-2 단백질 구조에 대한 비교 유전체 시퀀싱. 연령대별 표준화 코호트 전반의 스파이크 단백질 변이 및 결합 친화도 변화에 중점을 둡니다.",
    currentVersion: "v1.0.0",
    category: "SARS-2003",
    type: "일반 데이터",
    status: 'archived',
    stability: 75,
    lastUpdated: "2024-01-05 09:15 UTC",
    authors: ["Dr. Sarah Jenkins"],
    relationships: [],
    versions: [
      {
        id: "v1.0.0",
        label: "v1.0.0 (배포)",
        title: "비교 시퀀싱 완성본",
        date: "2024년 1월 5일",
        summary: "분자동역학 컴퓨터 시뮬레이션을 완료하고 유전자 지도 매핑 데이터를 동결 아카이브 처리함.",
        signer: "Dr. Sarah Jenkins",
        diff: {
          addedCount: 10,
          removedCount: 1,
          lines: [
            { type: 'normal', text: '유전자 배열 1.4-1.9' },
            { type: 'add', text: '+ 시퀀스 데이터 동결 최종 승인 완료' }
          ]
        }
      }
    ]
  },
  {
    id: "PROTO-DS-01",
    title: "MERS-VACCINE-EFFICACY-META-ANALYSIS",
    description: "메르스 코로나바이러스(MERS-CoV) 잠복 유망 백신 제형에 관한 종단 면역 반응 메타 분석 보고서입니다. 장기 항체 유지 기간 지표가 포함되어 있습니다.",
    currentVersion: "v2.0.4",
    category: "MERS",
    type: "의료 보고서",
    status: 'obsolete',
    stability: 25,
    lastUpdated: "2023-08-30 11:00 UTC",
    authors: ["System Automation"],
    relationships: [],
    versions: [
      {
        id: "v2.0.4",
        label: "v2.0.4 (폐지)",
        title: "임상 중단 및 폐지 처리",
        date: "2023년 8월 30일",
        summary: "신규 효능 유도체 발견으로 인하여 본 분석 문서는 정식 폐지(Obsolete) 처리되었으며, ARCH-2024 계열 문서로 계보가 흡수 이관되었습니다.",
        signer: "Manual Override Agent",
        diff: {
          addedCount: 1,
          removedCount: 10,
          lines: [
            { type: 'normal', text: '분석 요약' },
            { type: 'remove', text: '— 기존 v2 계열 임상 타당성 백서 활성화 유지' },
            { type: 'add', text: '+ 효능 지표 저하로 인한 폐쇄 및 타 아카이브로 통폐합 시행' }
          ]
        }
      }
    ]
  },
  {
    id: "QUAR-992-X",
    title: "QUAR-992-X - 격리 수송 시스템 격차 분석",
    description: "생물학적 위기 구역 간 자재 격리용 음압 크레이트의 수송 누출 방지 기하 및 공조 장비 성능 검증 격차 보고서.",
    currentVersion: "v5.0.1",
    category: "SARS-2003",
    type: "일반 데이터",
    status: 'active',
    stability: 100,
    lastUpdated: "2023-11-20 18:40 UTC",
    authors: ["Disaster Tech Team"],
    relationships: [],
    versions: [
      {
        id: "v5.0.1",
        label: "v5.0.1 (현재)",
        title: "압력 센싱 캘리브레이션 조항",
        date: "2023년 11월 20일",
        summary: "고도 변화에 따른 차압 센싱 오차 해소를 위해 수학적 대기 압력 보상 계수 조율 조항 삽입.",
        signer: "Lead Engineer K",
        diff: {
          addedCount: 4,
          removedCount: 0,
          lines: [
            { type: 'normal', text: '격실 3 내부 센서 조항' },
            { type: 'add', text: '+ 상시 실내 기압 대비 40Pa 음압 유지 조건 실시간 피드백 캘리브레이션 루프 정형화' }
          ]
        }
      }
    ]
  },
  {
    id: "H1N1-VACCINE-EFFICACY",
    title: "H1N1-VACCINE-EFFICACY-META-ANALYSIS",
    description: "2009년 H1N1 대유행 백신 제형에 의해 생성된 지속적인 면역 반응을 평가한 15년간의 종단 연구. 말기 교차 반응성 결과가 포함되어 있습니다.",
    currentVersion: "v1.0.0",
    category: "H1N1",
    type: "의료 보고서",
    status: 'active',
    stability: 100,
    lastUpdated: "2022-08-30 11:00 UTC",
    authors: ["Dr. Alan Stark", "Dr. Jane Cho"],
    relationships: [],
    versions: [
      {
        id: "v1.0.0",
        label: "v1.0.0",
        title: "최종 배포",
        date: "2022년 8월 30일",
        summary: "15년에 걸친 연령별 H1N1 인플루엔자 백신 효용성 보존 추적 데이터 기록 마감.",
        signer: "H1N1 Advisory Council",
        diff: {
          addedCount: 30,
          removedCount: 2,
          lines: [
            { type: 'normal', text: '초록 결론부' },
            { type: 'add', text: '+ 본 장기 종단 데이터는 향후 인플루엔자 아카이브의 핵심 벤치마크 역할을 담당함.' }
          ]
        }
      }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "LOG-001",
    time: "10:45 AM",
    date: "OCT 24",
    action: "메이저 버전 자동 승급: ARCH-2023",
    trigger: "System Automation",
    docId: "ARCH-2023-882",
    type: "system"
  },
  {
    id: "LOG-002",
    time: "09:12 AM",
    date: "OCT 24",
    action: "관계 업데이트: MED-REF-419",
    trigger: "Admin_User_01",
    docId: "MED-REF-419",
    type: "editorial"
  },
  {
    id: "LOG-003",
    time: "Yesterday - 04:30 PM",
    date: "OCT 23",
    action: "폐지 적용: PROTO-DS-01",
    trigger: "Manual override applied by Senior Coordinator",
    docId: "PROTO-DS-01",
    type: "obsolete"
  },
  {
    id: "LOG-004",
    time: "02:15 PM",
    date: "OCT 22",
    action: "신규 아카이브 등록: ARCH-2024-DRU-098",
    trigger: "Dr. Aris Thorne",
    docId: "ARCH-2024-DRU-098",
    type: "critical"
  }
];
