/**
* email: diogenesdias@hotmail.com
* http://www.ipage.com.br
*
* Scritp auxiliar da página index.php
*
* @author IPAGE - Diógenes Dias
* @copyright 2021
*
*/
$(document).ready(function(){
  index.wait(false, function(result){
    index.init();// INICIALIZO A CLASSE
    $("#txt_cep").focus();// PASSO O FOCO PARA A PRIMEIRA CAIXA DE TEXTO
  });
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
      var now = new Date
      $("#year").html(now.getFullYear());
    }

    var handleInputMasks = function () {
        //
        //// INICIO A VARREDURA PELOS OBJETOS INPUT
        //////
        $('input').each(function(index, value){
          var id = $(this).attr('id');
          //
          if($(this).data('type')=='mask'){
            if(typeof(id)!='undefined'){
              var el = document.getElementById($(this).attr('id'));
              //// ARMAZENA A REPRESENTAÇÃO DE TODAS AS PROPRIEDADES DATA
              // DO OBJETO INPUT
              var data = getDataAttributes(el);
              //
              if(typeof(data['inputmaskInputformat'])!=='undefined'){
                // CAMPO MOEDA
                if(data['inputmask']=='currency'){
                  $(this).mask(data['inputmaskInputformat'], {
                      reverse: true,
                      maxlength: false
                  });
                }else{
                  $(this).mask(data['inputmaskInputformat']);
                }
                //                //
                $(this).blur(function(){
                    if(typeof(data['inputmaskInputformat'])!=='undefined'){
                      if($(this).val().trim()==''){
                        $(this).val(data['inputmaskDefaultvalue']);
                      }else{
                        if(data['inputmask']=='currency'){
                          var ret = replaceAll($(this).val().trim(), ',', '');
                          $(this).val(ret);
                        }
                      }
                    }
                });
              }
            }
          }
        });
        function replaceAll(string, token, newtoken) {
            try{
              while (string.indexOf(token) !== -1) {
                  string = string.replace(token, newtoken)
              }
            }catch(e){
              console.log(e);
            }
            return string
        }
        // THE MAGIC FUNCTION CREATED BY DIÓGENES DIAS
        function getDataAttributes(el) {
            var data = {};
            [].forEach.call(el.attributes, function(attr) {
                if (/^data-/.test(attr.name)) {
                    var camelCaseName = attr.name.substr(5).replace(/-(.)/g, function ($0, $1) {
                        return $1.toUpperCase();
                    });
                    data[camelCaseName] = attr.value;
                }
            });
            return data;
        }
        //
    }

    /**
     * index::handleCep()
     *
     */
    var handleCep = function () {
      var classCep = new IpageCep(), form = $("form input[type=text]"), id, text;
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
        // ATIVO A ANIMAÇÃO DE AGUADE E ESPERO O MÉTODO DA CLASSE CEP
        // TERMINAR A REQUISIÇÃO AO WEBSERVICE
        index.wait(true, function(ret){
          if(classCep.getCep(cep, function(result){
              console.log(result);
              if(result['erro']==true){
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
      })
      //
      $('.ipage-resultado-cep').blur(function(){
        $(this).removeClass("ipage-result-cep");
      });
    }
    return{
        //Função principal inicializada na carga da página
        init: function (par){
          handleForm();
          handleCep();
          handleInputMasks();
        },
        wait: function(value, callback) {
        if (value){
          $('#loader').show();
          setTimeout(function() {
                return callback?callback(1):null;
            }, 500);
        }else{
          setTimeout(function() {
              $('#loader').fadeOut("slow", function(){
                return callback?callback(1):null;
              });
            }, 500);
        }
      }
    };
}();
//
//  _______   _                ______               _
// |__   __| | |              |  ____|             | |
//    | |    | |__     ___    | |__     _ __     __| |
//    | |    | '_ \   / _ \   |  __|   | '_ \   / _` |
//    | |    | | | | |  __/   | |____  | | | | | (_| |
//    |_|    |_| |_|  \___|   |______| |_| |_|  \__,_|
//
