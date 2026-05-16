const fs = require('fs');
const code = `
$docPath = 'C:\\Users\\USER\\imformation\\Codenergy_연구일지_landscape_2026-05-16_final.docx'
try { $word = [System.Runtime.InteropServices.Marshal]::GetActiveObject('Word.Application') } catch { $word = New-Object -ComObject Word.Application }
$word.Visible = $true
$doc = $word.Documents.Open($docPath)
$selection = $word.Selection
$selection.EndKey(6) | Out-Null
$selection.InsertBreak(7)
$selection.TypeParagraph()
$selection.Font.Size = 24
$selection.TypeText('부록: 주요 앱 실행 화면 (코딩 결과)')
$selection.TypeParagraph()
$images = @('screen1.png', 'screen2.png', 'screen3.png', 'screen4.png', 'screen5.png')
$titles = @('1. 메인 랜딩 페이지', '2. 코딩테스트 도입부', '3. 트레일 맵 화면', '4. 아바타 커스터마이징', '5. 강의 시스템')
for ($i=0; $i -lt 5; $i++) {
    $p = 'C:\\Users\\USER\\imformation\\' + $images[$i]
    if (Test-Path $p) {
        $selection.Font.Size = 16
        $selection.TypeText($titles[$i])
        $selection.TypeParagraph()
        $shape = $selection.InlineShapes.AddPicture($p, $false, $true)
        if ($shape.Width -gt 650) { $shape.Height = $shape.Height * (650/$shape.Width); $shape.Width = 650 }
        $selection.TypeParagraph()
    }
}
$doc.Save()
Write-Output 'Done'
`;
fs.writeFileSync('insert_images.ps1', '\uFEFF' + code, 'utf16le');
