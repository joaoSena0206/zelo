# Defina as variáveis de usuário, hostname, caminho remoto e o caminho do arquivo de identidade
$username = "admin"
$hostname = "ec2-54-207-255-97.sa-east-1.compute.amazonaws.com"
$remotePath = "/home/admin/projetos/zelo/zelo"
$scriptDirectory = $PSScriptRoot
$identityFile = Join-Path -Path $scriptDirectory -ChildPath "Login Zelo.pem"

# Comando para abrir o VS Code com a conexão SSH usando IdentityFile
$vscodeCommand = "code --folder-uri vscode-remote://ssh-remote+$username@$hostname$remotePath --ssh-option '-i $identityFile'"

# Executa o comando
Invoke-Expression $vscodeCommand
