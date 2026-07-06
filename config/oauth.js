const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../database/init');

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_URL,
      },
      (accessToken, refreshToken, profile, done) => {
        // Store user and tokens
        const user = {
          id: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          photo: profile.photos[0].value,
          googleAccessToken: accessToken,
          googleRefreshToken: refreshToken,
        };

        // Save to database
        db.saveUser(user);
        return done(null, user);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    const user = db.getUser(id);
    done(null, user);
  });
};
