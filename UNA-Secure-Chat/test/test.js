var unalib = require('../unalib/index'); // Adjust the path as necessary
var assert = require('assert');

// Tests for unalib

describe('unalib', function(){

    // Test for is_valid_phone function
    describe('función is_valid_phone', function(){
        it('debería devolver true para 8297-8547', function(){
            assert.equal(unalib.is_valid_phone('8297-8547'), true);
        });
    });

    // Test for is_valid_url_image function
    describe('is_valid_url_image', function() {
        it('Debería retornar true para formatos válidos de URLs de imágenes', function() {
            assert.equal(unalib.is_valid_url_image('http://example.com/image.jpg'), true);
            assert.equal(unalib.is_valid_url_image('http://example.com/image.gif'), true);
            assert.equal(unalib.is_valid_url_image('http://example.com/image.png'), true);
            assert.equal(unalib.is_valid_url_image('http://example.com/image.jpeg'), true);
            assert.equal(unalib.is_valid_url_image('http://example.com/image.bmp'), true);
        });

        it('Debería retornar false para formatos inválidos de URLs de imágenes', function() {
            assert.equal(unalib.is_valid_url_image('http://example.com/image.txt'), false);
            assert.equal(unalib.is_valid_url_image('https://example.com/image.doc'), false);
            assert.equal(unalib.is_valid_url_image('http://example.com/image.pdf'), false);
            assert.equal(unalib.is_valid_url_image('https://example.com/image'), false);
            assert.equal(unalib.is_valid_url_image('example.com/image.jpg'), false);
        });

        it('Debería retornar false para entradas que no sean strings', function() {
            assert.equal(unalib.is_valid_url_image(123), false);
            assert.equal(unalib.is_valid_url_image(null), false);
            assert.equal(unalib.is_valid_url_image(undefined), false);
            assert.equal(unalib.is_valid_url_image({}), false);
            assert.equal(unalib.is_valid_url_image([]), false);
        });
    });

    // Test for is_valid_yt_video function
    describe('is_valid_yt_video', function() {
        it('Debería retornar true para formatos válidos de URLs de YouTube', function() {
            assert.equal(unalib.is_valid_yt_video('https://www.youtube.com/watch?v=UjrRTY2UDjw'), true);
            assert.equal(unalib.is_valid_yt_video('http://youtu.be/dQw4w9WgXcQ'), true);
            assert.equal(unalib.is_valid_yt_video('www.youtube.com/watch?v=dQw4w9WgXcQ'), true);
            assert.equal(unalib.is_valid_yt_video('youtube.com/watch?v=dQw4w9WgXcQ'), true);
        });

        it('Debería retornar false para formatos inválidos de URLs de YouTube', function() {
            assert.equal(unalib.is_valid_yt_video('https://www.google.com'), false);
            assert.equal(unalib.is_valid_yt_video('http://youtu.be/dQw4w9WgXcQ123'), false);
            assert.equal(unalib.is_valid_yt_video('www.youtube.com/watch?x=dQw4w9WgXcQ'), false);
        });

        it('Debería retornar false para entradas que no sean strings', function() {
            assert.equal(unalib.is_valid_yt_video(123), false);
            assert.equal(unalib.is_valid_yt_video({}), false);
            assert.equal(unalib.is_valid_yt_video([]), false);
            assert.equal(unalib.is_valid_yt_video(null), false);
            assert.equal(unalib.is_valid_yt_video(undefined), false);
        });
    });

    // Test for getYTVideoId function
    describe('getYTVideoId', function() {
        it('Debería devolver el ID del video a partir de la URL estándar de YouTube', function() {
            var url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
            var result = unalib.getYTVideoId(url);
            assert.equal(result, 'dQw4w9WgXcQ');
        });

        it('Debería devolver el ID del video a partir de la URL corta de YouTube', function() {
            var url = 'https://youtu.be/dQw4w9WgXcQ';
            var result = unalib.getYTVideoId(url);
            assert.equal(result, 'dQw4w9WgXcQ');
        });

        it('Debería devolver el ID del video de una URL de YouTube con parámetros adicionales', function() {
            var url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=youtu.be';
            var result = unalib.getYTVideoId(url);
            assert.equal(result, 'dQw4w9WgXcQ');
        });
    });

    // Test for getEmbeddedCode function
    describe('getEmbeddedCode', function() {
        it('Debería devolver el código incrustado de la URL de un video de YouTube', function() {
            var url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
            var expectedCode = '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
            var result = unalib.getEmbeddedCode(url);
            assert.equal(result, expectedCode);
        });
    });

    // Test for getImageTag function
    describe('getImageTag', function() {
        it('Debería retornar una etiqueta img con la URL proporcionada', function() {
            var url = 'https://example.com/image.jpg';
            var expectedTag = '<img src="https://example.com/image.jpg" style="max-height: 400px; max-width: 400px;">';
            var result = unalib.getImageTag(url);
            assert.strictEqual(result, expectedTag);
        });

        it('Debería funcionar con diferentes URLs', function() {
            var url1 = 'https://example.com/image1.jpg';
            var url2 = 'https://example.com/image2.jpg';
            var result1 = unalib.getImageTag(url1);
            var result2 = unalib.getImageTag(url2);
            assert.notStrictEqual(result1, result2);
        });
    });

    // Test for validateMessage function
    describe('validateMessage', function() {
        it('Debería validar y convertir una URL de imagen a una etiqueta de imagen', function() {
            var input = '{"mensaje": "https://example.com/image.jpg"}';
            var expectedOutput = '{"mensaje":"<img src=\\"https://example.com/image.jpg\\" style=\\"max-height: 400px; max-width: 400px;\\"}"}';
            var result = unalib.validateMessage(input);
            assert.equal(result, expectedOutput);
        });

        it('Debería validar y convertir una URL de YouTube a código de video incrustado', function() {
            var input = '{"mensaje": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}';
            var expectedOutput = '{"mensaje":"<iframe width=\\"560\\" height=\\"315\\" src=\\"https://www.youtube.com/embed/dQw4w9WgXcQ\\" frameborder=\\"0\\" allow=\\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\\" allowfullscreen></iframe>"}';
            var result = unalib.validateMessage(input);
            assert.equal(result, expectedOutput);
        });

        it('Debería reconocer y dejar el texto plano tal cual', function() {
            var input = '{"mensaje": "Este es un texto."}';
            var expectedOutput = '{"mensaje":"Este es un texto."}';
            var result = unalib.validateMessage(input);
            assert.equal(result, expectedOutput);
        });
    });

});
