# Nome do App Pool que você quer reciclar
$appPoolName = "zelo"

# Reciclar o App Pool
Import-Module WebAdministration
Restart-WebAppPool -Name $appPoolName
