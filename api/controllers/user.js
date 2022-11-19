import createError from '../error';
import User from '../models/User';
import video from '../models/Video';

export const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(200).json(updateUser);
    } catch {
      (err) => next(err);
    }
  } else {
    return next(createError(403, 'You can only update only your account!'));
  }
};

// delete account

export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json('User has been deleted!');
    } catch {
      (err) => next(err);
    }
  } else {
    return next(createError(403, 'You can delete only your account!'));
  }
};

//Get User

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch {
    (err) => next(err);
  }
};

// subscribe

export const subscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, { $inc: { subscribers: 1 } });
    res.status(200).json('Subcription successfully!');
  } catch {
    (err) => next(err);
  }
};

// Unsubscribe

export const unsubscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { subsCribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, { $inc: { subscribers: -1 } });
    res.status(200).json('UnSubscription successfull!');
  } catch {
    (err) => next(err);
  }
};
