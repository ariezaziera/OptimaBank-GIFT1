const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');

passport.serializeUser((user, done) => {
  done(null, user.id); // save MongoDB user ID to session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value.toLowerCase();
    let user = await User.findOne({ email });
    
    if (user) {
      // 👉 User exists, just log them in
      return done(null, user);
    }

    // ❌ If not exist, create a new one
    user = new User({
      firstName: profile.name.givenName || 'GoogleUser',
      lastName: profile.name.familyName || '',
      email: email,
      provider: 'google',
      password: '', // Or optional, depending on your schema
    });

    await user.save();
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));
