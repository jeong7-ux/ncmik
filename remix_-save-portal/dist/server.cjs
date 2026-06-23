var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, checkedDocuments } = req.body;
      if (!message) {
        res.status(400).json({ error: "Message is required." });
        return;
      }
      const hasApiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY" && process.env.GEMINI_API_KEY.trim() !== "";
      if (hasApiKey) {
        try {
          const ai = new import_genai.GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
            httpOptions: {
              headers: {
                "User-Agent": "aistudio-build"
              }
            }
          });
          const docContext = (checkedDocuments || []).map(
            (d) => `[\uBB38\uC11C ID: ${d.id}]
\uC81C\uBAA9: ${d.title}
\uC124\uBA85: ${d.description}
\uBD84\uB958: ${d.category}
\uC0C1\uD0DC ${d.status === "active" ? "\uD65C\uC131(\uCD5C\uC2E0)" : d.status === "archived" ? "\uBCF4\uAD00\uB428" : "\uD3D0\uC9C0\uB428"}
\uC548\uC815\uC131 \uC9C0\uD45C: ${d.stability}%
\uCD5C\uC885 \uC5C5\uB370\uC774\uD2B8: ${d.lastUpdated}
\uC791\uC131\uC790: ${d.authors.join(", ")}
\uBC84\uC804 \uC774\uB825:
${(d.versions || []).map((v) => `- ${v.id}: ${v.title} (${v.date}) -> ${v.summary}`).join("\n")}`
          ).join("\n\n");
          const prompt = `\uB2F9\uC2E0\uC740 \uAD6D\uAC00 \uC7AC\uB09C \uB300\uC751 \uBC0F \uC758\uB8CC \uC544\uCE74\uC774\uBE0C \uC2DC\uC2A4\uD15C 'SAVE Portal'\uC758 \uC804\uBB38 RAG \uC5B4\uC2DC\uC2A4\uD134\uD2B8\uC785\uB2C8\uB2E4.
\uC0AC\uC6A9\uC790 \uC9C8\uBB38\uC5D0 \uC131\uC2E4\uD788 \uB2F5\uBCC0\uD558\uC2ED\uC2DC\uC624. \uC624\uC9C1 \uC544\uB798 \uC81C\uACF5\uB41C [\uCC38\uC870 \uBB38\uC11C \uB370\uC774\uD130]\uC5D0 \uADFC\uAC70\uD558\uACE0 \uB17C\uB9AC\uC801\uC73C\uB85C \uC124\uBA85\uD574 \uC8FC\uC138\uC694.
\uCE5C\uC808\uD558\uACE0 \uACA9\uC2DD \uC788\uB294 \uD55C\uAD6D\uC5B4 \uBB38\uCCB4(\uD558\uC2ED\uC2DC\uC624\uCCB4 \uC704\uC8FC, \uC2E0\uB8B0\uAC10 \uC788\uACE0 \uCE68\uCC29\uD55C \uC5B4\uC870)\uB85C \uB2F5\uD574\uC57C \uD569\uB2C8\uB2E4. 
\uB9CC\uC57D \uCC38\uC870 \uB370\uC774\uD130 \uC678\uC5D0 \uC77C\uBC18 \uC758\uD559 \uC9C0\uC2DD\uC774 \uD544\uC694\uD55C \uC9C8\uBB38\uC774\uB77C\uBA74 \uC544\uCE74\uC774\uBE0C\uC5D0 \uBA85\uC2DC\uB41C \uB0B4\uC6A9\uC744 \uBA3C\uC800 \uAE30\uC220\uD558\uACE0 \uBCF4\uCDA9 \uC124\uBA85\uD574 \uC8FC\uC2ED\uC2DC\uC624.

[\uCC38\uC870 \uBB38\uC11C \uB370\uC774\uD130]
${docContext || "\uD604\uC7AC \uC5B4\uB5A0\uD55C \uAC1C\uBCC4 \uCC38\uC870\uC9C0\uD45C\uB3C4 \uC120\uD0DD\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. \uC804\uCCB4 \uC7AC\uB09C \uC544\uCE74\uC774\uBE0C \uB9C8\uC2A4\uD130 \uC9C0\uC2DD\uC744 \uAE30\uC900\uC73C\uB85C \uB2F5\uBCC0\uD574 \uC8FC\uC138\uC694."}

[\uC0AC\uC6A9\uC790 \uC9C8\uBB38]
${message}
`;
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt
          });
          const text = response.text || "\uC8C4\uC1A1\uD569\uB2C8\uB2E4, \uC751\uB2F5 \uC218\uC9D1\uC5D0 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.";
          res.json({ text, isRealAi: true });
          return;
        } catch (geminiError) {
          console.error("Gemini API error, falling back to mock:", geminiError);
        }
      }
      let reply = "";
      const docIds = (checkedDocuments || []).map((d) => d.id);
      const lower = message.toLowerCase();
      if (checkedDocuments && checkedDocuments.length > 0) {
        reply += `[SAVE RAG \uAC80\uC0C9 \uAC00\uC774\uB358\uC2A4] \uC120\uD0DD\uD558\uC2E0 ${checkedDocuments.length}\uAC1C\uC758 \uC544\uCE74\uC774\uBE0C(${docIds.join(", ")})\uB97C \uAD6C\uC870\uC801\uC73C\uB85C \uC815\uBC00 \uBD84\uC11D\uD55C \uACB0\uACFC\uC785\uB2C8\uB2E4.

`;
        if (lower.includes("\uBE44\uAD50") || lower.includes("\uCC28\uC774") || lower.includes("\uBC18\uC751") || lower.includes("\uC2DC\uAC04")) {
          reply += `1. **\uBC31\uC2E0 \uBC0F \uD504\uB85C\uD1A0\uCF5C \uBA74\uC5ED \uC18D\uB3C4 \uBD84\uC11D:**
`;
          if (docIds.includes("ARCH-2024-DRU-098")) {
            reply += `- **ARCH-2024-DRU-098(\uC0DD\uBB3C\uD559\uC801 \uC704\uD5D8 \uB300\uC751):** \uD574\uB2F9 \uD504\uB85C\uD1A0\uCF5C v2.4.1 \uAC1C\uC815 \uC0AC\uD56D\uC5D0 \uC758\uD558\uBA74, 1\uAD6C\uC5ED \uC9C4\uC785 \uC2DC A\uB4F1\uAE09 \uAC00\uC555 \uD654\uD559 \uC288\uD2B8 \uCC29\uC6A9\uACFC \uC624\uC5FC \uC81C\uAC70 \uC0AC\uC774\uD2B8 \uACBD\uACC4 B \uC911\uC2EC\uC758 \uC2E4\uC2DC\uAC04 \uC0B0\uC18C \uD154\uB808\uBA54\uD2B8\uB9AC \uC5F0\uB3D9\uC774 \uC218\uB9BD\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4. \uC218\uC1A1 \uBC0F \uD22C\uC785 14\uC77C\uCC28 \uB0B4\uC5D0 \uACA9\uB9AC \uCCB4\uACC4\uC758 \uC548\uC815\uC131\uC774 \uD655\uBCF4\uB429\uB2C8\uB2E4.
`;
          }
          if (docIds.includes("H1N1-VACCINE-EFFICACY")) {
            reply += `- **H1N1-VACCINE-EFFICACY(H1N1 \uBA54\uD0C0 \uBD84\uC11D):** 2009\uB144 \uBC31\uC2E0 \uC81C\uD615 15\uAC1C\uB144 \uCD94\uC801 \uC870\uC0AC v1.0.0 \uACB0\uACFC, \uBC31\uC2E0 \uC811\uC885 \uD6C4 \uC815\uC810 \uD56D\uCCB4 \uBC18\uC751 \uAD00\uCC30\uC740 \uD3C9\uADE0 **21\uC77C\uCC28**\uC5D0 \uB3C4\uB2EC\uD558\uB294 \uC7A5\uAE30\uC801 \uCD94\uC774\uB97C \uB098\uD0C0\uB0C5\uB2C8\uB2E4.
`;
          }
          if (docIds.includes("ARCH-2023-882")) {
            reply += `- **ARCH-2023-882(COVID-19 \uC544\uCE74\uC774\uBE0C):** \uC624\uBBF8\uD06C\uB860 \uCF54\uD638\uD2B8 \uBC0F \uBCC0\uC774 \uAE09\uC99D \uC778\uB371\uC2A4 v4.2.1 \uB370\uC774\uD130\uC14B\uC5D0 \uAE30\uCD08\uD560 \uB54C, \uBD80\uC2A4\uD130 \uC811\uC885 \uC644\uB8CC \uD6C4 \uC57D **14\uC77C\uCC28** \uB0B4\uC678\uC5D0\uC11C \uBA74\uC5ED \uBC18\uC751\uC758 \uD53C\uD06C(\uCD5C\uACE0\uCE58 \uC0C1\uC2B9)\uAC00 \uAD00\uCC30\uB418\uB294 \uB4F1 \uBC31\uC2E0 \uAD50\uCC28 \uBC18\uC751 \uC18D\uB3C4\uAC00 \uC2E0\uC18D\uD558\uAC8C \uC0C1\uC2B9\uD569\uB2C8\uB2E4.
`;
          }
          reply += `
2. **\uACB0\uB860\uC801 \uC694\uC57D:** COVID-19 \uC624\uBBF8\uD06C\uB860 \uBD80\uC2A4\uD130 \uBC18\uC751(14\uC77C)\uC774 2009\uB144 H1N1 \uBC31\uC2E0 \uC815\uC810 \uD56D\uCCB4 \uBC18\uC751 \uC2DC\uAC04(21\uC77C)\uBCF4\uB2E4 \uC0C1\uB300\uC801\uC73C\uB85C \uBE60\uB978 \uBC1C\uD604 \uC591\uC0C1\uC744 \uB098\uD0C0\uB0C5\uB2C8\uB2E4. \uC774\uB294 \uC218\uB9BD\uB41C \uC0DD\uCCB4 \uC778\uC99D \uBC0F \uC2E4\uC2DC\uAC04 \uD154\uB808\uBA54\uD2B8\uB9AC \uAD00\uC81C\uC640 \uACB0\uC6A9\uB418\uC5B4 \uAE34\uAE09 \uBC29\uC81C \uC2DC 7\uC77C\uC758 \uC804\uAC1C \uC2DC\uCC28 \uC774\uC810\uC744 \uC81C\uACF5\uD569\uB2C8\uB2E4.`;
        } else if (lower.includes("\uAC1C\uC778\uBCF4\uD638\uC7A5\uAD6C") || lower.includes("ppe") || lower.includes("\uC288\uD2B8") || lower.includes("\uB4F1\uAE09")) {
          reply += `\uC120\uD0DD\uD574\uC8FC\uC2E0 **ARCH-2024-DRU-098 \uAC1C\uC815 \uB0B4\uC5ED**\uC5D0 \uC758\uD558\uBA74, \uAE30\uC874 v2.4.0 \uB300\uBE44 v2.4.1\uC5D0\uC11C \uB2E4\uC74C\uACFC \uAC19\uC740 \uADDC\uC815 \uC2B9\uAE09\uC774 \uB2E8\uD589\uB418\uC5C8\uC2B5\uB2C8\uB2E4:

`;
          reply += `- **\uBCF4\uD638\uBCF5 \uB4F1\uAE09 \uAC15\uD654:** \uAE30\uC874\uC758 \uD45C\uC900 B\uB4F1\uAE09 \uC720\uD574 \uBB3C\uC9C8 \uC288\uD2B8\uC5D0\uC11C 1\uAD6C\uC5ED \uC9C4\uC785 \uC2DC **A\uB4F1\uAE09 \uAC00\uC555 \uD654\uD559 \uC288\uD2B8** \uC0AC\uC6A9\uC774 \uC804\uBA74 \uD544\uC218\uD654\uB418\uC5C8\uC2B5\uB2C8\uB2E4.
`;
          reply += `- **\uC0B0\uC18C \uBAA8\uB2C8\uD130\uB9C1:** \uC218\uB3D9 \uCE21\uC815\uC5D0\uC11C **\uC2E4\uC2DC\uAC04 \uC0B0\uC18C \uD154\uB808\uBA54\uD2B8\uB9AC \uC2DC\uC2A4\uD15C** \uB3C4\uC785\uC744 \uC758\uBB34\uD654\uD558\uC600\uC2B5\uB2C8\uB2E4.
`;
          reply += `- **\uAE30\uB85D \uC790\uB3D9\uD654:** \uCCB4\uD06C\uD3EC\uC778\uD2B8\uC5D0\uC11C \uC9C4\uD589\uB418\uB358 \uCD9C\uC785 \uC218\uB3D9 \uAE30\uB85D\uC744 \uD3D0\uC9C0\uD558\uACE0, \uD3EC\uD138 4\uB97C \uD1B5\uD574 **\uC0DD\uCCB4 \uC778\uC99D \uB85C\uADF8**\uB97C \uC790\uB3D9\uC73C\uB85C \uC218\uC9D1\uD558\uB3C4\uB85D \uC870\uCE58\uD588\uC2B5\uB2C8\uB2E4.`;
        } else {
          reply += `\uC120\uD0DD\uB41C \uBB38\uC11C\uB4E4\uC758 \uBCF4\uC874 \uAC00\uCE58\uB97C \uD655\uC778\uD588\uC2B5\uB2C8\uB2E4. \uC544\uB798\uC758 \uD575\uC2EC \uC0AC\uD56D\uC774 \uCC38\uC870\uB418\uC5C8\uC2B5\uB2C8\uB2E4:

`;
          checkedDocuments.forEach((doc) => {
            reply += `- **${doc.id} (${doc.title}):** ${doc.description} (\uD604\uC7AC \uACE0\uC720 \uC0C1\uD0DC: ${doc.status === "active" ? "\uCD5C\uC801 \uAC00\uC6A9" : "\uBCF4\uAD00 \uC911"})
`;
          });
          reply += `
\uC0C1\uC138 \uAC80\uC99D\uC744 \uC9C4\uD589\uD558\uC2DC\uB824\uBA74 \uAD6C\uCCB4\uC801\uC778 \uBE44\uAD50 \uC9C8\uC758(\uC608: '\uBC31\uC2E0 \uBC18\uC751 \uC2DC\uAC04 \uBE44\uAD50', 'PPE \uC758\uBB34 \uB4F1\uAE09 \uC870\uD56D \uC815\uBCF4')\uB97C \uCD94\uAC00\uB85C \uC785\uB825\uD558\uC2ED\uC2DC\uC624.`;
        }
      } else {
        reply += `\uD604\uC7AC \uC120\uD0DD\uB41C \uAC1C\uBCC4 RAG \uBB38\uC11C\uAC00 \uC9C0\uC815\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. \uD3EC\uD138 \uB0B4 \uC804\uCCB4 ${lower.includes("\uBA54\uB974\uC2A4") || lower.includes("mers") ? "MERS-Cov \uC7A0\uBCF5 \uBCC0\uCCB4 \uBC0F \uBC31\uC2E0 \uC5F0\uAD6C" : lower.includes("\uC0AC\uC2A4") || lower.includes("sars") ? "SARS-CoV \uC720\uC804\uCCB4 \uBCC0\uC774" : "\uC7AC\uB09C \uAD00\uB9AC \uD45C\uC900 \uC6B4\uC601 \uB9E4\uB274\uC5BC"} \uC9C0\uC2DD\uCC3D\uACE0\uB97C \uC5F0\uACC4\uD558\uC5EC \uAC80\uC0C9\uD55C \uACB0\uACFC\uC785\uB2C8\uB2E4.

`;
        reply += `\uC804\uCCB4 \uC544\uCE74\uC774\uBE0C\uB97C \uD0D0\uC0C9\uD560 \uACB0\uACFC, \uAE09\uC131 \uBE44\uC0C1 \uB2E8\uACC4\uC5D0\uC11C \uC2E4\uC2DC\uAC04 \uC74C\uC555 \uBC00\uD3D0, \uC0B0\uC18C \uD154\uB808\uBA54\uD2B8\uB9AC \uC5F0\uACC4(v2.4.1), \uAD6D\uAC00 \uC804\uD30C \uBCA1\uD130 \uCD94\uC801 \uC778\uB371\uC2A4\uAC00 \uC720\uAE30\uC801\uC73C\uB85C \uB9E4\uD551\uB418\uC5B4 \uC788\uC74C\uC774 \uD655\uC778\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uAD6C\uCCB4\uC801 \uC9C8\uC758\uB97C \uBC1B\uC73C\uB824\uBA74 \uC544\uCE74\uC774\uBE0C \uB9E4\uB2C8\uC800 \uBAA9\uB85D \uB0B4\uBD80\uC5D0\uC11C \uBB38\uC11C\uB97C 1\uAC1C \uC774\uC0C1 \uCCB4\uD06C\uD55C \uD6C4 RAG \uBAA8\uB4DC\uB85C \uC5F0\uB3D9\uD574 \uC8FC\uC2DC\uAE30 \uBC14\uB78D\uB2C8\uB2E4.`;
      }
      reply += `

*(\uC54C\uB9BC: \uBCF8 \uB2F5\uBCC0\uC740 SAVE RAG Mock \uBAA8\uB378 \uC5D4\uC9C4\uC5D0 \uC758\uD574 \uC0B0\uCD9C\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uAC1C\uBC1C\uC790 \uC124\uC815\uC5D0 \uC2E4\uC81C GEMINI_API_KEY\uAC00 \uC785\uB825\uB418\uBA74 \uC815\uAD50\uD55C Gemini \uC2E4\uC2DC\uAC04 \uBB38\uB9E5 \uD574\uC11D \uB2F5\uBCC0\uC774 \uAC00\uB3D9\uB429\uB2C8\uB2E4.)*`;
      res.json({ text: reply, isRealAi: false });
    } catch (error) {
      console.error("General chat endpoint error:", error);
      res.status(500).json({ error: error.message || "An unexpected error occurred." });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting on http://localhost:${PORT} under NODE_ENV=${process.env.NODE_ENV || "development"}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
//# sourceMappingURL=server.cjs.map
