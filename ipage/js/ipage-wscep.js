/**
 *
 * @version    1.0
 * @package    Ipage Webservice CEP
 * @subpackage js
 * @author     Diógenes Dias <diogenesdias@hotmail.com>
 * @copyright  Copyright (c) 1995-2019 Ipage Software Ltd. (https://www.ipage.com.br)
 * @license    https://www.ipagesoftware.com.br/license_key/www/examples/license/
*/
function IpageCep() {
    this.getCep = getCep;
    this.validaCep = validaCep;
    /**
     * IpageCep::validaCep()
     *
     * @param mixed cep
     * @return boolean
     */
    function validaCep(cep) {
      if(typeof(cep)=='undefined')return false;
      var v = cep.replace(/\D/g, "");
      //
      if (v.length != 8) {
        return false;
      }
      return true;
    }
    /**
     * IpageCep::getCep()
     *
     * @param mixed cep
     * @param mixed callback
     * @return JSON
     */
    function getCep(cep, callback) {
      // Chave de acesso ao Webservice---------------------------------------------+
      // Formato -------------------------------------------------+                |
      // Número do CEP ----------------------------------+        |                |
      // Versão do Webservice ---------------+           |        |                |
      // Url do Webservice ---+              |           |        |                |
      //                      |              |           |        |                |
      //                      |              |           |        |                |
      //                      v              v           v        v                v
      //         --------------------------- -- ---  ---------  ---- ---------------------------------
      var link = "https://www.ipage.com.br/ws/v1/cep/" + cep + "/json/07b36825b44111e9a80952540046af69/";
      var msg, resultadoCEP;
      //
      $.ajax({type: 'GET',
          contentType: 'charset=UTF-8',
          async: false,
          cache: false,
          contentType: false,
          processData: false,
          url: link,// PÁGINA QUE RECEBERÁ OS DADOS DO CADASTRO
          dataType : 'json',
          //data: 'cep=' + cep + "&type=json&key=07b36825b44111e9a80952540046af69",// SERIALIZA OS DADOS DO CADASTRO PARA ENVIO
          // Antes de enviar
          beforeSend: function(){
            index.wait(true);
          },
          success: function(data){
            index.wait(false);
            // REALIZO UMA LIMPEZA NOS DADOS AJUSTANDO CARACETRES ESPECIAIS
            jQuery.each(data, function(index, item){
                data[index] = unescape(item);
            });
            return callback?callback(data):null;
          }, error : function(xhr, er){
            index.wait(false);
            // ERRO A NÍVEL DO SERVIDOR
            msg = 'Error ' + xhr.status + ' - ' + xhr.statustext + '\nTipo de erro: ' + er;
            erro = new Array({"erro": true, "msg": msg});
            return callback?callback(erro[0]):null;
          }
        });
    }
}