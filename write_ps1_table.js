const fs = require('fs');

const code = `
$docPath = 'C:\\Users\\USER\\imformation\\Codenergy_연구일지_landscape_2026-05-16_final.docx'
try { $word = [System.Runtime.InteropServices.Marshal]::GetActiveObject('Word.Application') } catch { $word = New-Object -ComObject Word.Application }
$word.Visible = $true
$doc = $null
foreach ($d in $word.Documents) {
    if ($d.FullName -replace '\\\\', '/' -eq $docPath) {
        $doc = $d
        break
    }
}
if ($null -eq $doc) {
    $doc = $word.Documents.Open($docPath)
}
$doc.Activate()

$selection = $word.Selection
$selection.HomeKey(6) | Out-Null
$find = $selection.Find
$find.Text = "부록: 주요 앱 실행 화면"
if ($find.Execute()) {
    $range = $selection.Range
    $range.End = $doc.Content.End
    $range.Delete()
}

$selection.EndKey(6) | Out-Null
$selection.TypeParagraph()
$selection.Font.Size = 24
$selection.Font.Bold = $true
$selection.TypeText("부록: 주요 앱 실행 화면 (코딩 결과)")
$selection.TypeParagraph()
$selection.Font.Size = 12
$selection.Font.Bold = $false
$selection.TypeParagraph()

$images = @('screen1.png', 'screen2.png', 'screen3.png', 'screen4.png', 'screen5.png')
$titles = @("1. 메인 랜딩 페이지", "2. 코딩테스트 도입부", "3. 트레일 맵 화면", "4. 아바타 커스터마이징", "5. 강의 시스템")
$descriptions = @(
    "일자: 2026-05-06\`n프런트엔드 초기 골격 작업 시 구축된 메인 화면입니다. 전반적인 서비스 소개와 진입점을 담당합니다.",
    "일자: 2026-05-06 ~ 05-09\`n사용자의 실력을 진단하기 위한 코딩테스트 페이지입니다. 테스트 전 주의사항과 안내를 제공합니다.",
    "일자: 2026-05-16\`n가장 핵심적인 학습 화면으로, 7가지 색상의 트레일과 육각형 노드 선택 UI를 통해 게임처럼 학습할 수 있게 구현했습니다.",
    "일자: 2026-05-07 ~ 05-09\`n학습 동기 부여를 위해 제공되는 아바타 시스템입니다. 6가지 스킨톤과 다양한 꾸미기 아이템(안경, 모자 등)을 조합할 수 있습니다.",
    "일자: 2026-05-16\`n완성된 강의 시스템 페이지입니다. 썸네일, 조회수, 카테고리 기능과 함께 본인 업로드 영상 삭제 UI까지 연동되었습니다."
)

$table = $doc.Tables.Add($selection.Range, 5, 2)
$table.Borders.Enable = $true
$table.Columns.Item(1).PreferredWidth = 500
$table.Columns.Item(2).PreferredWidth = 400

for ($i=0; $i -lt 5; $i++) {
    $row = $i + 1
    $p = 'C:\\Users\\USER\\imformation\\' + $images[$i]
    
    $cell1 = $table.Cell($row, 1).Range
    $cell1.ParagraphFormat.Alignment = 1
    if (Test-Path $p) {
        $shape = $doc.InlineShapes.AddPicture($p, $false, $true, $cell1)
        if ($shape.Width -gt 450) { $shape.Height = $shape.Height * (450/$shape.Width); $shape.Width = 450 }
    }
    
    $cell2 = $table.Cell($row, 2).Range
    $cell2.Font.Size = 14
    $cell2.Font.Bold = $true
    $cell2.Text = $titles[$i] + "\`n"
    
    $rng = $table.Cell($row, 2).Range
    $rng.Start = $rng.End - 1
    $rng.Font.Size = 12
    $rng.Font.Bold = $false
    $rng.Text = $descriptions[$i]
}

$doc.Save()
Write-Output "Done"
`;

fs.writeFileSync('insert_images_table.ps1', '\uFEFF' + code, 'utf16le');
