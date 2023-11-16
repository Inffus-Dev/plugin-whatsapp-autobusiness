function iniciarPluginWhatsApp(parametros) {
    if (parametros.status == 'ativo') {

        p = tratarErros(parametros);
        if (p != 0) {
            return console.warn("Plugin WhatsApp do Auto Business informa que paramêtros obrigatórios estão faltando: "+p);
        }
    
        html = `<div id="ab-formulario-whatsapp" class="ab-formulario-whatsapp ajustar-largura">
        <form id="ab-enviar-form-whatsapp" class="ab-enviar-form-whatsapp" style="display: none;">
        <span class="close-form">X</span>
        <input type="text" placeholder="Nome*" class="nome" name="nome" id="nome">
        <input type="text" placeholder="E-mail*" class="email" name="email" id="email">
        <input type="text" placeholder="Telefone*" maxlength="14" class="telefone" name="telefone" id="telefone">
        <div class="ab-aceitar-termos">
            <input type="checkbox" id="ab-pp" class="ab-pp" name="ab-pp" id="ab-pp" value="1">
            <label for="ab-pp">Li e aceito a <a id="ab-link-pp" target="_blank">política de privacidade</a>.</label>
        </div>
        <button id="ab-iniciar-conversa">Iniciar conversa</button>
        <small>Desenvolvido por <a href="https://autobusiness.com.br/revenda" id="ab-link-revenda" target="_blank">Auto Business</a></small>
        </form>
        <div class="ab-logo-whatsapp">
        <img src="https://autobusiness.com.br/plugins/whatsapp/img/icone-whatsapp.svg">
        </div>
        </div>`
        $("body").append(html);
    
        setTimeout(function(){
            if (parametros.rodape != '' && parametros.rodape != null) {
                $("#ab-formulario-whatsapp").css("bottom", parametros.rodape);
            }

            $("#ab-link-pp").attr("href", parametros.link);
            $("#ab-link-revenda").attr("href", "https://autobusiness.com.br/revenda?utm_source="+window.location.hostname+"&utm_medium=plugin_whatsapp&utm_campaign=assinatura");

            $(".ab-logo-whatsapp").click(function(){
                $(".ab-enviar-form-whatsapp").toggle();
                $(".ab-formulario-whatsapp").toggleClass('ajustar-largura');
            })

            $("#telefone").on("input", function () {
                formatarTelefone(this);
            });

            $(".close-form").click(function() {
                $(".ab-enviar-form-whatsapp").hide();
                $(".ab-formulario-whatsapp").toggleClass('ajustar-largura');
            })

            $('#nome, #email, #telefone, #ab-pp').on('input', function() {
                $(this).prev('span.ab-mensagem-erro').remove();
            });

            $('#ab-pp').change(function() {
                if ($(this).is(':checked')) {
                    $('.ab-aceitar-termos').prev('span.ab-mensagem-erro').remove();
                }
            });

            if (parametros.recaptcha != '' && parametros.recaptcha != null) {
                grecaptcha.ready(function () {
                    grecaptcha.execute("6Leuzj0mAAAAAFJ-Kqr8ddpWyIh9ymHx-b6l201t", {
                      action: 'submit'
                    }).then(function (token) {
                        recaptcha = token;
                    })
                })
            }

            var formularioEnviado = false; // Flag para verificar se o formulário já foi enviado

            $('#ab-enviar-form-whatsapp').submit(function(e) {
                e.preventDefault(); // Impede o envio padrão do formulário
                var button = $("#ab-iniciar-conversa");

                // Se o formulário já foi enviado, retorna sem fazer nada
                if (formularioEnviado) {
                    return;
                }

                $('span.ab-mensagem-erro').remove();
                var campos = ['nome', 'email', 'telefone', 'ab-pp'];
                var erros = false;
                var dadosFormulario = {};

                campos.forEach(function(campo) {
                    var valorCampo = $('#' + campo)[0];
                    if (valorCampo.type == 'checkbox') {
                        if (!$('#ab-pp').is(':checked')) {
                            $('.ab-aceitar-termos').before("<span class='ab-mensagem-erro'>É preciso aceitar a política de privacidade.</span>");
                            erros = true;
                        } else {
                            dadosFormulario[campo] = $('#ab-pp').val();
                        }
                    } else {
                        if (valorCampo.value === '') {
                            $('#' + campo).before("<span class='ab-mensagem-erro'>Por favor, insira seu " + campo + ".</span>");
                            erros = true;
                        } else {
                            dadosFormulario[campo] = valorCampo.value;
                        }
                    }
                }); 

                if (!erros) {      
                    button.prop("disabled", true);
                    button.html("Iniciando...");
                    var urlAtual = location.pathname;
                    var interesseVeiculo = "";
                    if (typeof parametros !== 'undefined' && parametros.prefixo !== null && parametros.prefixo !== '' && urlAtual.indexOf(parametros.prefixo) !== -1) { 
                        dadosFormulario['modulo'] = "proposta";
                        const id = urlAtual.split("/").slice(-1).pop().replace("#", "");
                        dadosFormulario['idVeiculo'] = id;
                        interesseVeiculo = "Tenho%20interesse%20no%20seguinte%20veículo:%20" + window.location.href;
                    } else {
                        dadosFormulario['modulo'] = "contato";
                    }

                    dadosFormulario['token'] = $('meta[name="token"]').attr('content');
                    dadosFormulario['mensagem'] = "Mensagem automática: Contato enviado através do botão flutuante do whatsapp no site.";
                    dadosFormulario['origem'] = "Botão flutuante Auto Business";

                    if (parametros.recaptcha != '' && parametros.recaptcha != null) {
                        dadosFormulario['g-recaptcha-response'] = recaptcha;
                    }
                    // Define a flag como true para evitar múltiplos envios
                    formularioEnviado = true;

                    // Realiza a requisição AJAX para enviar os dados do formulário
                    $.ajax({
                        url: parametros.endpoint,
                        method: "POST",
                        data: dadosFormulario,
                        success: function(data){
                            if (data.includes('success')) {
                                console.log(data);
                                window.location.href = "https://api.whatsapp.com/send?phone=55"+parametros.telefone+"&text=Estou%20entrando%20em%20contato%20através%20do%20site,%20meu%20nome:%20"+dadosFormulario['nome']+". "+interesseVeiculo;
                            } else {
                                console.log(data);
                            }
                            // Lógica para lidar com a resposta bem-sucedida da requisição AJAX
                        },
                        error: function(error) {
                            console.error('Erro na requisição AJAX:', error);
                            // Lógica para lidar com erros na requisição AJAX
                        },
                        complete: function() {
                            // Limpa a flag quando a requisição estiver completa
                            button.prop("disabled", false);
                            button.html("Iniciar conversa");
                            formularioEnviado = false;
                        }
                    });
                }
            });
        }, 250);
    } else {
        console.log("Plugin Auto Business com WhatsApp desativado.")
    }
}

function formatarTelefone(input) {
    var numeroTelefone = $(input).val().replace(/\D/g, '');

    // Adiciona parênteses aos dois primeiros números
    if (numeroTelefone.length >= 2) {
        var numerosFormatados = '(' + numeroTelefone.substring(0, 2) + ')';
        if (numeroTelefone.length > 2) {
            numerosFormatados += ' ' + numeroTelefone.substring(2);
        }
        $(input).val(numerosFormatados);
    } else {
        $(input).val(numeroTelefone);
    }
}

function tratarErros(p) {
    var parametrosFaltantes = "";
    if (p.link == '' || p.link == null) {
        parametrosFaltantes = "link"
    }

    if (p.telefone == '' || p.telefone == null) {
        if (parametrosFaltantes != '') {
            parametrosFaltantes += ", telefone";
        } else {
            parametrosFaltantes = "telefone";
        }
    }

    if (p.endpoint == '' || p.endpoint == null) {
        if (parametrosFaltantes != '') {
            parametrosFaltantes += ", endpoint";
        } else {
            parametrosFaltantes = "endpoint";
        }
    }

    if (parametrosFaltantes != '') {
        return parametrosFaltantes;
    } else {
        return 0;
    }
}