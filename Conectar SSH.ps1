# Definir o caminho para o arquivo de chave PEM
$pemPath = "Login Zelo.pem"

# Primeiro comando SSH para a instância EC2
$firstSSHCommand = "ssh -i `"$pemPath`" admin@ec2-54-207-255-97.sa-east-1.compute.amazonaws.com"

# Segundo comando SSH para o IP interno
$secondSSHCommand = "ssh joao@100.69.125.125"

# Executar o primeiro SSH e, em seguida, o segundo dentro da sessão
Start-Process "cmd.exe" -ArgumentList "/c", $firstSSHCommand, "&&", $secondSSHCommand
