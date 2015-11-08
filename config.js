'use strict';


// var i18n = require('i18n');



class Config {

  constructor(env) {
    if (env !== 'production') {
      this.port = 3000;
      this.mongoUri = 'mongodb://localhost:27017/koa-start-v1';
      this.mongoUser = '';
      this.mongoPassword = '';
      this.secret = '635N0jt0trQAE2X22dwLGGq/ulm/lMK80uZaJBjG3Gk=';
    } else {
      this.port = 80;
      this.mongoUri = process.env.NODE_MONGO_URI;
      this.mongoUser = process.env.NODE_MONGO_USER;
      this.mongoPassword = process.env.NODE_MONGO_PASSWORD;
      this.secret = process.env.NODE_SECRET;
    }

    this.mongoDatabase = 'koa-start-v1';

    this.cookieMaxAge = 30 * 24 * 3600 * 1000;

    this.local = {
      usernameField: 'email',
      passReqToCallback: true
    };

    this.facebook = {
      clientID: '1626866674229075',
      clientSecret: '33576ce8d7fb59e7e60e574c6431f1d7',
      callbackURL: 'http://localhost:' + this.port + '/auth/facebook/callback',
      profileFields: ['id', 'emails', 'displayName', 'picture.type(large)'],
      passReqToCallback: true
    };

    this.vkontakte = {
      clientID: '4834593',
      clientSecret: 'Oc6hGWsn0jk96c2MVgXZ',
      callbackURL: 'http://localhost:' + this.port + '/auth/vkontakte/callback',
      // profileFields: ['id', 'emails', 'displayName', 'picture.type(large)'],
      passReqToCallback: true
    };

    this.google = {
      clientID: '463931604371-g3tpfua4ttehg80ovdi5crfavjkm1rip.apps.googleusercontent.com',
      clientSecret: 'RCKjjQWUCSx8MrP2MK5zkse3',
      callbackURL: 'http://localhost:' + this.port + '/auth/google/callback',
      // profileFields: ['id', 'emails', 'displayName', 'picture.type(large)'],
      passReqToCallback: true
    };

    this.steam = {
      returnURL: 'http://localhost:' + this.port + '/auth/steam/callback',
      realm: 'http://localhost:' + this.port + '/',
      apiKey: '0230F2C933953FC17F839089920490F0',
      passReqToCallback: true
    };

    this.uploadDir = 'public\\uploads';
    this.uploadPostThumbnailDir = this.uploadDir + '\\posts\\thumbnails';
  }

  // hbs(app) {
  //   i18n.configure({
  //     locales: ['en', 'de', 'ru'],
  //     defaultLocale: 'ru',
  //     directory: __dirname + '/locales',
  //     cookie: 'locale',
  //   });

  //   app.engine('hbs', hbs.express4({
  //     partialsDir: __dirname + '/views/_partials',
  //     defaultLayout: "views/layouts/main",
  //     layoutsDir: "views/layouts",
  //     i18n: i18n,
  //     onCompile: function (exhbs, source, filename) {
  //       var options;
  //       if (filename && filename.indexOf('partials') > -1) {
  //         options = { preventIndent: true };
  //       }
  //       return exhbs.handlebars.compile(source, options);
  //     }
  //   }));
  //   app.use(i18n.init);
  //   hbsHelpers(hbs);

  // }

}

module.exports = new Config(process.env.NODE_ENV);
