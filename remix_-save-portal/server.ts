import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoints FIRST

  // Chat endpoint leveraging @google/genai as standard server-side interface
  app.post("/api/chat", async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { message, checkedDocuments } = req.body;

      if (!message) {
        res.status(400).json({ error: "Message is required." });
        return;
      }

      const hasApiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY" && process.env.GEMINI_API_KEY.trim() !== "";

      // Lazy initialization of Gemini client to prevent startup crashes when key is missing
      if (hasApiKey) {
        try {
          const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build',
              },
            },
          });

          const docContext = (checkedDocuments || []).map((d: any) => 
            `[문서 ID: ${d.id}]\n제목: ${d.title}\n설명: ${d.description}\n분류: ${d.category}\n상태 ${d.status === 'active' ? '활성(최신)' : d.status === 'archived' ? '보관됨' : '폐지됨'}\n안정성 지표: ${d.stability}%\n최종 업데이트: ${d.lastUpdated}\n작성자: ${d.authors.join(", ")}\n버전 이력:\n${(d.versions || []).map((v: any) => `- ${v.id}: ${v.title} (${v.date}) -> ${v.summary}`).join('\n')}`
          ).join('\n\n');

          const prompt = `당신은 국가 재난 대응 및 의료 아카이브 시스템 'SAVE Portal'의 전문 RAG 어시스턴트입니다.
사용자 질문에 성실히 답변하십시오. 오직 아래 제공된 [참조 문서 데이터]에 근거하고 논리적으로 설명해 주세요.
친절하고 격식 있는 한국어 문체(하십시오체 위주, 신뢰감 있고 침착한 어조)로 답해야 합니다. 
만약 참조 데이터 외에 일반 의학 지식이 필요한 질문이라면 아카이브에 명시된 내용을 먼저 기술하고 보충 설명해 주십시오.

[참조 문서 데이터]
${docContext || '현재 어떠한 개별 참조지표도 선택되지 않았습니다. 전체 재난 아카이브 마스터 지식을 기준으로 답변해 주세요.'}

[사용자 질문]
${message}
`;

          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
          });

          // Access response.text property directly (not as a function)
          const text = response.text || "죄송합니다, 응답 수집에 오류가 발생했습니다.";
          res.json({ text, isRealAi: true });
          return;
        } catch (geminiError: any) {
          console.error("Gemini API error, falling back to mock:", geminiError);
          // Fall through to mock logic so user experience doesn't break
        }
      }

      // High-fidelity fallback simulated RAG engine
      let reply = "";
      const docIds = (checkedDocuments || []).map((d: any) => d.id);
      
      const lower = message.toLowerCase();
      if (checkedDocuments && checkedDocuments.length > 0) {
        reply += `[SAVE RAG 검색 가이던스] 선택하신 ${checkedDocuments.length}개의 아카이브(${docIds.join(", ")})를 구조적으로 정밀 분석한 결과입니다.\n\n`;
        
        if (lower.includes("비교") || lower.includes("차이") || lower.includes("반응") || lower.includes("시간")) {
          reply += `1. **백신 및 프로토콜 면역 속도 분석:**\n`;
          if (docIds.includes("ARCH-2024-DRU-098")) {
            reply += `- **ARCH-2024-DRU-098(생물학적 위험 대응):** 해당 프로토콜 v2.4.1 개정 사항에 의하면, 1구역 진입 시 A등급 가압 화학 슈트 착용과 오염 제거 사이트 경계 B 중심의 실시간 산소 텔레메트리 연동이 수립되어 있습니다. 수송 및 투입 14일차 내에 격리 체계의 안정성이 확보됩니다.\n`;
          }
          if (docIds.includes("H1N1-VACCINE-EFFICACY")) {
            reply += `- **H1N1-VACCINE-EFFICACY(H1N1 메타 분석):** 2009년 백신 제형 15개년 추적 조사 v1.0.0 결과, 백신 접종 후 정점 항체 반응 관찰은 평균 **21일차**에 도달하는 장기적 추이를 나타냅니다.\n`;
          }
          if (docIds.includes("ARCH-2023-882")) {
            reply += `- **ARCH-2023-882(COVID-19 아카이브):** 오미크론 코호트 및 변이 급증 인덱스 v4.2.1 데이터셋에 기초할 때, 부스터 접종 완료 후 약 **14일차** 내외에서 면역 반응의 피크(최고치 상승)가 관찰되는 등 백신 교차 반응 속도가 신속하게 상승합니다.\n`;
          }
          reply += `\n2. **결론적 요약:** COVID-19 오미크론 부스터 반응(14일)이 2009년 H1N1 백신 정점 항체 반응 시간(21일)보다 상대적으로 빠른 발현 양상을 나타냅니다. 이는 수립된 생체 인증 및 실시간 텔레메트리 관제와 결용되어 긴급 방제 시 7일의 전개 시차 이점을 제공합니다.`;
        } else if (lower.includes("개인보호장구") || lower.includes("ppe") || lower.includes("슈트") || lower.includes("등급")) {
          reply += `선택해주신 **ARCH-2024-DRU-098 개정 내역**에 의하면, 기존 v2.4.0 대비 v2.4.1에서 다음과 같은 규정 승급이 단행되었습니다:\n\n`;
          reply += `- **보호복 등급 강화:** 기존의 표준 B등급 유해 물질 슈트에서 1구역 진입 시 **A등급 가압 화학 슈트** 사용이 전면 필수화되었습니다.\n`;
          reply += `- **산소 모니터링:** 수동 측정에서 **실시간 산소 텔레메트리 시스템** 도입을 의무화하였습니다.\n`;
          reply += `- **기록 자동화:** 체크포인트에서 진행되던 출입 수동 기록을 폐지하고, 포털 4를 통해 **생체 인증 로그**를 자동으로 수집하도록 조치했습니다.`;
        } else {
          // General document summarization
          reply += `선택된 문서들의 보존 가치를 확인했습니다. 아래의 핵심 사항이 참조되었습니다:\n\n`;
          checkedDocuments.forEach((doc: any) => {
            reply += `- **${doc.id} (${doc.title}):** ${doc.description} (현재 고유 상태: ${doc.status === 'active' ? '최적 가용' : '보관 중'})\n`;
          });
          reply += `\n상세 검증을 진행하시려면 구체적인 비교 질의(예: '백신 반응 시간 비교', 'PPE 의무 등급 조항 정보')를 추가로 입력하십시오.`;
        }
      } else {
        // No docs checked
        reply += `현재 선택된 개별 RAG 문서가 지정되지 않았습니다. 포털 내 전체 ${lower.includes("메르스") || lower.includes("mers") ? "MERS-Cov 잠복 변체 및 백신 연구" : lower.includes("사스") || lower.includes("sars") ? "SARS-CoV 유전체 변이" : "재난 관리 표준 운영 매뉴얼"} 지식창고를 연계하여 검색한 결과입니다.\n\n`;
        reply += `전체 아카이브를 탐색할 결과, 급성 비상 단계에서 실시간 음압 밀폐, 산소 텔레메트리 연계(v2.4.1), 국가 전파 벡터 추적 인덱스가 유기적으로 매핑되어 있음이 확인되었습니다. 구체적 질의를 받으려면 아카이브 매니저 목록 내부에서 문서를 1개 이상 체크한 후 RAG 모드로 연동해 주시기 바랍니다.`;
      }

      reply += `\n\n*(알림: 본 답변은 SAVE RAG Mock 모델 엔진에 의해 산출되었습니다. 개발자 설정에 실제 GEMINI_API_KEY가 입력되면 정교한 Gemini 실시간 문맥 해석 답변이 가동됩니다.)*`;
      res.json({ text: reply, isRealAi: false });

    } catch (error: any) {
      console.error("General chat endpoint error:", error);
      res.status(500).json({ error: error.message || "An unexpected error occurred." });
    }
  });

  // Serve static files in production or hook Vite in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting on http://localhost:${PORT} under NODE_ENV=${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
