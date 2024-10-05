module.exports = {

  // Validate if a string is a valid image URL
  is_valid_url_image: function (url) {
    var isValid = false;
    var re = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg|bmp)/i;
    try {
      isValid = re.test(url);
    } catch (e) {
      console.log(e);
    } finally {
      return isValid;
    }
  },

  // Validate if a string is a valid YouTube URL
  is_valid_yt_video: function (url) {
    var isValid = false;
    var re = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})?$/i;
    try {
      isValid = re.test(url);
    } catch (e) {
      console.log(e);
    } finally {
      return isValid;
    }
  },

  // Extract YouTube video ID from URL
  getYTVideoId: function(url) {
    var regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\/v\/|\/embed\/)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[1].length == 11) {
      return match[1];
    } else {
      return null;
    }
  },

  // Generate embedded YouTube video code
  getEmbeddedCode: function (url) {
    var id = this.getYTVideoId(url);
    if (id) {
      var code = '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + id + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      return code;
    } else {
      return '';
    }
  },

  // Generate image tag
  getImageTag: function(url) {
    var tag = '<img src="' + url + '" style="max-height: 400px; max-width: 400px;">';
    return tag;
  },

  // Validate and process the message
  validateMessage: function(msg) {
    var obj = JSON.parse(msg);

    if (this.is_valid_url_image(obj.mensaje)) {
      console.log("It's an image URL!");
      obj.mensaje = this.getImageTag(obj.mensaje);
    } else if (this.is_valid_yt_video(obj.mensaje)) {
      console.log("It's a YouTube video URL!");
      obj.mensaje = this.getEmbeddedCode(obj.mensaje);
    } else {
      console.log("It's a text message!");
    }

    return JSON.stringify(obj);
  }
};