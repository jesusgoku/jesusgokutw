# JesusGoku Twitter

Plugin jQuery para incluir busquedas de twitter en tu sitio web

# Uso

Incluir en el head  los archivos necesarios en la pagina donde quieras implementarlo.

	<link type="text/css" rel="stylesheet" href="jesusgokutw/jquery.jesusgokutw.css">
	<script type="text/javascript" src="jquery-1.9.0.js"></script>
	<script type="text/javascript" src="jesusgokutw/jquery.jesusgokutw.js"></script>

Luego en el body de tu pagina incluir un div donde se desplegaran los tweets.

	<div id="twitter-feed"></div>

Luego indicarle al plugin donde quieres que muestre los tweets.

	$(function() {
		$('#twitter-feed').JesusGokuTW({
			query: '' // Requerido. Termino sobre el que quieres desplegar los tweets
			, refresh: 60 // Opcional. Default false. Intervalo en segundos en que se buscaran nuevos tweets.
			, usernameShow: true // Opcional. Default true. Determina si se muestra el username junto al nombre.
			, lang: 'es' // Opcional. Default ''. Puede restringir el lenguaje de los tweets.
			, showUrl: false // Opcional. Default true. Muestra las url no acortados por t.co
		});
	});