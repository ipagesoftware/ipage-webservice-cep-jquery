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
$(document).ready(function(){
  index.init();// INICIALIZO A CLASSE
  $("#txt_cep").focus();// PASSO O FOCO PARA A PRIMEIRA CAIXA DE TEXTO
});
// CLASS INDEX
var index = function(){
    /**
     * index::handleForm()
     * MÉTODO RESPONSÁVEL PELO TRATAMENTO DO CEP
     */
    var handleForm = function(){
      $('form, input').blur(function(){
        // REMOVE A CLASSE QUE MUDA A COR DA CAIXA DE TEXTO
        if($(this).hasClass("ipage-result-cep")){
          $(this).removeClass("ipage-result-cep");
        }
      });
      //
      var now = new Date();
      $("#year").html(now.getFullYear());
    };

    /**
     * index::handleCep()
     *
     */
    var handleCep = function () {
      var classCep = new IpageCep();
      // APLICA A MÁSCARA AO CAMPO DO CEP
      var mask = $('#txt_cep').data('inputmaskInputformat');
      $('#txt_cep').mask(mask, {
          reverse: true,
          maxlength: false
      });
      // EVENTO CLICK DO BOTÃO
      $('#btn_cep').click(function(){
        var cep = $("#txt_cep").val();// PEGO O VALOR DO CEP
        // CHAMO O MÉTODO DA CLASSE CEP EM: ipage-wscep.js
        // PARA VALIDAR O CEP
        if (classCep.validaCep(cep) === false) {
            alert('Número do CEP inválido ou inexistente, verifique!');
            $("#txt_cep").focus().select();
            return false;
        }
        // ESPERA O MÉTODO DA CLASSE CEP
        // TERMINAR A REQUISIÇÃO AO WEBSERVICE

          if(classCep.getCep(cep, function(result){
              if((result.error)=='true'){
                alert("Cep inválido, verifique!");
                $('#txt_cep').select().focus();
                jQuery.each($('.ipage-result-cep'), function(index, item){
                  $(this).removeClass("ipage-result-cep").val("");
                });
              }else{
                jQuery.each(result, function(index, item){                  
                  if(typeof($('#' + index).val())!=='undefined'){
                    switch(index){
                      case 'erro':
                      case 'msg':
                      default:
                        $('#' + index).val(item.toUpperCase()).addClass("ipage-result-cep");
                    }
                  }
                });
              }
            })
          );
        
      });
      //
      $('.ipage-resultado-cep').blur(function(){
        $(this).removeClass("ipage-result-cep");
      });
    };
    return{
        //Função principal inicializada na carga da página
        init: function (par){
          handleForm();
          handleCep();
        }
    };
}();
