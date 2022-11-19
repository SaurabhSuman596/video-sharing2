import User from '../models/User';
import bcrypt from 'bcryptjs';
import createError from '../error';
import jwt from 'jsonwebtoken';

export const signUp = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({
      ...req.body,
      password: hash,
    });
    await newUser.save();
    res.status(200).json('User has been created!');
  } catch {
    (err) => {
      next(err);
    };
  }
};

export const signIn = async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) {
      return next(createError(404, 'User not found!'));
    }

    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    !isCorrect && next(createError(403, 'Wrong password or username!'));

    const token = jwt.sign({ id: user._id }, process.env.SEC_KEY);

    const { password, ...others } = user._doc;

    res
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  } catch {
    (err) => next(err);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.SEC_KEY);
      res
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .status(200)
        .json(user._doc);
    } else {
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });

      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.SEC_KEY);
      res
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .status(200)
        .json(savedUser._doc);
    }
  } catch {
    (err) => {
      next(err);
    };
  }
};
