#Requires -RunAsAdministrator
<#
.SYNOPSIS
  Harden Windows remote access over Tailscale only (RDP + optional dev Serve).

.DESCRIPTION
  Run once on the Windows dev PC as Administrator when unattended setup is needed.
  Tailscale must already be logged in (tailscale status shows your tailnet).

  Tailscale SSH is NOT supported on Windows — use RDP or Tailscale Serve instead.
#>

$ErrorActionPreference = "Stop"
$TailscaleExe = "C:\Program Files\Tailscale\tailscale.exe"

if (-not (Test-Path $TailscaleExe)) {
  Write-Error "Tailscale not installed. Install from https://tailscale.com/download/windows"
}

Write-Host "== Tailscale status ==" -ForegroundColor Cyan
& $TailscaleExe status
$tsIp = (& $TailscaleExe ip -4).Trim()
$tsJson = & $TailscaleExe status --json | ConvertFrom-Json
$dnsName = $tsJson.Self.DNSName
Write-Host "Tailscale IPv4: $tsIp"
Write-Host "MagicDNS:     $dnsName"

Write-Host "`n== Enable Remote Desktop ==" -ForegroundColor Cyan
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server" -Name "fDenyTSConnections" -Value 0
Enable-NetFirewallRule -DisplayGroup "Remote Desktop"
Write-Host "RDP enabled (fDenyTSConnections=0)"

Write-Host "`n== Restrict RDP to Tailscale CGNAT (100.64.0.0/10) ==" -ForegroundColor Cyan
$ruleName = "Remote Desktop - Tailscale Only (TCP-In)"
$existing = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
if ($existing) { Remove-NetFirewallRule -DisplayName $ruleName }
New-NetFirewallRule -DisplayName $ruleName `
  -Direction Inbound `
  -Action Allow `
  -Protocol TCP `
  -LocalPort 3389 `
  -RemoteAddress 100.64.0.0/10 `
  -Profile Any `
  -Enabled True | Out-Null
Write-Host "Firewall rule created: $ruleName"

Write-Host "`n== Optional: block public-profile RDP (keep Private/Domain) ==" -ForegroundColor Cyan
Disable-NetFirewallRule -DisplayGroup "Remote Desktop" -Profile Public -ErrorAction SilentlyContinue

Write-Host "`n== Tailscale Serve (dev servers on tailnet) ==" -ForegroundColor Cyan
Write-Host @"

Tailscale Serve must be enabled ONCE per tailnet (browser, admin):
  https://login.tailscale.com/f/serve?node=$($tsJson.Self.ID)

After enabling in the admin console, run:
  tailscale serve --bg 3000
  tailscale serve --bg 8000
  tailscale serve status

"@

Write-Host "`n== Mac connection ==" -ForegroundColor Green
Write-Host @"
1. Install Tailscale on Mac (same account: taaffeite.aart@)
2. Microsoft Remote Desktop → PC name: $dnsName  (or $tsIp)
3. User: $env:USERNAME  (Windows login)
4. For Convo dev (after serve enabled): http://$dnsName` (port 3000 via serve)

See docs/deploy/tailscale-remote-access.md
"@
