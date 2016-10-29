angular.module("app")

  // Esta variável está em jade/_mixins/head.jade
  .constant("TRANSLATIONURL", "https://translation.handtalk.me/")

  .constant("CHARTOPTIONS", {
    scaleShowGridLines: false,
    scaleGridLineWidth: 1,
    scaleShowVerticalLines: false,
    scaleShowHorizontalLines: false,
    bezierCurve: false,
    pointDot: true,
    datasetStrokeWidth: 0.5,
    percentageInnerCutout: 80,
    animationEasing: "easeInOut",
    colours : [
      "#9FA8DA",
      "#FFAB91",
      "#AAAAAA",
      "#F48FB1",
      "#FFF59D",
      "#CE93D8",
      "#E6EE9C"
    ]
  })

  .constant("ERRORCODES", {
    "AUTH_REQURIRED": "Você não está mais autenticado",
    "USER_AUTENTICADED": "Usuário autenticado",
    "There is no user record corresponding to this identifier. The user may have been deleted.":
      "Não há usuários com este email",
    "The password is invalid or the user does not have a password.":
      "Senha e Email inválidos"
  })
;