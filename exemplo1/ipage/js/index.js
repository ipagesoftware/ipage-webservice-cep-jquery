/**
 * email: diogenesdias@hotmail.com
 * http://www.ipage.com.br
 *
 * Scritp auxiliar da página index.html
 *
 * @author IPAGE - Diógenes Dias
 * @copyright 2021
 *
 */
$(document).ready(function() {
    index.init(); // Inicializa a classe
});
// Class index
var index = function() {
    /**
     * index::handleForm()
     * Método responsável pelo tratamento do cep
     */
    var handleForm = function() {
        $('form, input').blur(function() {
            // Remove a classe que muda a cor da caixa de texto
            if ($(this).hasClass("ipage-result-cep")) {
                $(this).removeClass("ipage-result-cep");
            }
        });
        //
        var now = new Date();
        $("#year").html(now.getFullYear());
    };
    /**
     * index::handleCep()
     */
    var handleCep = function() {
        var classCep = new IpageCep();
        // Aplica a máscara ao campo do CEP
        var mask = $('#txt_cep').data('inputmaskInputformat');
        $('#txt_cep').mask(mask, {
            reverse: true,
            maxlength: false
        });
        // Evento click do botão
        $('#btn_cep').click(function() {
            var cep = $("#txt_cep").val(); // Pega o valor do cep
            // Chama o método da classe cep em: ipage-wscep.js
            // para validar o cep
            if (classCep.validaCep(cep) === false) {
                alert('Número do CEP inválido ou inexistente, verifique!');
                $("#txt_cep").focus().select();
                return false;
            }
            $("#btn_cep").addClass("disabled").html("Aguarde...");
            // Espera o método da classe cep
            // terminar a requisição ao webservice
            if (classCep.getCep(cep, function(result) {
                    $("#btn_cep").removeClass("disabled").html("Pesquisar");
                    if (result.error == true || (parseInt(result.error, 10) == 1)) {
                        alert(result.msg);
                        $('#txt_cep').select().focus();
                        jQuery.each($('.ipage-result-cep'), function(index, item) {
                            $(this).removeClass("ipage-result-cep").val("");
                        });
                    } else {
                        jQuery.each(result, function(index, item) {
                            if (typeof($('#' + index).val()) !== 'undefined') {
                                switch (index) {
                                    case 'erro':
                                    case 'msg':
                                    default:
                                        $('#' + index).val(item).addClass("ipage-result-cep");
                                }
                            }
                        });
                    }
                }));
        });
        //
        $('.ipage-resultado-cep').blur(function() {
            $(this).removeClass("ipage-result-cep");
        });
    };
    return {
        //Função principal inicializada na carga da página
        init: function(par) {
            handleForm();
            handleCep();
        }
    };
}();