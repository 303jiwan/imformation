# Stop hook: deletes the two AI-problem-generation-related memory files at the
# end of the NEXT session in this repo, then removes itself from
# .claude/settings.local.json so it never fires again.
#
# Mechanism: the first time the hook fires, we record the current session_id
# in a marker file. On any later fire whose session_id differs from the marker,
# we know we're in a NEW session ending — that's when cleanup runs. This is
# robust against Stop firing multiple times within one session (which happens
# on /clear, /compact, /resume per Claude Code's Stop event semantics).

$ErrorActionPreference = 'SilentlyContinue'

# Read hook stdin JSON
$raw = [Console]::In.ReadToEnd()
if (-not $raw) { exit 0 }

try {
    $payload = $raw | ConvertFrom-Json
} catch {
    exit 0
}

$currentSession = [string]$payload.session_id
if (-not $currentSession) { exit 0 }

$repoRoot   = 'C:\Users\seok\imformation'
$marker     = Join-Path $repoRoot '.claude\.memory-cleanup-armed'
$settings   = Join-Path $repoRoot '.claude\settings.local.json'
$memDir     = 'C:\Users\seok\.claude\projects\c--Users-seok-imformation\memory'
$targets    = @(
    (Join-Path $memDir 'codenergy-product-framing.md'),
    (Join-Path $memDir 'ai-problem-generation-plan.md'),
    (Join-Path $memDir 'MEMORY.md')
)

if (-not (Test-Path $marker)) {
    # First arm — record session_id and exit. No cleanup yet.
    Set-Content -Path $marker -Value $currentSession -Encoding utf8 -Force
    exit 0
}

$armedSession = (Get-Content $marker -Raw -ErrorAction SilentlyContinue).Trim()

if ($armedSession -eq $currentSession) {
    # Stop firing again within the same session (e.g. /clear, /compact). Skip.
    exit 0
}

# Different session_id from the armed one => the NEXT session is ending. Clean up.
foreach ($f in $targets) {
    if (Test-Path $f) {
        Remove-Item -Path $f -Force -ErrorAction SilentlyContinue
    }
}
Remove-Item -Path $marker -Force -ErrorAction SilentlyContinue

# Strip this hook out of settings.local.json so it never runs again.
if (Test-Path $settings) {
    try {
        $config = Get-Content $settings -Raw -ErrorAction Stop | ConvertFrom-Json -ErrorAction Stop
        if ($config.hooks -and $config.hooks.Stop) {
            $kept = @($config.hooks.Stop | Where-Object {
                $shouldKeep = $true
                foreach ($h in $_.hooks) {
                    if ($h.command -and ($h.command -like '*memory-cleanup-pending*')) {
                        $shouldKeep = $false
                        break
                    }
                }
                $shouldKeep
            })
            if ($kept.Count -eq 0) {
                $config.hooks.PSObject.Properties.Remove('Stop')
                if (-not ($config.hooks.PSObject.Properties | Where-Object { $true })) {
                    $config.PSObject.Properties.Remove('hooks')
                }
            } else {
                $config.hooks.Stop = $kept
            }
            $config | ConvertTo-Json -Depth 100 | Set-Content -Path $settings -Encoding utf8 -Force
        }
    } catch {
        # Settings edit failed (malformed JSON etc). Leave alone — cleanup already done.
    }
}

exit 0
