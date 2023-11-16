# Plugin WhatsApp by Auto Business
Plugin que insere botão do WhatsApp ao seu site, e após o clique, um pequeno modal é aberto com 3 campos para serem enviados para um endpoint configurado.

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
    prefixo: "veiculo",
    endpoint: "/meu-endpoint.php"
});
</code>
</pre>
Explicação:
Status: ativar ou desativar o plugin, qualquer coisa diferente de "ativo" faz com que o plugin seja desativado.
Link: link para a política de privacidade do seu site, que vai ser acessível através do checkbox no formulário.
Telefone: telefone whatsapp para qual o usuário será redirecionado após preencher o formulário corretamente.
Prefixo: prefixo da página individual do veículo para envio de formulários baseados no veículo.
Endpoint: endpoint em que o formulário será enviado, os campos estão com os nomes de: nome, telefone, email.


