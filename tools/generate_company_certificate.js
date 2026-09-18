const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const artifactDir = 'C:\\Users\\Vov\\.gemini\\antigravity\\brain\\8670c2bf-bbad-4d7d-bf87-bb54a9e054f2';
const outputPath = path.join(artifactDir, 'company_registration_certificate.png');
const localOutputPath = path.join(__dirname, 'company_registration_certificate.png');

const certificateHtml = `
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <style>
    @page { size: A4; margin: 0; }
    body {
      width: 1200px;
      height: 1697px;
      margin: 0;
      padding: 80px 100px;
      box-sizing: border-box;
      font-family: "Times New Roman", Times, serif;
      background: #fffdf9;
      color: #1a1a1a;
      position: relative;
    }
    .border-outer {
      position: absolute;
      top: 30px; left: 30px; right: 30px; bottom: 30px;
      border: 4px solid #1a365d;
      padding: 10px;
    }
    .border-inner {
      position: absolute;
      top: 40px; left: 40px; right: 40px; bottom: 40px;
      border: 1.5px solid #2b6cb0;
    }
    .header {
      text-align: center;
      margin-top: 40px;
    }
    .coat-of-arms {
      font-size: 55px;
      color: #d69e2e;
      margin-bottom: 10px;
    }
    .country-title {
      font-size: 26px;
      font-weight: bold;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #1a365d;
      margin-bottom: 5px;
    }
    .ministry-title {
      font-size: 18px;
      color: #4a5568;
      margin-bottom: 30px;
    }
    .doc-title {
      font-size: 32px;
      font-weight: bold;
      text-transform: uppercase;
      color: #1a365d;
      border-bottom: 2px solid #1a365d;
      display: inline-block;
      padding-bottom: 8px;
      margin-bottom: 40px;
    }
    .content {
      font-size: 20px;
      line-height: 1.8;
      margin-top: 20px;
    }
    .field-row {
      margin-bottom: 25px;
    }
    .label {
      font-weight: bold;
      color: #2d3748;
    }
    .value {
      border-bottom: 1px dotted #4a5568;
      display: inline-block;
      padding-left: 10px;
      font-weight: 600;
      color: #000;
    }
    .legal-box {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 25px;
      margin: 35px 0;
    }
    .footer {
      margin-top: 80px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .stamp-box {
      position: relative;
      width: 180px;
      height: 180px;
    }
    .seal {
      width: 160px;
      height: 160px;
      border: 4px double #2b6cb0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 12px;
      font-weight: bold;
      color: #2b6cb0;
      transform: rotate(-12deg);
      opacity: 0.85;
      background: rgba(43, 108, 176, 0.03);
    }
    .signature {
      font-family: "Brush Script MT", cursive, sans-serif;
      font-size: 32px;
      color: #1a365d;
      border-bottom: 1px solid #000;
      padding: 0 30px;
    }
    .qr-code {
      width: 110px;
      height: 110px;
      border: 1px solid #cbd5e0;
      padding: 5px;
      background: #fff;
    }
  </style>
</head>
<body>
  <div class="border-outer"></div>
  <div class="border-inner"></div>

  <div class="header">
    <div class="coat-of-arms">🔱</div>
    <div class="country-title">УКРАЇНА</div>
    <div class="ministry-title">МІНІСТЕРСТВО ЮСТИЦІЇ УКРАЇНИ</div>
    <div class="doc-title">ВИПИСКА<br><span style="font-size: 18px; font-weight: normal;">з Єдиного державного реєстру юридичних осіб, фізичних осіб-підприємців та громадських формувань</span></div>
  </div>

  <div class="content">
    <div class="field-row">
      <span class="label">Повне найменування юридичної особи:</span><br>
      <span class="value" style="font-size: 22px; width: 95%;">ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ "ВІРАЛ МОБАЙЛ ГЕЙМС" (ТОВ "VIRAL MOBILE GAMES")</span>
    </div>

    <div class="field-row">
      <span class="label">Ідентифікаційний код юридичної особи (ЄДРПОУ):</span>
      <span class="value" style="width: 300px;">43981245</span>
    </div>

    <div class="legal-box">
      <div class="field-row" style="margin-bottom: 15px;">
        <span class="label">Місцезнаходження юридичної особи:</span><br>
        <span class="value" style="width: 98%; font-size: 19px;">Україна, Вінницька обл., Чечельницький район, м. Вінниця, буд. 12</span>
      </div>

      <div class="field-row" style="margin-bottom: 15px;">
        <span class="label">Основний вид економічної діяльності (КВЕД):</span><br>
        <span class="value" style="width: 98%;">58.21 Видання комп'ютерних ігор / 62.01 Комп'ютерне програмування</span>
      </div>

      <div class="field-row" style="margin-bottom: 0;">
        <span class="label">Дата та номер запису в Єдиному державному реєстрі:</span><br>
        <span class="value" style="width: 98%;">14.01.2023, № 1 000 102 0000 045981</span>
      </div>
    </div>

    <div class="field-row">
      <span class="label">Керівник / Уповноважена особа:</span>
      <span class="value" style="width: 500px;">Мурадян Володимир Володимирович</span>
    </div>

    <div class="field-row">
      <span class="label">Статус юридичної особи:</span>
      <span class="value" style="color: #276749; width: 400px;">зареєстровано (діюче)</span>
    </div>
  </div>

  <div class="footer">
    <div>
      <div class="label" style="font-size: 16px;">Державний реєстратор:</div>
      <div class="signature">В. В. Кравченко</div>
      <div style="font-size: 14px; color: #718096; margin-top: 5px;">Дата видачі: 15.01.2023 р.</div>
    </div>

    <div class="stamp-box">
      <div class="seal">
        ЄДИНИЙ ДЕРЖАВНИЙ РЕЄСТР<br>★ УКРАЇНА ★<br>ДЕРЖАВНА РЕЄСТРАЦІЯ
      </div>
    </div>

    <div>
      <img class="qr-code" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://usr.minjust.gov.ua/content/check/43981245" alt="QR Check">
      <div style="font-size: 11px; text-align: center; color: #718096; margin-top: 4px;">Код перевірки: 43981245</div>
    </div>
  </div>
</body>
</html>
`;

async function generateCertificateImage() {
  console.log('Generating updated Business Registration Certificate image for Viral Mobile Games...');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1697, deviceScaleFactor: 2 });
  await page.setContent(certificateHtml, { waitUntil: 'networkidle2' });

  await page.screenshot({ path: outputPath, type: 'png', fullPage: true });
  await page.screenshot({ path: localOutputPath, type: 'png', fullPage: true });

  console.log(`✅ Saved Certificate Image to: ${outputPath}`);
  console.log(`✅ Saved Local Image to: ${localOutputPath}`);

  await browser.close();
}

generateCertificateImage().catch(console.error);
