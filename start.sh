#!/bin/bash
set -e  # Faz o script parar se algum comando falhar

# 🔹 Defina as variáveis do projeto
PROJECT_NAME="front-dashboard-bradesco-lollapaloza-2025"  # Nome do projeto/pasta
DOMAIN="bradesco-dashboard.picbrand.dev.br"  # Domínio que será configurado
PROJECT_PATH="/home/ec2-user/front-dashboard-bradesco-lollapaloza-2025"  # Caminho do projeto
DEPLOY_PATH="/var/www/$PROJECT_NAME"  # Caminho onde os arquivos serão hospedados

# 🔹 Muda para a pasta do projeto
cd "$PROJECT_PATH"

# 🔹 Atualiza pacotes e instala dependências necessárias
sudo yum update -y
sudo yum install -y nginx certbot python3-certbot-nginx nodejs git cronie

# 🔹 Garante que o serviço de crontab está ativo
sudo systemctl enable crond
sudo systemctl start crond

# 🔹 Garante que o Nginx esteja ativo
sudo systemctl enable nginx
sudo systemctl start nginx || true  # Ignora erro se o Nginx não iniciar

# 🔹 Garante que a pasta de build existe antes de copiar
if [ ! -d "dist" ]; then
    echo "❌ ERRO: A pasta 'dist/' não existe. Certifique-se de rodar 'npm run build' antes de executar o script."
    exit 1
fi

# 🔹 Criando diretório exclusivo para esse projeto
sudo mkdir -p "$DEPLOY_PATH"
sudo rm -rf "$DEPLOY_PATH/*"  # Remove arquivos antigos
sudo cp -r dist/* "$DEPLOY_PATH/"

# 🔹 Criação dinâmica do arquivo de configuração do Nginx
NGINX_CONF_PATH="/etc/nginx/conf.d/$PROJECT_NAME.conf"

sudo tee "$NGINX_CONF_PATH" > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name $DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

    root $DEPLOY_PATH;
    index index.html;

    location / {
        try_files \$uri /index.html;
    }

    error_page 404 /404.html;
}
EOF

# 🔹 Testa e reinicia o Nginx
sudo nginx -t
sudo systemctl restart nginx || true  # Ignora erro se não rodar

# 🔹 Configuração do Certificado SSL com Let's Encrypt
if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "✅ Certificado SSL já existe. Pulando a geração."
else
    echo "⚡ Gerando certificado SSL..."
    sudo certbot certonly --nginx -d "$DOMAIN" --non-interactive --agree-tos -m seuemail@exemplo.com
fi

# 🔹 Testa e reinicia o Nginx com SSL ativado
sudo nginx -t
sudo systemctl restart nginx

# 🔹 Configura a renovação automática do certificado SSL
echo "0 0 * * * certbot renew --quiet && systemctl restart nginx" | sudo crontab -

echo "✅ Setup concluído! O React Vite está rodando com HTTPS no domínio: $DOMAIN"
