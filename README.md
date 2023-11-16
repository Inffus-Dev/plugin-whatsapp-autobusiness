# Plugin WhatsApp por Auto Business
Plugin que insere botão do WhatsApp ao seu site, e após o clique, um pequeno modal é aberto com 3 campos para serem enviados para um endpoint configurado e em seguida redirecionar o usuário para o número WhatsApp informado no plugin.

# Importação
CSS:
Na seção `<head>` da página inicial do seu site, importe o css do plugin: <pre><code>&lt;link rel="stylesheet" href="https://cdn.autobusiness.com.br/whatsapp/css/whatsapp.css" /&gt;</code></pre>


JS:
No final da seção `<body>` dá pagina inicial do seu site, antes do fechamento da tag `</body>`, importe o js do plugin: <pre><code><script src="https://cdn.autobusiness.com.br/whatsapp/js/whatsapp.js"></script></code></pre>

# Modo de usar
Logo após a importação do whatsapp.js, você pode iniciar o plguin da seguinte maneira:
<pre><code>
iniciarPluginWhatsApp({
    status: "ativo",
    link: "/politica-de-privacidade",
    telefone: "41999999999",
    endpoint: "/meu-endpoint.php",
    recaptcha: "chave-de-site-recaptcha",
    prefixo: "veiculo",
    bottom: "50px",
});
</code>
</pre>
# Explicação dos parâmetros

Status (obrigatório): ativar ou desativar o plugin, qualquer coisa diferente de "ativo" faz com que o plugin seja desativado.

Link (obrigatório): link para a política de privacidade do seu site, que vai ser acessível através do checkbox no formulário.

Telefone (obrigatório): telefone whatsapp para qual o usuário será redirecionado após preencher o formulário corretamente.

Endpoint (obrigatório): endpoint em que o formulário será enviado, os campos estão com os nomes de: nome, telefone, email.

Prefixo: prefixo da página individual do veículo para envio de formulários baseados no veículo.

Recaptcha: chave pública do recaptcha (chave de site), o token gerado será vinculado ao campo g-recaptcha-response.