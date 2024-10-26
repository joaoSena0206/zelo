$porta = 5008
$comando = ".\cloudflared-windows-amd64.exe tunnel --url http://localhost:5008"

Invoke-Expression $comando
