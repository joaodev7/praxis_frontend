import {
  validateFile,
  MAX_IMAGE_SIZE_BYTES,
  MAX_PDF_SIZE_BYTES,
} from './fileService';

/**
 * Testes unitários para as funções de validação de arquivo do fileService.
 */
export function runFileServiceValidationTests(): { total: number; passed: number; failed: number } {
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      passed++;
      console.log(`✓ [PASS] ${testName}`);
    } else {
      failed++;
      console.error(`✗ [FAIL] ${testName}`);
    }
  }

  // 1. Imagem JPEG válida
  const validJpeg = new File(['dummy content'], 'foto.jpg', { type: 'image/jpeg' });
  Object.defineProperty(validJpeg, 'size', { value: 1024 * 500 });
  assert(validateFile(validJpeg).isValid === true, 'Deve aceitar imagem JPEG válida');

  // 2. Imagem PNG válida
  const validPng = new File(['dummy content'], 'foto.png', { type: 'image/png' });
  Object.defineProperty(validPng, 'size', { value: 1024 * 1024 });
  assert(validateFile(validPng).isValid === true, 'Deve aceitar imagem PNG válida');

  // 3. Imagem WEBP válida
  const validWebp = new File(['dummy content'], 'foto.webp', { type: 'image/webp' });
  Object.defineProperty(validWebp, 'size', { value: 1024 * 300 });
  assert(validateFile(validWebp).isValid === true, 'Deve aceitar imagem WEBP válida');

  // 4. PDF válido
  const validPdf = new File(['dummy content'], 'laudo.pdf', { type: 'application/pdf' });
  Object.defineProperty(validPdf, 'size', { value: 1024 * 1024 * 4 });
  assert(validateFile(validPdf).isValid === true, 'Deve aceitar documento PDF válido');

  // 5. Tipo não permitido (EXE)
  const invalidExe = new File(['malware'], 'setup.exe', { type: 'application/x-msdownload' });
  Object.defineProperty(invalidExe, 'size', { value: 1024 });
  assert(validateFile(invalidExe).isValid === false, 'Deve rejeitar arquivo EXE');

  // 6. Tipo não permitido (TXT)
  const invalidTxt = new File(['texto'], 'notas.txt', { type: 'text/plain' });
  Object.defineProperty(invalidTxt, 'size', { value: 1024 });
  assert(validateFile(invalidTxt).isValid === false, 'Deve rejeitar arquivo TXT');

  // 7. Imagem excedendo 5 MB
  const bigImage = new File(['big image'], 'foto_gigante.jpg', { type: 'image/jpeg' });
  Object.defineProperty(bigImage, 'size', { value: MAX_IMAGE_SIZE_BYTES + 1024 });
  const bigImageRes = validateFile(bigImage);
  assert(bigImageRes.isValid === false && bigImageRes.error?.includes('5 MB') === true, 'Deve rejeitar imagem maior que 5 MB com mensagem correta');

  // 8. PDF excedendo 10 MB
  const bigPdf = new File(['big pdf'], 'laudo_pesado.pdf', { type: 'application/pdf' });
  Object.defineProperty(bigPdf, 'size', { value: MAX_PDF_SIZE_BYTES + 1024 });
  const bigPdfRes = validateFile(bigPdf);
  assert(bigPdfRes.isValid === false && bigPdfRes.error?.includes('10 MB') === true, 'Deve rejeitar PDF maior que 10 MB com mensagem correta');

  // 9. Arquivo vazio (0 bytes)
  const emptyFile = new File([], 'vazio.jpg', { type: 'image/jpeg' });
  Object.defineProperty(emptyFile, 'size', { value: 0 });
  assert(validateFile(emptyFile).isValid === false, 'Deve rejeitar arquivo com 0 bytes');

  console.log(`\nResumo dos testes: ${passed} passaram, ${failed} falharam de um total de ${passed + failed}.`);
  return { total: passed + failed, passed, failed };
}
