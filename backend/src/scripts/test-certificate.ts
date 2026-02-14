import fs from "fs";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

async function generateTestCertificate() {
  const templatePath = path.join(
    __dirname,
    "../assets/certificates/template.pdf"
  );

  const outputPath = path.join(
    __dirname,
    "../assets/certificates/output-test.pdf"
  );

  const templateBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);

  const page = pdfDoc.getPages()[0];
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  page.drawText("Yash Rathore", {
    x: 200,
    y: 300,
    size: 28,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText("Intro to Cloud Workshop", {
    x: 180,
    y: 260,
    size: 16,
    font,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);

  console.log("✅ Certificate generated:", outputPath);
}

generateTestCertificate();
